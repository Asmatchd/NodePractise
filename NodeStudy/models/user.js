const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');


//creat ninja schema and model
const UserSchema = new Schema({
        name: {
            type: String,
            required: [true, 'Name field is required'],
        },
        fname: {
            type: String
        },
        email: {
            type:String,
            required: [true, 'Email field is required'],
            unique:true
        },
        type: {
            type: String,
            default: "user"
        },
        password: {
            type: String,
            required: [true, 'Password field is required'],
        }
    },
    {
        //used to remove (--v) version key from database document
        versionKey: false // You should be aware of the outcome after set to false

    });

UserSchema.plugin(uniqueValidator);

const User = mongoose.model('users', UserSchema);
module.exports = User;