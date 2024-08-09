const Food = require('../Model/FoodModels');
const Order = require('../Model/OrderModels');
const User = require('../Model/UserModels');

const getAllUser = async (req, res) => {
    try {
        const data = await User.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const getAllFood = async (req, res) => {
    try {
        const data = await Food.find().sort({ createdAt: -1 }); 
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching foods:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Add a new food item
const addFood = async (req, res) => {
    try {
      const { name, smallPrice, mediumPrice, largePrice, image, description, category } = req.body.food;
  
      const foodData = {
        name,
        variants: ["small", "medium", "large"],
        prices: {
          small: smallPrice,
          medium: mediumPrice,
          large: largePrice
        },
        category,
        image,
        description
      };

  
      const newFood = new Food(foodData);  
      await newFood.save();
      res.status(201).json(newFood);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  

const getSpecificFood = async (req, res) => {
    try {
        const { id } = req.params;
        const getFoodById = await Food.findOne({ _id: id });
        if (getFoodById) {
            res.status(200).json(getFoodById);
        } else {
            res.status(404).json({ message: "Food Not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server Error" });
    }
};

const allOrders = async (req, res) => {
    try {
        const getOrder = await Order.find();
        if (getOrder) {
            res.status(200).json(getOrder);
        } else {
            res.status(404).json({ message: "Orders Not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server Error" });
    }
};

const orderCompleteOrNot = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findOne({ _id: id });
        if (order) {
            order.isDelivered = true;
            const updatedOrder = await order.save();
            res.status(200).json({ message: "Completed" });
        } else {
            res.status(404).json({ message: "Order Not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server Error" });
    }
};

const editFood = async (req, res) => {
    try {
        const { EditFoodData } = req.body;
        const id = EditFoodData.id;

        // Convert prices to numbers
        const prices = [
            { size: 'small', price: parseFloat(EditFoodData.prices.small) },
            { size: 'medium', price: parseFloat(EditFoodData.prices.medium) },
            { size: 'large', price: parseFloat(EditFoodData.prices.large) }
        ];

        // Validate that prices are valid numbers
        if (prices.some(p => isNaN(p.price))) {
            return res.status(400).json({ message: "Invalid price values" });
        }

        const updatedFood = await Food.findOneAndUpdate(
            { _id: id },
            {
                name: EditFoodData.name,
                image: EditFoodData.image,
                description: EditFoodData.description,
                category: EditFoodData.category,
                prices,
                variants: ['small', 'medium', 'large'],
            },
            { new: true } // Return the updated document
        );

        if (updatedFood) {
            res.status(200).json(updatedFood);
        } else {
            res.status(404).json({ message: "Can't update" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server Error" });
    }
};

const deleteFood = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteConfirm = await Food.findByIdAndDelete({ _id: id });
        if (deleteConfirm) {
            res.status(200).json({ message: "Deleted food" });
        } else {
            res.status(404).json({ message: "Can't delete" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server Error" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteConfirm = await User.findByIdAndDelete({ _id: id });
        if (deleteConfirm) {
            res.status(200).json({ message: "Deleted user" });
        } else {
            res.status(404).json({ message: "Can't delete" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server Error" });
    }
};

module.exports = { getAllUser, getAllFood, addFood, getSpecificFood, allOrders, orderCompleteOrNot, editFood, deleteFood, deleteUser };
