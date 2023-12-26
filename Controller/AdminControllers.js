const Food = require("../Model/FoodModels");
const Order = require("../Model/OrderModels");
const User = require("../Model/UserModels");

const getAllUser = async (req, res) => {
    try {
        const data = await User.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json("Internal server error");
    }
};

const getAllFood = async (req, res) => {
    try {
        const data = await Food.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json("Internal server error");
    }
};

const addFood = async (req, res) => {
    try {

        const food = req.body.food;
        const newFood = new Food({
            name: food.name,
            image: food.image,
            description: food.description,
            category: food.category,
            prices: [food.prices],
            variants: ["small", "medium", "large"],
        });
        await newFood.save();
        res.send("Food Added")

    } catch (error) {
        return res.send({ message: "Something went wrong" })
    }
};


const getSpecificFood = async (req, res) => {
    try {
        const { id } = req.params;
        const getFoodById = await Food.findOne({ _id: id });
        if (getFoodById) {
            res.status(200).json(getFoodById)
        }
        else {
            res.status(500).json("Food Not found")
        }
    } catch (error) {
        return es.status(500).json("Internal server Error")
    }
};


const allOrders = async (req, res) => {
    try {
        const getOrder = await Order.find()
        if (getOrder) {
            res.status(200).json(getOrder)
        }
        else {
            res.status(500).json("Orders Not found")
        }
    } catch (error) {
        return es.status(500).json("Internal server Error")
    }
};


const orderCompleteOrNot = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findOne({ _id: id })
        order.isDelivered = true;
        const updatedOrNot = await order.save();
        if (updatedOrNot) {
            res.status(200).json("Completed")
        }
        else {
            res.status(500).json("Orders Not found")
        }
    } catch (error) {
        return res.status(500).json(error)
    }
};

const editFood = async (req, res) => {
    try {
        const { EditFoodData } = req.body;
        const id = EditFoodData.id;

        const updatedFood = await Food.findOneAndUpdate(
            { _id: id },
            {
                name: EditFoodData.name,
                image: EditFoodData.image,
                description: EditFoodData.description,
                category: EditFoodData.category,
                prices: [EditFoodData.prices],
                variants: ["small", "medium", "large"],

            },
        );
        if (updatedFood) {
            res.send(updatedFood);
        } else {
            res.send("Can't update");
        }
    } catch (error) {
        return res.send(error)
    }
};

const deleteFood = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteConfirm = await Food.findByIdAndDelete({ _id: id })
        if (deleteConfirm) {
            res.json("Deleted food");
        } else {
            res.json("Can't delete");
        }

    } catch (error) {
        return res.send(error)
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteConfirm = await User.findByIdAndDelete({ _id: id })
        if (deleteConfirm) {
            res.json("Deleted food");
        } else {
            res.json("Can't delete");
        }

    } catch (error) {
        return res.send(error)
    }
}

module.exports = { getAllUser, getAllFood, addFood, getSpecificFood, allOrders, orderCompleteOrNot, editFood, deleteFood, deleteUser };


