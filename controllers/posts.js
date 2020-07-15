const { Posts, validatePost } = require('../models/social/posts');
const cloudinary = require('../middleware/cloudinary');
const { Profile } = require('../models/social/profile')

const lodash = require('lodash');

exports.newPost = async (req, res) => {
    const { error } = validatePost(req.body);
    if (error) return res.status(400).send(error.message);

    const profile = await Profile.find({ userID: req.user._id });
    const newimage = await cloudinary.upload(req.files[0].path);
    let post = new Posts({
        postedBy: profile._id,
        caption: req.body.caption,
        image: newimage.url
    });
    await post.save();
    res.send(post);

}

exports.newLike = async (req, res) => {
    const likedPost = await Posts.findById(req.params.id);
    if (!likedPost) return res.status(404).send('no post with that id');

    const profile = await Profile.findOne({ userID: req.user._id });
    likedPost.likeBy.push(profile._id);

    await likedPost.save();

    res.send("liked")
}

exports.newComment = async (req, res) => {
    let commentPost = await Posts.findById(req.params.id);
    if (!commentPost) return res.status(404).send('no post with that id');

    const profile = await Profile.findOne({ userID: req.user._id });
    const comment = {
        commentbody: req.body.comment,
        commentBy: profile._id
    }
    commentPost.comment.push(comment);
    commentPost = await commentPost.save();
    res.send('comment successfully');
}

exports.getPost = async (req, res) => {
    let post = await Posts
        .findById(req.params.id)
        .populate([
            {
                path: 'postedBy',
                select: 'username image -_id'
            },
            {

                path: 'comment.commentBy',
                select: 'username image'
            }])
        .select('-_id -updatedAt -comment._id -comment.commentBy._id');

    if (!post) return res.status(404).send('there is no post with that id');


    res.send(post)
}

exports.getPosts = async (req, res) => {
    let posts = await Posts.find()
        .populate([
            {
                path: 'postedBy',
                select: 'username image'
            },
            {

                path: 'comment.commentBy',
                select: 'username image'
            }])
        .select('-_id -updatedAt -comment._id -comment.commentBy._id');
    res.send(posts);
}