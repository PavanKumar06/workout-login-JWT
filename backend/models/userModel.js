const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        length: 6
    }
})

//encrypt password, creating a static method called signup
userSchema.statics.signup = async function (email, password) {
    //validation
    if (!email || !password) {
        throw Error("All fields are required");
    }

    if (!validator.isEmail(email)) {
        throw Error("Please enter a valid Email");
    }

    if (!validator.isStrongPassword(password)) {
        throw Error("Password is not strong enough");
    }

    const exists = await this.findOne({ email });

    if (exists) {
        throw Error("Email already in use");
    }
    
    //SALT - is a random string added to the password bcrypt does this
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    //This will store the data in the DB
    const user = await this.create({ email, password: hash });

    return user;
}

userSchema.statics.login = async function(email, password) {
    //validation
    if (!email || !password) {
        throw Error("All fields are required");
    }

    const user = await this.findOne({ email });

    if (!user) {
        throw Error("Email does not exist");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw Error("Invalid password");
    }

    return user;
}

module.exports = mongoose.model('User', userSchema);