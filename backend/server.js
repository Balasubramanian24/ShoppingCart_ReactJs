const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const payRoutes = require('./routes/payRoutes')

dotenv.config();

const app = express();
connectDB();


app.use(cors());
app.use(express.json());


app.use('/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use(payRoutes);


const PORT = process.env.PORT  || 5000;
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
})