const User = require('../models/user')
const {hashPassword, comparePasswords} = require('../helpers/auth')

const test = (req, res) => {
    res.json('test is working')
}

const registerUser = async (req, res) =>{
    try{
        const{username, firstName, lastName, email, password} = req.body
        if(!username){
            return res.json({
                error: 'username is required'
            })
        };
        if(!firstName){
            return res.json({
                error: 'first name is required'
            })
        };
        if(!lastName){
            return res.json({
                error: 'last name is required'
            })
        };
        if(!password || password.length < 8){
            return res.json({
                error: 'password must be at least 8 characters'
            })
        };
        const exist = await User.findOne({email})
        if(exist){
            return res.json({
                error: 'email is taken'
            })
        }
        if(!(email.endsWith(".com") || email.endsWith(".org") || email.endsWith(".net") || email.endsWith(".edu") || email.endsWith(".gov")) || !email.includes("@")){
            return res.json({
                error: 'please enter a valid email'
            })
        }

        

        const hashedPassword = await hashPassword(password)
        const user = await User.create({
            username, 
            firstName,
            lastName,
            email, 
            password: hashedPassword,
            adr: generateRandomNumbers(5, 100, 200),
            revenue: generateRandomNumbers(5, 1000000, 3000000),
            adrVSrevpar: generateRandomNumbers(5, 100, 200),
            occupancyRate: generateRandomNumbers(5, 60, 99),
            guestSatisfaction: generateRandomNumbers(5, 3, 5),
        })

        return res.json(user)
    } catch(error){
        console.log(error)
    }
}

const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body

        const user = await User.findOne({email})
        if(!user){
            return res.json({
                error: 'no user found'
            })
        }

        const match = await comparePasswords(password, user.password)
        if(match) {
            res.json({
                success: true,
                user: {
                    id: user._id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }
            })
        }
        else{
        return res.json({
        error: 'incorrect password'
        })
    }
    } catch (error) {
        console.log(error)
    }
}

function generateRandomNumbers(count, min, max) {
    const numbers = [];
    for (let i = 0; i < count; i++) {
        const num = (min + (Math.random() * (max - min))).toFixed(2);
        numbers.push(num);
    }
    return numbers;
}

const getUserData = async (req, res) => {
    try{
    const { email } = req.query

    const user = await User.findOne({email})

    return res.json({
        user
    })
}
catch (error) {
    console.log(error)
}
}




module.exports = {
    test,
    registerUser,
    loginUser,
    getUserData
}