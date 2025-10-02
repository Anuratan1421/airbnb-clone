import express from "express";
import Razorpay from "razorpay";
import cors from "cors";
import dotenv from "dotenv";


const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();

const key_id  = process.env.key_id;
const key_secret = process.env.key_secret;

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
