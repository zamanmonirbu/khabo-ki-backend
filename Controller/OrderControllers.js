const Order = require("../Model/OrderModels");
const dotenv = require("dotenv");
dotenv.config();
const stripe_key = process.env.STRIPE_KEY;
const stripe = require("stripe")(stripe_key);

const { v4: uuidv4 } = require("uuid");
const Food = require("../Model/FoodModels");

const placementOrder = async (req, res) => {
    const { token, subTotal, currentUser, cartItems } = req.body;
    try {
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id,
        });

        const payment = await stripe.charges.create(
            {
                amount: subTotal * 100,
                currency: "inr",
                customer: customer.id,
                receipt_email: token.email,
            },
            {
                idempotencyKey: uuidv4(),
            }
        );
        if (payment) {
            const newOrder = new Order({
                name: currentUser.name,
                email: currentUser.email,
                userid: currentUser._id,
                orderItems: cartItems,
                orderAmount: subTotal,
                shippingAddress: {
                    street: token.card.address_line1,
                    city: token.card.address_city,
                    country: token.card.address_country,
                    pincode: token.card.address_zip,
                },
                transactionId: payment.source.id,
            });

            const result = await newOrder.save();
            if (result) {
                res.send("Payment success");
            }
        }
    } catch (error) {
        return res.status(400).json(error);
    }
};

const getAllOrdersByUser = async (req, res) => {
    const { userid } = req.body;
    try {
        const orders = await Order.find({ userid: userid }).sort({ _id: -1 });
        res.send(orders);
    } catch (error) {
        return res.status(400).json({ message: "Something went wrong" });
    }
};

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const getMostOrderedFoods = async (req, res) => {
    try {
        const mostOrderedFoods = await Order.aggregate([
            { $unwind: "$orderItems" }, // Flatten the orderItems array
            { 
                $group: { 
                    _id: "$orderItems._id", 
                    count: { $sum: { $toInt: "$orderItems.quantity" } } 
                } 
            }, // Group by foodId and sum quantities
            { $sort: { count: -1 } }, // Sort by count in descending order
            { 
                $lookup: { 
                    from: "foods", // Name of the foods collection
                    let: { foodId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", { $toObjectId: "$$foodId" }] } } }
                    ],
                    as: "foodDetails" 
                } 
            },
            { $unwind: "$foodDetails" }, // Flatten the foodDetails array
            // { 
            //     $project: { 
            //         _id: 0, 
            //         foodId: "$_id", 
            //         count: 1, 
            //         name: "$foodDetails.name", 
            //         price: "$foodDetails.prices" 
            //     } 
            // }
        ]);

        if (mostOrderedFoods.length > 0) {
            res.status(200).json(mostOrderedFoods);
        } else {
            res.status(404).json({ message: "No data found" });
        }
    } catch (error) {
        console.error("Error fetching most ordered foods:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};







module.exports = { placementOrder, getAllOrdersByUser,getMostOrderedFoods }
