const router = require('express').Router();
const auth = require('../middleware/auth');
const cleanupDirectChatAccess = require('../scripts/cleanup-direct-chat');

// @route   POST /admin/cleanup-direct-chat
// @desc    Clean up invalid direct chat access
// @access  Private (Admin only)
router.post('/cleanup-direct-chat', auth, async (req, res) => {
    try {
        const result = await cleanupDirectChatAccess();
        if (result.success) {
            res.json({ 
                message: 'Cleanup completed successfully',
                cleanupCount: result.cleanupCount
            });
        } else {
            res.status(500).json({ 
                message: 'Cleanup failed',
                error: result.error
            });
        }
    } catch (error) {
        console.error('Cleanup API error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;
