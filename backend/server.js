import express from "express";
import Razorpay from "razorpay";
import cors from "cors";
import dotenv from "dotenv";
import React from "react";
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";


const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();

const key_id  = process.env.key_id;
const key_secret = process.env.key_secret;
const jwt_secret = process.env.JWT_SECRET;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));  

const userSchema = new mongoose.Schema({
  name: String,
  address: {
    City: String,
    State: String,
    Country: String,
    Zipcode: String
  },
  contact_no: {
    type: String,   // Use String to preserve leading zeros
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);  // Must be exactly 10 digits
      },
      message: props => `${props.value} is not a valid 10-digit number!`
    },
    required: [true, 'User contact number required']
  },
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

const propertySchema = new mongoose.Schema({
  id: Number,
  image: String,
  title: String,
  rating: Number,
  distance: String,
  price: String,
  period: String,
  bagde: String
});

const Property = mongoose.model('propertie', userSchema);

const profileSchema = new mongoose.Schema({
  name: String,
  address: {
    City: String,
    State: String,
    Country: String,
    Zipcode: String
  },
  contact_no: {
    type: String,   // Use String to preserve leading zeros
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);  // Must be exactly 10 digits
      },
      message: props => `${props.value} is not a valid 10-digit number!`
    },
    required: [true, 'User contact number required']
  },
  email: String,
  date_of_birth: Date,

});

const Profile = mongoose.model('profile', userSchema);

const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  checkIn: Date,
  checkOut: Date,
  nights: Number,
  guests: Number,
  notes: String,
  paymentId: String,
});

const Booking = mongoose.model("booking", bookingSchema);


// API to register user
app.post("/register", async (req, res) => {
  console.log(req.body);
  const { name, contact_no, email, password } = req.body;
  const hashedPassword = await bcryptjs.hash(password, 10);
  const newUser = new User({ name, contact_no, email, password: hashedPassword });
  const newProfile = new Profile({ name, contact_no, email });
  //check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Save user to database
  await newUser.save();
  await newProfile.save();
  res.status(201).json({ message: "User registered successfully" });
});

// API to login user
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // Compare passwords
  const isMatch = await bcryptjs.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  // Create and sign JWT
  const token = jwt.sign({ userId: user._id, email: user.email }, jwt_secret, { expiresIn: "1h" });
  res.json({ token });
});

//Fetch profile

app.get("/profile", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");

    const profile = await Profile.findOne({ email: decoded.email });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    console.log(profile)
    res.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//Save Profile
app.post("/profile", async (req, res) => {
  try{
    const {name, address, contact_no, email, date_of_birth} = req.body;
    const profile = await Profile.findOneAndUpdate({ email: email }, { name, address, contact_no, date_of_birth }, { new: true });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json({ message: "Profile updated successfully", profile });

  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
})


//Fetch properties
app.get("/properties", async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
    console.log(properties)
  } catch (err) {
    res.status(500).send(err);
  }
});


// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: key_id,
  key_secret: key_secret,
});

// API to create order
app.post("/create-order", async (req, res) => {
  const { amount } = req.body;
  try {
    const options = {
      amount: amount,
      currency: "INR",
      receipt: "receipt#1",
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).send(err);
  }
});

// === Booking API (called after successful payment) ===
app.post("/booking", async (req, res) => {
  try {
    const bookingData = req.body;

    const booking = new Booking(bookingData);
    await booking.save(); // <-- saves to DB

    res.json({ success: true, message: "Booking confirmed!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Booking failed", error: err.message });
  }
});

// === GET bookings of a specific user ===
app.get("/bookings", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, jwt_secret); // decode JWT

    // Assuming you store user's email in the Booking schema
    const bookings = await Booking.find({ email: decoded.email }).sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching user bookings:", err);
    res.status(500).json({ message: "Failed to fetch bookings", error: err.message });
  }
});


app.listen(5000, () => console.log("Server running on port 5000"));
