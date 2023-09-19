module.exports = {
    async up(db) {
        await db
            .collection('users')
            .updateMany(
                { _id: { $exists: true } },
                { $unset: { postCount: 1, posts: 1, isAuthenticated: 1 } },
                { $set: { token: null } }
            );
    },

    async down(db) {
        const users = await db.collection('users').find().toArray();

        for (const user of users) {
            const posts = await db
                .collection('posts')
                .find({ userId: user._id })
                .toArray();

            if (posts?.length) {
                await db.collection('users').updateOne(
                    { _id: user._id },
                    {
                        $set: {
                            postCount: posts.length,
                            posts: posts.map((post) => post._id),
                            isAuthenticated: false,
                        },
                        $unset: { token: 1 },
                    }
                );
            }
        }
    },
};
