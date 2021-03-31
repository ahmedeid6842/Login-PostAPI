const { ObjectId } = require("mongodb");

const _db = require("../middleware/db").getDB;
const cloudinary = require("../middleware/cloudinary");

module.exports.followingPost = async (req, res) => {
    _db().db().collection("users").updateOne({ _id: ObjectId(req.params.id) }, { $push: { followers: ObjectId(req.body.id) } })
    _db().db().collection("users").updateOne({ _id: ObjectId(req.body.id) }, { $push: { following: ObjectId(req.params.id) } })
    res.send("done");

}

module.exports.followGet = async (req, res) => {
    let query = {};

    if (req.query.followers) {
        query.projection = "follwers"
        query.selection = { _id: ObjectId(req.query.followers) }
    } else if (req.query.following) {
        query.projection = "following"
        query.selection = { _id: ObjectId(req.query.following) }
    }
    let user = await _db().db()
        .collection("users")
        .aggregate([
            {
                $match: query.selection
            }
            ,
            {
                $lookup: {
                    from: "users",
                    let: { [query.projection]: `$${query.projection}` },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ["$_id", `$$${query.projection}`]
                                }
                            }
                        }
                    ],
                    as: `${query.projection}`
                }
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    [query.projection]: { name: 1, email: 1 }
                }
            }
        ]).toArray();


    res.send(user);
}

module.exports.updating = async (req, res) => {
    const _id = ObjectId(req.body._id);

    const unFollowing = new ObjectId(req.body.unFollowing);
    delete req.body.unFollower; delete req.body.unFollowing; delete req.body._id;

    if (req.files.length > 0) {
        const image = await cloudinary.uploads(req.files[0].path);
        req.body.image = image.url
        fs.unlinkSync(req.files[0].path)
    }
    let user = _db().db().collection("users").findOne({ email: req.body.email });
    if (user) return res.status(400).send("email already exsists");

    user = await _db()
        .db()
        .collection("users")
        .updateMany(
            { $or: [{ _id: _id }, { _id: unFollowing }] },
            [
                { $set: req.body },
                {
                    $addFields: {
                        following: {
                            $cond: {
                                if: { $eq: ["$_id", _id] },
                                then: {
                                    $filter: {
                                        input: "$following",
                                        as: "item",
                                        cond: {
                                            $ne: ["$$item", unFollowing]
                                        }
                                    }
                                },
                                else: "$following"
                            }
                        },
                        followers: {
                            $cond: {
                                if: { $eq: ["$_id", unFollowing] },
                                then: {
                                    $filter: {
                                        input: "$followers",
                                        as: "item2",
                                        cond: {
                                            $ne: ["$$item2", _id]
                                        }
                                    }
                                },
                                else: "$followers"
                            }
                        }
                    }
                }
            ],
            { returnOriginal: false }
        )
    res.send(user);
}