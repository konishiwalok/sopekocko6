const Sauce = require('../models/sauce.model')

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
    //modification de l'url de l'image, pour avoir une url complète
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });

  sauce.save()
    .then(() => res.status(201).json({ message: sauceObject.name}))
    .catch(error => res.status(400).json({ error }));
}
// MODIFY + IMAGE + TEXTES esperame


const updateSauces = async (req, res) => {
  
  const sauceObject = req.file ?
  //modification des données et rajout d'une nouvelle image
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : //sinon on traite juste les données
    { ...req.body };

  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
    .catch(error => res.status(400).json({ error }));
}

// DELETE + IMAGE

const deleteSauces = async (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then(thing => {
      const filename = thing.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
}



// LIKES DISLIKES

const likeSauces  = async (req, res) => {


  const ketchup = {
    id: 1,
    likes: 0,
    dislikes: 0,
    userDislikes: [],
    userLikes: []
}
 
const choice = {
    LIKE: 1,
    DISLIKE: -1,
    RESET: 0,
}
 
function vote(userId, userChoice, sauce) {
    if (!(Number.isInteger(userChoice) && (userChoice >= -1 && userChoice <= 1) && Number.isInteger(userId))) {
        console.log('error ')
        return null
    }
 
    if(userChoice === choice.RESET){
        console.log('reset all likes ')
        removeUser(userId, sauce.userLikes)
        removeUser(userId, sauce.userDislikes)
    }
    if(userChoice === choice.LIKE){
        console.log('user liked the sauce ')
        if(sauce.userLikes.find(u => u === userId)){
            console.log('user already voted ‍')
            return 'you have déjà voté !'
        }
        sauce['userLikes'].push(userId)
        sauce['likes'] = ketchup['userLikes'].length
 
        if(sauce.userDislikes.find(u => u === userId)){
            removeUser(userId, sauce.userDislikes)
        }
    }
 
    if(userChoice === choice.DISLIKE){
        console.log('user hate the sauce ')
        if(sauce.userDislikes.find(u => u === userId)){
            console.log('user already voted ‍')
            return 'you have déjà voté !'
        }
        ketchup['userDislikes'].push(userId)
        ketchup['dislikes'] = ketchup['userDislikes'].length
 
        if(sauce.userLikes.find(u => u === userId)){
            removeUser(userId, sauce.userLikes)
        }
    }
 
    sauce.likes = sauce.userLikes.length
    sauce.dislikes = sauce.userDislikes.length
 
    return sauce
}
 
function removeUser(userId, likesTab) {
    const index = likesTab.indexOf(userId)
    if (index > -1) {
        likesTab.splice(index, 1)
    }
 
    return likesTab
}
 
console.log(vote(1, 1, ketchup)) // user like the sauce
console.log(vote(1, -1, ketchup)) // user dislike the sauce
console.log(vote(1, 0, ketchup)) // user reset all sauces
// our user is very hungry and liked the sauce twice, but then got caught by our police :-)
console.log(vote(1, 1, ketchup))
console.log(vote(1, 1, ketchup))
 
console.log('MY SAUCE', ketchup)

}

module.exports = {
  getAllSauces,
  getOneSauce,
  createSauces,
  updateSauces,
  deleteSauces,
  likeSauces
};
