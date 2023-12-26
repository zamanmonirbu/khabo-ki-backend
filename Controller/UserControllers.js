const User = require("../Model/UserModels");

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


module.exports = { userRegister, userLogin }