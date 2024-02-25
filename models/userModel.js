const mongoose = require("mongoose")
const validator = require('validator')
const bcryptjs = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please tell us your name"]
    },
    email:{
        type:String,
        required:[true, "Please provide an email"],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail, "Please provide an email"]
    },
    password:{
        type:String,
        required:[true, "Please provide a password"],
        minlength:8,
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true, "Please confirm your password"],
        validate:{
            validator:function(el){
                return el ===this.password
            },
            message: "Passwords are not the same"
        }
    },
    photo: String,
    passwordChangedAt: Date,
    passwordResetToken:String,
    passwordResetExpires:Date,
    active:{
        type:Boolean,
        default:true,
        select:false
    }
})

userSchema.pre('save', async function (next){
    if(!this.isModified('password')) return next();
    this.password = await bcryptjs.hash(this.password,12);
    this.passwordConfirm = undefined;
    next()
})

userSchema.methods.correctPassword = async (candidatePassword, userPassword) => {
    return await bcryptjs.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
    if(this.passwordChangedAt){
        const changedTimeStamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,10
        )
        return JWTTimeStamp < changedTimeStamp
    }
}

const User = mongoose.model("User", userSchema);
module.exports = User