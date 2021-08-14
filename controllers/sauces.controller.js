const Sauce = require('../models/Sauce.model')
const User = require('../models/User.model')

const fs = require('fs');

const regex = /[a-zA-Z0-9 _.,'’(Ééèàû)]+$/;

// GET ALL THE PRODUCTS

exports.getAllSauces = (req, res, next) => {

  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
}

// GET ONE SAUCE WITH HIS ID
exports.getOneSauce = (req, res, next) => {

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};
// CREATE SAUCES + CONDITIONS + TEXTS 

exports.createSauces = (req, res, next) => {

  const sauceObject = JSON.parse(req.body.sauce);

  console.log(sauceObject);

  if (!regex.test(sauceObject.name) || !regex.test(sauceObject.manufacturer) ||
    !regex.test(sauceObject.description) || !regex.test(sauceObject.mainPepper) ||
    !regex.test(sauceObject.heat)) {
    return res.status(500).json({ error: 'Des champs contiennent des caractères invalides' });
  }

  const sauce = new Sauce({
    ...sauceObject,
    //changing the url of the image, to have a complete url
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });

  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce sauvegardé !' }))
    .catch(error => res.status(400).json({ error }));
}
// MODIFY + IMAGE + TEXTS 


exports.updateSauces = (req, res, next) => {

  const sauceObject = req.file ?
    //modifying data and adding a new image
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : ///otherwise we just process the data
    { ...req.body };

  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifié !' }))
    .catch(error => res.status(400).json({ error }));
}

// DELETE + IMAGE

exports.deleteSauces = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(thing => {
      const filename = thing.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
}



// LIKES DISLIKES
exports.likeSauces = (req, res, next) =>  {

  const choice = {
    LIKE: 1,
    DISLIKE: -1,
    RESET: 0,
  }
  const idSauce = req.params.id
  const { userId, like: userChoice } = req.body

  if (!(Number.isInteger(userChoice) && (userChoice >= -1 && userChoice <= 1))) {
    console.log('error ')
    return null
  }

  Sauce.findById(idSauce)
    .then(sauce => {
      if (userChoice === choice.RESET) {
        console.log('reset all likes ')
        removeUser(userId, sauce.usersLiked)
        removeUser(userId, sauce.usersDisliked)
      }

      if (userChoice === choice.LIKE) {
        console.log('user liked the sauce ')
        if (sauce.usersLiked.find(u => u === userId)) {
          console.log('user already voted ‍')
          return 'you have déjà voté !'
        }
        sauce['usersLiked'].push(userId)
        sauce['likes'] = sauce['usersLiked'].length

        if (sauce.usersDisliked.find(u => u === userId)) {
          removeUser(userId, sauce.userDislikes)
        }
      }

      if (userChoice === choice.DISLIKE) {
        console.log('user hate the sauce ')
        if (sauce.usersDisliked.find(u => u === userId)) {
          console.log('user already voted ‍')
          return 'you have déjà voté !'
        }
        sauce['usersDisliked'].push(userId)
        sauce['dislikes'] = sauce['usersDisliked'].length

        if (sauce.usersLiked.find(u => u === userId)) {
          removeUser(userId, sauce.usersLiked)
        }
      }

      sauce.likes = sauce.usersLiked.length
      sauce.dislikes = sauce.usersDisliked.length

      //console.log(sauce)
      const { usersLiked, usersDisliked, likes, dislikes } = sauce;
      const campos = {
        usersLiked, usersDisliked, likes, dislikes
      }

      Sauce.findByIdAndUpdate(idSauce, campos, { new: true })
        .then(sauceLike => {
          res.status(200).json({ message: 'Cambiado', sauceLike })
        })
        .catch(error => res.status(500).json({ error }))
    })
    .catch(error => res.status(500).json({ error }));
}

const removeUser = (userId, likesTab) => {
  const index = likesTab.indexOf(userId)
  if (index > -1) {
    likesTab.splice(index, 1)
  }

  return likesTab
}