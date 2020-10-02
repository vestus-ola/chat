/**
 |---------------------------------------------------------
 | API Routes
 | All routes end point comes here
 |---------------------------------------------------------
 */

// Include plugins and modules
let express = require('express');
let router = express.Router();
let AuthGuard = require('../app/auth');

// Include controllers
let RegisterController = require('../app/controllers/RegisterController');
let LoginController = require('../app/controllers/LoginController');
let PasswordController = require('../app/controllers/PasswordController');
let TokenController = require('../app/controllers/TokenController');
let UserController = require('../app/controllers/UserController');
let MessageController = require('../app/controllers/MessageController');
let GroupMessageController = require("../app/controllers/GroupMessageController");

// validate email
router.post('/validate/email', RegisterController.validateDuplicateEmail);

// validate phone
router.post('/validate/phone', RegisterController.validateDuplicatePhone);

// Register new user
router.post('/register', RegisterController.register);

// Login registered user
router.post('/login', LoginController.login);

// Request Forgot Password
router.post('/forgot_password', PasswordController.sendResetPasswordCode);

// Verify password code
router.post('/forgot_password/verify', PasswordController.verifyPasswordCode);

// Change user password
router.put('/change_password/password', PasswordController.changeUserPassword);

// Refresh authentication token
router.get('/token/refresh', AuthGuard, TokenController.refreshToken);

// Delete refresh token
router.post('/token/delete', AuthGuard, TokenController.deleteRefreshToken);

// Send friend request
router.post('/user/send_friend_request', AuthGuard, UserController.sendFriendRequest);

// Show friend request notification
router.get('/user/friend_request_notification', AuthGuard, UserController.showFriendRequestNotification);

// Accept or decline friend request
router.post('/user/friend_request/accept_or_decline/:friend_id', AuthGuard, UserController.acceptOrDeclineFriendRequest);

// Count all unread friend request notifications
router.get('/user/friend_request/unread/count', AuthGuard, UserController.countAllUnreadFriendRequest);

// Mark all unread friend request notifications as read
router.get('/user/friend_request/mark_as_read', AuthGuard, UserController.markAllFriendRequestNotificationAsRead);

// Show all user friends
router.get('/user/friends', AuthGuard, UserController.showAllFriends);

// Get all messages by friend
router.get('/user/chat_messages/:friend_id', AuthGuard, MessageController.showMessageByFriend);

// Show chat lists
router.get('/user/chat_lists', AuthGuard, UserController.showLastChatMessage);

// Message (chat) friend
router.post('/user/send_message/:friend_id', AuthGuard, MessageController.messageFriend);

// Mark private message as read by friend
router.get("/user/friend/message/:friend_id", AuthGuard, MessageController.markMessageAsReadByFriend);

// User create new group
router.post("/group/create", AuthGuard, UserController.addNewGroup);

// Show all groups
router.get("/group/group_list", AuthGuard, UserController.showAllGroups);

// Get all messages by group
router.get("/user/group_messages/:group_id",  AuthGuard, GroupMessageController.showMessageByGroup);

module.exports = router;