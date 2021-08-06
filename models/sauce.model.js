const { Schema, model } = require('mongoose');

// Modèle des sauces avec le type de données
const SauceSchema = Schema({
    name: {type: String, required: true, maxLength: 20},
    manufacturer: {type: String, required: true, maxLength: 20},
    description: {type: String, required: true, minLength: 10},
    heat: {type: Number, required: true},
    likes: {type: Number, required: false},
    dislikes: {type: Number, required: false},
    imageUrl: {type: String, required: true},
    mainPepper: {type: String, required: true},
    usersLiked: {type: [String], required: false},
    usersDisliked: {type:[String], required: false},
    userId: {type: String, required: true}
});

SauceSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.id = _id;

    return object
})

module.exports = model('Sauce', SauceSchema);