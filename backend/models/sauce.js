const mongoose = require('mongoose');


const sauceSchema = mongoose.Schema ({
    userId: {type: String,required},
    name: {type: String, required}, 
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, reuired: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    //like & dislike
    likes: { type: Number, 'default': 0 },
    dislikes: { type: Number, 'default': 0 },
    usersLiked: { type: Array, 'default': [] },
    usersDisliked: { type: Array, 'default': [] }
})

module.exports = mongoose.model('modelsSauce', sauceSchema);