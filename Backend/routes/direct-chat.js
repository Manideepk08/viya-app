// Accept direct chat request
router.post('/direct-chat/:transactionId/accept', auth, async (req, res) => {
  try {
    const { transactionId } = req.params;
    
    // Find the transaction
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ msg: 'Direct chat request not found' });
    }

    // Verify the recipient is the one accepting
    if (String(transaction.chatId) !== String(req.user.id)) {
      return res.status(403).json({ msg: 'Not authorized to accept this request' });
    }

    if (transaction.status === 'completed') {
      return res.status(400).json({ msg: 'Direct chat already accepted' });
    }

    // Update transaction status
    transaction.status = 'completed';
    await transaction.save();

    // Add users to each other's direct chat profiles
    const sender = await User.findById(transaction.userId);
    const recipient = await User.findById(transaction.chatId);

    if (!sender.directChatProfiles.includes(transaction.chatId)) {
      sender.directChatProfiles.push(transaction.chatId);
      await sender.save();
    }

    if (!recipient.directChatProfiles.includes(transaction.userId)) {
      recipient.directChatProfiles.push(transaction.userId);
      await recipient.save();
    }

    // Remove the direct chat request notification
    await Notification.deleteMany({
      type: 'direct_chat_request',
      'metadata.transactionId': transactionId
    });

    // Send acceptance notification to sender
    const notification = await Notification.create({
      title: 'Direct Chat Request Accepted',
      message: `${recipient.fullName || 'A user'} has accepted your direct chat request`,
      type: 'direct_chat_accepted',
      recipients: [transaction.userId]
    });

    // Send real-time notification
    const io = req.app.get('io');
    if (io) {
      io.to(transaction.userId.toString()).emit('notification:new', {
        title: notification.title,
        message: notification.message,
        type: 'direct_chat_accepted',
        notificationId: notification._id
      });
    }

    res.json({
      success: true,
      message: 'Direct chat request accepted'
    });

  } catch (error) {
    console.error('Error accepting direct chat:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});
