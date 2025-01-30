const Stripe = require('stripe');
const express = require('express');
const dotenv = require('dotenv');


dotenv.config();
const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);


router.post("/api/pay", async (req, res) =>{
    try {
        const { amount, currency } = req.body;

        if (!amount || !currency) {
            return res.status(400).json({ error: "Amount and currency are required" });
        }

        if(amount <= 0) {
            return res.status(400).json({ error: "Amount must be in positive values" });
        }

        const paymentIntent = await stripe.paymentIntents.create ({
            amount: 5000,
            currency: "usd",
        })

        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Error while payment intent:", error);
        res.status(500).json({ error: "Failed to create payment intent, please try again" });
    }
});

module.exports = router;