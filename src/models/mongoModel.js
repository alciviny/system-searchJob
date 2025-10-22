import mongoose from "mongoose";

const usuario= new mongoose.Schema({
    nome:{type:String},
    email:{type:String},
    senha:{type:String}
})