const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const UserSchema = new  mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        maxlength: [100, 'Name cannot be more than 100 Characters']
    },

    email: {
        type: String,
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    role: {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minLength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpiredAt: Date,
    createAt: {
        type: Date,
        default: Date.now
    }

});


//Encrypt password with bcryptjs
UserSchema.pre('save', async function(next) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt)

});


//Sign JWT and return token
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
};



//Match user password
UserSchema.methods.matchPassword = async function (password) {
   return await bcrypt.compare(password, this.password)
};

module.exports = mongoose.model('Users', UserSchema);