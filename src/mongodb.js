const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/pro")
.then(()=>{
    console.log("Mongodb connected")
})
.catch(()=>{
    console.log("Failed to connect")
})

const formSchema = new mongoose.Schema({
    name:{
        type:String
    },
    phone:{
        type: String
    },
    email:{
        type: String
    },
    address:{
        type:String
    },
    age:{
        type: Number
    },
    gender:{
        type: String
    }
})

const collection = new mongoose.model("Coll",formSchema);
module.exports = collection;
