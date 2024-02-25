const { promisify } = require('util')
const User = require('./../models/userModel')
const jwt = require('jsonwebtoken')

const signToken = (id) => {
    return jwt.sign({id:id}, process.env.JWT_SECRET, {expiresIn:process.env.JWT_EXPIRES_IN})
}

exports.signup =  async (req, res) => {
    try{
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        })

        const token = jwt.sign({id:newUser._id,},process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXPIRES_IN})

        res.status(201).json({
            status: "Success",
            data: {newUser, token}
        })
    }catch(err){
        res.status(400).json({
            status: "Fail",
            message: err.message
        })
    }
}

exports.login = async (req, res) => {
    try{
        // 1. check email and password exist 
        const {email, password} = req.body;
        if(!email || !password){
            throw new Error ('provide email and password')
        }
        // 2. check if user exist and correct password in db
        const user = await User.findOne({email}).select('+password');
        if(!user || !(await user.correctPassword(password, user.password))){
            throw new Error('Incorect email or password')
        }
        const token = signToken(user.id);
        // 3. if everything ok, send token to client
        res.status(201).json({
            data: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            token
        })
    }catch(err){
        res.status(400).json({
            status: 'failed to login',
            message: err.message
        })
    }
}


// exports.logout = async (req, res) => {
//     try{
//       await User.findOneAndUpdate({_id: req.user._id}, {accessToken: ""})
//       res.status(200).json({
//         status: "Success",
//       })
//     }catch(err){
//         res.status(400).json({
//         status: "Fail",
//         message: err.message,
//       });
//     }
//   }

exports.protect = async (req, res, next) => {
    // 1. get token
    let token;
    try{
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1]
            console.log(token)
        }
        if(!token){
            throw new Error ('User was not authenticated')
        }
        // 2. verificate token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        console.log('decoded', decoded)
        // 3. check if user still exist
        const currentUser = await User.findById(decoded.id);
        if(!currentUser){
            throw new Error ('user not exist')
        }
        // 4. check user change password after token was issued
        if(currentUser.changedPasswordAfter(decoded.iat)){
            throw new Error ('user changed password')
        }
        // 5. grant acces 
        req.user = currentUser
    }catch(err){
        res.status(400).json({
            status:'failed',
            error: err.message
        })
    }
    next()
}