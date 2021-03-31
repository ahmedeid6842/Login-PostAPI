const { ObjectId } = require("mongodb");

let _db = require("../middleware/db").getDB;

module.exports.followingPost = async (req, res) => {
    const returned = await _db().db().collection("users").updateOne({ _id: ObjectId(req.params.id) }, { $push: { followers: ObjectId(req.body.id) } })
    _db().db().collection("users").updateOne({ _id: ObjectId(req.body.id) }, { $push: { following: ObjectId(req.params.id) } })


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
    const updaingQuery = {}, _id = req.body._id;

    updaingQuery.unFollowing = { following: new ObjectId(req.body.unFollowing) };
    updaingQuery.unFollower = { followers: new ObjectId(req.body.unFollower) };

    delete req.body.unFollower; delete req.body.unFollowing; delete req.body._id;

    console.log(req.body);
    const user = await _db()
        .db()
        .collection("users")
        .findOneAndUpdate(
            { _id: ObjectId(_id) },
            { $set: req.body, $pull: updaingQuery.unFollowing },
            { returnOriginal: false }
        )
    res.send(user);
}







// $project: {
//     following: {
//         $cond: {
//             if: { $eq: ["$_id", ObjectId("5fa05a57a4d9a054c5b313e9")] },
//             then: {
//                 $filter: {
//                     input: "$following",
//                     as: "test",
//                     cond: {
//                         $ne: ["$$test", ObjectId("5fa05a57a4d9a054c5b313e8")]
//                     }
//                 }
//             },
//             else: "$following"
//         }
//     },
//     followers: {
//         $cond: {
//             if: { $eq: ["$_id", ObjectId("5fa05a57a4d9a054c5b313e8")], }
//         }
//     }
// }



[
    {
        $match: { userId }
    },
    {
        $lookup: {
            from: "users",
            let: { "userID": "$userId" },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: ["$_id", "$$userID"]
                        }
                    }
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
            ],
            as: "users"
        }
    },

]