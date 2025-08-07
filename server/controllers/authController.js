const User = require('../models/user')

const test = (req, res) => {
    res.json('test is working')
}

const registerUser = async (req, res) =>{
    try{
        const{username, email, password} = req.body
        if(!username){
            return res.json({
                error: 'username is required'
            })
        };
        if(!password || password.length < 8){
            return res.json({
                error: 'password must be at least 8 characters'
            })
        };
        const exist = await User.findOne({email})
        if(!exist){
            return res.json({
                error: 'email is taken'
            })
        }

        const user = await User.create({
            username, email, password
        })

        return res.json(user)
    } catch(error){
        console.log(error)
    }
}

module.exports = {
    test,
    registerUser
}