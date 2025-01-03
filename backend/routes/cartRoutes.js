const express = require('express');
const router = express.Router();
const User = require('../models/User');
const mongoose = require('mongoose');

// Adding product to cart
router.post('/update', async (req, res) => {
    const { userId, cart } = req.body;

    // Validate ObjectId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid or missing User ID' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.cart = cart || [];
        await user.save();

        res.status(200).json({ message: 'Cart updated successfully', cart: user.cart });
    } catch (error) {
        console.error('Error during cart update:', error);
        res.status(500).json({ message: 'Server error', error: error.stack });
    }
});

// Add a product to the cart
router.post('/add-to-cart', async (req, res) => {
    const { userId, productId, quantity } = req.body;
    
    if (!userId || !mongoose.Types.ObjectId.isValid(userId) || !productId || !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid or missing User ID or Product ID' });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const cartItem = user.cart.find((item) => item.productId.toString() === productId);

        if (cartItem) {
            cartItem.quantity += quantity;
        } else {
            user.cart.push({ productId, quantity });
        }

        await user.save();
        res.status(200).json({ message: 'Product added to cart', cart: user.cart });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get user's cart
router.get('/cart/:userName', async (req, res) => {
    const { userId } = req.params;

    console.log( userId )
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid User ID' });
    }

    try {
        const user = await User.findById(userId).populate('cart.productId');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update product quantity in cart
router.put('/update-cart', async (req, res) => {
    const { userId, productId, quantity } = req.body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId) || !productId || !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid or missing User ID or Product ID' });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const cartItem = user.cart.find((item) => item.productId.toString() === productId);

        if (cartItem) {
            if (quantity > 0) {
                cartItem.quantity = quantity; // Update quantity
            } else {
                user.cart = user.cart.filter((item) => item.productId.toString() !== productId); // Remove item if quantity is 0
            }

            await user.save();
            res.status(200).json({ message: 'Cart updated', cart: user.cart });
        } else {
            res.status(404).json({ message: 'Product not found in cart' });
        }
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.delete('/remove', async (req, res) => {
    const { userId, productId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid User ID or Product ID' });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove the product from the cart
        user.cart = user.cart.filter(item => item.productId.toString() !== productId);

        await user.save(); // Save changes to the database

        res.status(200).json({ message: 'Product removed from cart', cart: user.cart });
    } catch (error) {
        console.error("Error removing product from cart:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


module.exports = router;
