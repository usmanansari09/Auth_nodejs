// server.js
const express = require("express");
const connectDB = require("./db");


const app = express();
connectDB();

app.use(express.json({ extended: false }));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/listingproducts", require("./routes/listingproducts"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
