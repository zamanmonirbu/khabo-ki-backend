const express = require('express')
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
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
},{
  timestamps:true,
});

const Food = mongoose.model('Food', foodSchema);


app.get('/api/food/getFoods', async(req, res) => {
   try {
    const data= await Food.find();
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
  


app.listen(port, () => {
    console.log("http://localhost:3001");
})
