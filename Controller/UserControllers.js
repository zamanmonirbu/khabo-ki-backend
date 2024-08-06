const User = require("../Model/UserModels");
const Food = require('../Model/FoodModels');

const userRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newUser = new User({ name, email, password });
        const savedData = await newUser.save();
        if (savedData) {
            res.json(savedData);
        } else {
            res.json("Can't save");
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (user) {
            const currentUser = {
                name: user.name,
                email: user.email,
                _id: user._id,
                isAdmin: user.isAdmin,
            };
            res.json(currentUser);
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const filterProduct = async (req, res) => {
    try {
      const { category, size, priceRange } = req.query;
  
      // Initialize the query object
      let query = {};
  
      // Add category filter if specified
      if (category) {
        query.category = category;
      }
  
      // Initialize an array to store $or conditions
      let orConditions = [];
  
      // Add size filter if specified
      if (size) {
        orConditions.push({ 'variants': size });
      }
  
      // Add price range filter if specified
      if (priceRange) {
        const priceQuery = buildPriceQuery(priceRange, size);
        orConditions.push(priceQuery);
      }
  
      // Combine all conditions with $or if any condition exists
      if (orConditions.length > 0) {
        query.$or = orConditions;
      }
  
      // Fetch filtered food items
      const foods = await Food.find(query);
      res.json(foods);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  
  // Helper function to build price range query
  const buildPriceQuery = (priceRange, size) => {
    const [min, max] = priceRange.split('-').map(Number);
  
    // Handle price range based on size
    return {
      $expr: {
        $and: [
          { $gte: [{ $arrayElemAt: [{ $filter: { input: "$prices", as: "price", cond: { $eq: ["$$price.size", size] } } }, 0] }, min] },
          { $lte: [{ $arrayElemAt: [{ $filter: { input: "$prices", as: "price", cond: { $eq: ["$$price.size", size] } } }, 0] }, max] }
        ]
      }
    };
  };
  
  module.exports = { userRegister, userLogin, filterProduct };
  