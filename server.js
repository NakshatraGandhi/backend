const express = require("express");
const cors = require("cors");
require('dotenv').config();

const app = express();

const paymentRoutes = require("./routes/paymentRoutes");
const addressRoutes = require("./routes/addressRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const supportRoutes = require("./routes/supportRoutes");


app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/services", require("./routes/serviceRoutes"));
app.use("/api/shops", require("./routes/shopRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/shop-services", require("./routes/shopServiceRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/favourites", require("./routes/favouriteRoutes"));
app.use("/api/notifications", notificationRoutes);
app.use("/api/support", supportRoutes);

app.use("/api/google", require("./routes/googlePlaces"));
app.use("/uploads", express.static("uploads"));
app.use("/api/addresses", addressRoutes);
app.use("/api/address", addressRoutes);
app.use('/api/admin', require('./routes/adminRoutes'));

app.use("/api/payment", paymentRoutes);

//  ROOT CHECK
app.get("/", (req, res) => {
  res.send("Bookzen API is running ");
});

//  IMPORTANT FIX
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});