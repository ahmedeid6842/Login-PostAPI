const { ObjectId } = require("mongodb");

const cloudinary = require("../middleware/cloudinary");
const _db = require("../middleware/db").getDB;
const fs = require("fs")

module.exports.addPost = async (req, res) => {
    const { userId, caption } = req.body;
    let image;
    if (req.files.length > 0) {
        image = await cloudinary.uploads(req.files[0].path);
        image = image.url
        fs.unlinkSync(req.files[0].path)
    }
    const post = await _db()
        .db()
        .collection("posts")
        .insertOne(
            {
                userId: new ObjectId(userId),
                caption,
                image
            },
            { writeConcern: { w: 1, j: 1 } }
        )
    res.send(post)
}

module.exports.addLike = async (req, res) => {
    const post = await _db()
        .db()
        .collection("posts")
        .findOneAndUpdate(
            { _id: ObjectId(req.params.id) },
            { $addToSet: { likes: new ObjectId(req.body.userId) } },
            { returnOriginal: false }
        )
    res.send(post)
}

module.exports.addComment = async (req, res) => {
    const { userId, comment } = req.body;
    const post = await _db()
        .db()
        .collection("posts")
        .findOneAndUpdate(
            { _id: ObjectId(req.params.id) },
            {
                $push: {
                    comments: {
                        commentedBy: ObjectId(userId),
                        comment: comment
                    }
                }
            },
            { returnOriginal: false }
        )
    res.send(post);
}

module.exports.getPost = async (req, res) => {
    const post = await _db()
        .db()
        .collection("posts")
        .aggregate([
            {
                $match: {
                    _id: ObjectId("5faae9dd39d39f464813d5cd")
                }
            },
            {
                $lookup: {
                    from: "users",
                    let: { "like": `$likes` },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ["$_id", `$$like`]
                                }
                            }
                        }
                    ],
                    as: `likes`
                }
            },
            {
                $lookup: {
                    from: "users",
                    let: { "comment": "$comments.commentedBy", "co": "$comments.comment" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ["$_id", "$$comment"]
                                }
                            }
                        },
                        {
                            $project: {
                                "name": { $concat: ["$name.first", " ", "$name.last"] },
                            }
                        },
                        {
                            $replaceRoot: {
                                newRoot: "$comments"
                            }
                        }
                    ],
                    as: "comments.commentedBy"
                }
            },
        ]).toArray()

    res.json(post);
}


