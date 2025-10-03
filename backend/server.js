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

// API to register user
app.post("/register", async (req, res) => {
  console.log(req.body);
  const { name, contact_no, email, password } = req.body;
  const hashedPassword = await bcryptjs.hash(password, 10);
  const newUser = new User({ name, contact_no, email, password: hashedPassword });

  //check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Save user to database
  await newUser.save();
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
  const token = jwt.sign({ userId: user._id }, jwt_secret, { expiresIn: "1h" });
  res.json({ token });
});

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

app.listen(5000, () => console.log("Server running on port 5000"));
