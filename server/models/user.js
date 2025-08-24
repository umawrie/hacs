const mongoose = require('mongoose')
const{Schema} = mongoose

const userSchema = new Schema({
    username: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    adr: [Number],
    revenue: [Number],
    adrVSrevpar: [Number],
    occupancyRate: [Number],
    guestSatisfaction: [Number],
})

const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel