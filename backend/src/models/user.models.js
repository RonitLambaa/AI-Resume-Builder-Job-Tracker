import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"


const userSchema = new Schema({
    avatar : {
        type : {
            url : String,
            localPath : String
        },
        default : {
            url : "https://placehold.co/200x200",
            localPath : ""
        }
    },

    username : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        index : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true
    },
    fullname : {
        type : String,
        trim : true
    },
    password : {
        type : String,
        required : [true, "Password is required"],
        minlength : [6, "Password must be at least 6 characters long"],
        select : false
    },
    refreshToken : {
        type : String
    }
},
   {
    timestamps : true
   } 
)           

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()    
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function() {
 
    return jwt.sign(
        {
            _id : this._id.toString(),
            email : this.email,
            username : this.username,     
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    
    return jwt.sign(
        {
            _id : this._id.toString()
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)