module.exports = {
    async up(db) {
        await db.collection('likes').updateMany(
            { _id: { $exists: true } },
            {
                $unset: {
                    userName: 1,
                },
            }
        );
    },

    async down(db) {
        const likes = await db.collection('likes').find().toArray();

        for (const like of likes) {
            const user = await db
                .collection('users')
                .findOne({ _id: like.userId });

            if (user) {
                await db
                    .collection('likes')
                    .updateOne(
                        { _id: like._id },
                        { $set: { userName: user.userName } }
                    );
            }
        }
    },
};
