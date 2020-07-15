const { validateLogin, User } = require('../models/users');
const { Profile } = require('../models/social/profile');
const { Posts } = require('../models/social/posts');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(erorr.message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('invalid email or password');

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(400).send('invalid email or password');

    if (user.Activate === false) return res.status(401).send('please activate your account ');

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(`login successfully ${user.name}`)
}

exports.userData = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('no user with that id');

    const profile = await Profile.find({ userID: user._id });
    if (!profile) return res.status(404).send('no profile with that id');

    const post = await Posts.find({ postedBy: profile._id });

    res.send({
        user,
        profile,
        post
    })
}

exports.visitUser = async (req, res) => {
    const profile = await Profile.findOne({ userID: req.params.id });

    if (!profile) return res.status(404).send('user with that id');
    const postsCount = await Posts.find({ postedBy: profile._id }).countDocuments();
    const followersCount = profile.followers.length;
    const followingCount = profile.following.length;
    res.send({
        postCount: postsCount,
        followersCount: followersCount,
        followingCount: followingCount
    });
}

exports.getPosts = async (req, res) => {
    let posts = await Posts.find()
        .populate([
            {
                path: 'postedBy',
            },
            {
                path: 'comment.commentBy',
            }])
    res.send(posts);
}