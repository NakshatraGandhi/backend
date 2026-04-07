const express = require("express");
const router = express.Router();
const crypto = require("crypto");

// ✅ VERIFY PAYMENT
router.post("/verify", (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    // ✅ GET SECRET FROM ENV
    const secret = process.env.RAZORPAY_SECRET;

    if (!secret) {
      return res.status(500).json({ error: "Secret key missing" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      return res.json({
        success: true,
        message: "Payment verified successfully"
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid signature"
      });
    }
  } catch (err) {
    console.error("Payment Verification Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;