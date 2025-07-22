const mongoose = require('mongoose');
const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');
require('dotenv').config();

const cleanupDirectChatAccess = async () => {
    let connection;
    try {
        connection = await mongoose.connect(process.env.MONGO_URI, {
            tls: true
        });
        console.log('Connected to MongoDB');

        const users = await User.find({ directChatProfiles: { $exists: true, $not: { $size: 0 } } });
        console.log(`Found ${users.length} users with direct chat access`);

        let cleanupCount = 0;
        for (const user of users) {
            const originalDirectChatCount = user.directChatProfiles.length;
            for (const profileId of [...user.directChatProfiles]) { // Create copy to avoid mutation during iteration
                // Check if they have paid 3000 for this profile
                const directChatTx = await Transaction.findOne({
                    userId: user._id,
                    chatId: profileId,
                    type: 'direct_chat',
                    status: 'completed',
                    amount: 3000
                });

                const interestTx = await Transaction.findOne({
                    userId: user._id,
                    chatId: profileId,
                    type: 'other',
                    status: 'completed',
                    amount: 199
                });

                if (!directChatTx && interestTx) {
                    console.log(`Removing invalid direct chat access for user ${user._id} to profile ${profileId}`);
                    user.directChatProfiles = user.directChatProfiles.filter(id => 
                        id.toString() !== profileId.toString()
                    );
                    cleanupCount++;
                }
            }
            
            if (user.directChatProfiles.length !== originalDirectChatCount) {
                await user.save();
            }
        }

        console.log(`Cleanup completed. Removed ${cleanupCount} invalid direct chat accesses`);
        return { success: true, cleanupCount };
    } catch (error) {
        console.error('Error during cleanup:', error);
        return { success: false, error: error.message };
    }
};

cleanupDirectChatAccess();
