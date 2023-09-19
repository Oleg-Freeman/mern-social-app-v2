module.exports = {
    async up(db) {
        await db.collection('posts').updateMany(
            { _id: { $exists: true } },
            {
                $unset: {
                    userName: 1,
                    likeCount: 1,
                    commentCount: 1,
                    imageURL: 1,
                    comments: 1,
                    likes: 1,
                },
            }
        );
    },

    async down(db) {
        const posts = await db.collection('posts').find().toArray();

        console.log(posts);

        for (const post of posts) {
            const user = await db
                .collection('users')
                .findOne({ _id: post.userId });
            const comments = await db
                .collection('comments')
                .find({ postId: post._id })
                .toArray();
            const likes = await db
                .collection('likes')
                .find({ postId: post._id })
                .toArray();
            const update = { $set: {} };

            if (user) {
                update.$set.userName = user.userName;
                update.$set.imageURL = user.imageURL;
            }
            if (comments?.length) {
                update.$set.comments = comments.map((comment) => comment._id);
                update.$set.commentCount = comments.length;
            }
            if (likes?.length) {
                update.$set.likes = likes.map((like) => like._id);
                update.$set.likeCount = likes.length;
            }
            if (Object.keys(update.$set).length) {
                await db
                    .collection('posts')
                    .updateOne({ _id: post._id }, update);
            }
        }
    },
};
