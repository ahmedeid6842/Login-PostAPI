const mongoose = require('mongoose');
const joi = require('joi');
joi.objectId = require('joi-objectid')(joi)

const postsScehma = new mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'profiles'
    },
    caption: {
        type: String,
        minlength: 5,
        maxlength: 1000,
        required: function () {
            return !this.image
        }
    },
    image: {
        type: String,
        required: function () {
            return !this.caption
        }
    },
    likeBy: {
        type: [mongoose.Types.ObjectId],
        ref: 'profiles'
    },
    comment: {
        type: [
            new mongoose.Schema({
                commentbody: {
                    type: String,
                    minlength: 1,
                    maxlength: 200,
                    required: true
                },
                commentBy: {
                    type: mongoose.Types.ObjectId,
                    ref: 'profiles',
                    required: true
                }
            })
        ]
    }


}, { timestamps: true })

function validatePost(post) {
    const schema = {
        caption: joi.string().min(5).max(1000),
    }
    return joi.validate(post, schema);
}

module.exports.Posts = mongoose.model('posts', postsScehma);
module.exports.validatePost = validatePost;