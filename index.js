const express = require('express')
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const stripe = require('stripe')("sk_test_51OQBiWIHoIMM5DdU1utEYQkdD6Ca9ZETR2rrRxfkQVnOWOqOVn0p7Hg8z9xV0xdZoNZAoOw4zHoVIEctDHdr1LWQ00Yw6YVHII");
const { v4: uuidv4 } = require('uuid');
dotenv.config();
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const cors = require('cors')
app.use(cors());


const port = process.env.PORT;
const url = process.env.URL;


mongoose.connect(url).then((res) => { console.log("Connected") }).catch((err) => { console.log("Can't connect", err); })

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  variants: [],
  prices: [],
  category: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
});

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
}, {
  timestamps: true,
});

const Food = mongoose.model('Food', foodSchema);
const User = mongoose.model('User', userSchema);

app.post('/api/user/register', async (req, res) => {
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


app.get('/api/food/getFoods', async (req, res) => {
  try {
    const data = await Food.find();
    res.status(200).json(data)

  } catch (error) {
    res.status(500).json("Internal server error")
  }
});

app.post('/', async (req, res) => {
  try {
    const { name, variants, prices, category, image, description } = req.body;
    const newData = new Food({ name, variants, prices, category, image, description });
    const save = await newData.save();

    if (save) {
      res.status(200).json(save);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

app.post('/api/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
      const currentUser = {
        name: user.name,
        email: user.email,
        _id: user._id,
        isAdmin: user.isAdmin

      }
      res.json(currentUser);
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/api/orders/placeorder', async (req, res) => {
  const { token, subTotal, currentUser, cartItems } = req.body;

  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id
    });

    const payment = await stripe.charges.create({
      amount: subTotal * 100,
      currency: 'inr',
      customer: customer.id,
      receipt_email: token.email
    }, {
      idempotencyKey: uuidv4()
    });
console.log("hello",currentUser.name,
        currentUser.email,
        currentUser._id,
        cartItems,
        subTotal,token);

    const newOrder = new Order({
        name: currentUser.name,
        email: currentUser.email,
        userid: currentUser._id,
        orderItems: cartItems,
        orderAmount: subTotal,
        shippingAddress: {
          street: token.cart.address_line1,
          city: token.cart.address_city,
          country: token.cart.address_country,
          pincode: token.cart.address_zip,
        },
        transactionId: payment.source.id,
      });
      console.log("OrderDetails",newOrder);

    // if (payment) {
    //   // console.log(payment);

    //   const newOrder = new Order({
    //     name: currentUser.name,
    //     email: currentUser.email,
    //     userid: currentUser._id,
    //     orderItems: cartItems,
    //     orderAmount: subTotal,
    //     shippingAddress: {
    //       street: token.cart.address_line1,
    //       city: token.cart.address_city,
    //       country: token.cart.address_country,
    //       pincode: token.cart.address_zip,
    //     },
    //     transactionId: payment.source.id,
    //   });
    //   console.log("OrderDetails",newOrder);
    //   // await newOrder.save();
    //   res.send("Payment success");
    // } else {
    //   res.send("Payment failed");
    // }
  } catch (error) {
    return res.status(400).json(error);
  }
});

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  userid: { type: String, required: true },
  orderItems: { type: Array, required: true },
  shippingAddress: { type: Object },
  orderAmount: { type: Number, required: true },
  isDelivered: { type: Boolean, required: true, default: false },
  transactionId: { type: String, required: true }
}, {
  timestamps: true
});

const Order = mongoose.model("Order", orderSchema);


app.listen(port, () => {
  console.log("http://localhost:3001");
})
