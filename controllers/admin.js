const _db = require("../middleware/db").getDB;
const bcrypt = require("bcrypt");
const { result } = require("lodash");
const { ObjectId } = require("mongodb");

module.exports.postLogin = async (req, res) => {
    const { email, password } = req.body;
    let user = await _db()
        .db()
        .collection("users")
        .findOne({ email });
    if (!user) return res.status(400).send("invlid email or password");
    bcrypt.compare(password, user.password, (err, result) => {
        if (err) return res.status(500).send("internal server error");
        return result ? res.status(200).send("login successfully") : res.status(400).send("invlid email or password");
    })
}

module.exports.getUser = async (req, res) => {

    const _id = ObjectId(req.params.id)
    let user = await _db()
        .db()
        .collection("users")
        .aggregate([
            {
                $match: { _id }
            },
            {
                $project: {
                    "name": {
                        $concat: [
                            { $toUpper: { $substrCP: ["$name.first", 0, 1] } },
                            {
                                $substrCP: [
                                    "$name.first",
                                    1,
                                    {
                                        $subtract: [
                                            { $strLenCP: "$name.first" },
                                            1
                                        ]
                                    }

                                ]
                            },
                            " ",
                            { $toUpper: { $substrCP: ["$name.last", 0, 1] } },
                            {
                                $substrCP: [
                                    "$name.last",
                                    1,
                                    {
                                        $subtract: [
                                            { $strLenCP: "$name.last" },
                                            1
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    email: 1
                }
            }
        ]).toArray();
    user.push(await _db() //try .push you can also use another varible "profile" and assign result to it
        .db()
        .collection("posts")
        .aggregate([
            {
                $match: { userId: _id }
            },
            {
                $project: {
                    caption: 1,
                    image: 1,
                    likes: { $size: "$likes" },
                    comments: { $size: "$comments" }
                }
            }
        ]).toArray());
    res.send(user);
}

module.exports.visitUser = async (req, res) => {
    let userId = ObjectId(req.params.id);
    let user = await _db()
        .db()
        .collection("posts")
        .aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: {
                        userId
                    },
                    postsNumber: { $sum: 1 },
                }
            },
            {
                $lookup: {
                    from: "users",
                    let: { "userId": "$_id.userId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$userId"]
                                }
                            }
                        },
                        {
                            $project: {
                                followerCount: { $size: "$followers" },
                                followingCount: { $size: "$following" },
                                _id: 0

                            }
                        }
                    ],
                    as: "follow"
                }
            }
        ]).toArray()
    res.send(user);
}

module.exports.getPosts = async (req, res) => {
    let posts = await _db()
        .db()
        .collection("posts")
        .aggregate([
            {
                $lookup: {
                    from: "users",
                    let: { "userId": "$userId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$userId"]
                                }
                            },
                        },
                        {
                            $project: {
                                name: { $concat: ["$name.first", " ", "$name.last"] },
                                email: 1
                            }
                        },
                    ],
                    as: "user"
                }
            },
            {
                $unset: ["userId"]
            },
        ]).toArray()
    res.send(posts);
}