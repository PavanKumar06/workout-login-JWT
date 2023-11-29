const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const createToken = (id, email) => {
    return jwt.sign({ _id: id, email: email }, process.env.SECRET, { expiresIn: '1d' })
}

//login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        //create token
        const token = createToken(user._id, user.email);

        res.status(200).json({ email, token });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }

    // res.json({msg: 'login'});
}

//signup
const signupUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.signup(email, password);
        //create token
        const token = createToken(user._id, user.email);

        res.status(200).json({ email, token });
    } catch(e) {
        res.status(400).json({ error: e.message });
    }
    
    // res.json({msg: 'signup'});
}

module.exports = { signupUser, loginUser }