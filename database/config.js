// getting-started.js
const mongoose = require('mongoose');

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);

const dbConnection = async () => {

    try {
        await mongoose.connect( process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });  
        console.log('DB Online');
    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la base de datos'); 
    }

}

module.exports = {
    dbConnection
}