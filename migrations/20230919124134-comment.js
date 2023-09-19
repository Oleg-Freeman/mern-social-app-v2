module.exports = {
    async up(db) {
        await db.collection('comments').updateMany(
            { _id: { $exists: true } },
            {
                $unset: {
                    userName: 1,
                    likeCount: 1,
                    commentCount: 1,
                    imageURL: 1,
                    likes: 1,
                },
            }
        );
    },

    async down(db) {
        const comments = await db.collection('comments').find().toArray();

        for (const comment of comments) {
            const user = await db
                .collection('users')
                .findOne({ _id: comment.userId });
            const likes = await db
                .collection('likes')
                .find({ commentId: comment._id })
                .toArray();
            const update = { $set: {} };

            if (user) {
                update.$set.userName = user.userName;
                update.$set.imageURL = user.imageURL;
            }
            if (likes?.length) {
                update.$set.likes = likes.map((like) => like._id);
                update.$set.likeCount = likes.length;
            }
            if (Object.keys(update.$set).length) {
                await db
                    .collection('comments')
                    .updateOne({ _id: comment._id }, update);
            }
        }
    },
};
