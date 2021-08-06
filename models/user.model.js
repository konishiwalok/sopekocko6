const { Schema, model } = require('mongoose');
//const uniqueValidator = require('mongoose-unique-validator');

const UserShema = Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

//UserSchema.plugin(uniqueValidator);

UserShema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();

    object.uid = _id;

    return object
})

module.exports = model( 'User', UserShema );