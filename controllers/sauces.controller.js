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

  const id = req.params.id;
  console.log(id);

  Sauce.findById(id).then(
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

const updateSauces = async (req, res) => {
  const sauceObject = req.file
  console.log(sauceObject);
  res.json({ message: 'SI paso'})
}

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

module.exports = {
  getAllSauces,
  getOneSauce,
  createSauces,
  updateSauces,
  deleteSauces
};



//app.post('/api/stuff', (req, res, next) => {
//  delete req.body._id;
//  const thing = new Thing({
//    ...req.body
//  });
//  thing.save()
//    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
//    .catch(error => res.status(400).json({ error }));
//});
//
//app.get('/api/stuff/:id', (req, res, next) => {
//  Thing.findOne({ _id: req.params.id })
//    .then(thing => res.status(200).json(thing))
//    .catch(error => res.status(404).json({ error }));
//});