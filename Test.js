const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
dotenv.config();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const cors = require("cors");
app.use(cors());

const port = process.env.PORT;
const url = process.env.URL;
const stripe_key = process.env.STRIPE_KEY;

const stripe = require("stripe")(stripe_key);

const mongoDBConnection = async () => {
  try {
    const connection = await mongoose.connect(url);
    if (connection) {
      console.log("Connected to MongoDB");
    } else {
      console.log("Unable to connect to MongoDB");
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

mongoDBConnection();

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    variants: [],
    prices: [],
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Food = mongoose.model("Food", foodSchema);
const User = mongoose.model("User", userSchema);

app.post("/api/user/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    console.log(newUser);

    const savedData = await newUser.save();

    if (savedData) {
      res.json(savedData);
    } else {
      res.json("Can't save");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get("/api/all/user", async (req, res) => {
  try {
    const data = await User.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json("Internal server error");
  }
});


app.get("/api/food/getFoods", async (req, res) => {
  try {
    const data = await Food.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json("Internal server error");
  }
});

app.post("/", async (req, res) => {
  try {
    const { name, variants, prices, category, image, description } = req.body;
    const newData = new Food({
      name,
      variants,
      prices,
      category,
      image,
      description,
    });
    const save = await newData.save();

    if (save) {
      res.status(200).json(save);
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

app.post("/api/user/login", async (req, res) => {
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
});

app.post("/api/orders/placeOrder", async (req, res) => {
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
});

const orderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    userid: { type: String, required: true },
    orderItems: { type: Array, required: true },
    shippingAddress: { type: Object },
    orderAmount: { type: Number, required: true },
    isDelivered: { type: Boolean, required: true, default: false },
    transactionId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

app.post("/api/orders/getUserOrders", async (req, res) => {
  const { userid } = req.body;
  try {
    const orders = await Order.find({ userid: userid }).sort({ _id: -1 });
    res.send(orders);
  } catch (error) {
    return res.status(400).json({ message: "Something went wrong" });
  }
});

app.post("/api/food/addFood", async (req, res) => {
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
});


app.get('/api/get/food/:id', async (req, res) => {
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
});


app.get('/api/orders/get/all/orders', async (req, res) => {
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
});

app.post('/api/order/delivery/:id', async (req, res) => {
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
});



app.put("/api/edit/food", async (req, res) => {
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
});


app.delete("/api/delete/food/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id)

    const deleteConfirm = await Food.findByIdAndDelete({ _id: id })
    if (deleteConfirm) {
      res.json("Deleted food");
    } else {
      res.json("Can't delete");
    }

  } catch (error) {
    return res.send(error)
  }
});

app.delete("/api/delete/user/:id", async (req, res) => {
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
});


app.listen(port, () => {
  console.log("http://localhost:3001");
});
