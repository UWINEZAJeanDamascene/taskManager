const mongoose = require('mongoose');
const dbConnection =  (url) => {
    return mongoose.connect( url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
      
}
module.exports = dbConnection;


