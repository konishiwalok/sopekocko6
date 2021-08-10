const Sauce = require('../models/sauce.model')
const User = require('../models/user.model')

const fs = require('fs');

const regex = /[a-zA-Z0-9 _.,'’(Ééèàû)]+$/;

const getAllSauces = async (req, res) => {

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


const getOneSauce = async (req, res) => {

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};


const createSauces = async (req, res) => {

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
    .then(() => res.status(201).json({ message: sauceObject.name }))
    .catch(error => res.status(400).json({ error }));
}
// MODIFY + IMAGE + TEXTS 


const updateSauces = async (req, res) => {

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

const deleteSauces = async (req, res) => {
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

const likeSauces = async (req, res) => {

  const choice = {
    LIKE: 1,
    DISLIKE: -1,
    RESET: 0,
  }
  const idSauce = req.params.id

  const { userId, like: userChoice } = req.body

  const sauce = await Sauce.findById(idSauce);

  if (!(Number.isInteger(userChoice) && (userChoice >= -1 && userChoice <= 1))) {
    console.log('error ')
    return null
  }

  console.log(sauce);

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

  const {usersLiked, usersDisliked, likes, dislikes } = sauce;

  const campos = {
    usersLiked, usersDisliked, likes, dislikes
  }

  const sauceLike = await Sauce.findByIdAndUpdate(idSauce, campos, { new: true });

  res.status(200).json({ message: 'Cambiado', sauceLike })
}

const removeUser = (userId, likesTab)  => {
  const index = likesTab.indexOf(userId)
  if (index > -1) {
    likesTab.splice(index, 1)
  }

  return likesTab
}

module.exports = {
  getAllSauces,
  getOneSauce,
  createSauces,
  updateSauces,
  deleteSauces,
  likeSauces
};
