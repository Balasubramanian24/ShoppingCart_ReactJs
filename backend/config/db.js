const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();


const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB Successfully");
    } catch(error) {
        console.error("Connection failed to MongoDB:", error.message);
        process.exit(1);
    }
}

module.exports = connectDB;