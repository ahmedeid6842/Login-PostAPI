const { Profile } = require('../models/social/profile');
const cloudinary = require('../middleware/cloudinary');

exports.followingPost = async (req, res) => {
    let followinguser = await Profile.findOne({ userID: req.user._id });

    let followeruser = await Profile.findById(req.params.id);

    followinguser.following.push(req.params.id);
    followeruser.followers.push(followinguser._id)

    await followinguser.save();
    await followeruser.save();
    res.send("done");
}

exports.getfollowers = async (req, res) => {
    if (req.query.followers) {
        let followers = await Profile.findById(req.query.followers).populate('followers', ['username', 'image']).select('followers');
        res.send({
            followers: followers,
            count: followers.followers.length
        })
    }
    if (req.query.following) {
        let following = await Profile
            .findById(req.query.following)
            .populate('following', ['username', 'image'])
            .select('following');
        res.send({
            following: following,
            count: following.following.length
        })
    }

}

exports.editing = async (req, res) => {
    let profile;
    if (req.query.edit === 'true' && req.query.name === 'true') {
        profile = await Profile.findOneAndUpdate({ userID: req.user._id }, {
            username: req.body.username
        }, { new: true })
            .select('-followers -following -userID');
    } else if (req.query.edit === 'true' && req.query.status === 'true') {
        profile = await Profile.findOneAndUpdate({ userID: req.user._id }, {
            status: req.body.status
        }, { new: true })
            .select('-followers -following -userID');
    } else if (req.query.edit === 'true' && req.query.image === 'true') {
        const newimage = await cloudinary.upload(req.files[0].path);
        profile = await Profile.findOneAndUpdate({ userID: req.user._id }, {
            image: newimage.url
        }, { new: true })
            .select('-followers -following -userID');
    } else if (req.query.unfollow) {
        let unfollowing = await Profile.findOne({ userID: req.user._id }).select('following');
        const unfollwers = await Profile.findById(req.query.unfollow);

        let index = unfollowing.following.indexOf(req.query.unfollow);
        unfollowing.following.splice(index, 1)
        index = unfollwers.followers.indexOf(unfollowing._id);
        unfollwers.followers.splice(index, 1);

        await unfollwers.save();
        unfollowing= await unfollowing.save();
        res.send(unfollowing)
    }


    res.send(profile);
}