/**
 |---------------------------------------------------------
 | User Controller
 |---------------------------------------------------------
 */
// Include modules or plugins
let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');
let HTTP = require('./RequestController');
let Helpers = require("./HelperController");
let Sequelize = require('sequelize');
let moment = require("moment-timezone");
let Op = Sequelize.Op;

// Include Models
let User = require('../../database/models').User;
let UserFriends = require('../../database/models').UserFriends;
let Message = require('../../database/models').Message;
let Group = require("../../database/models").Group;
let GroupUser = require("../../database/models").GroupUser;
let Role = require("../../database/models").Role;

require('dotenv').config();
let secret = process.env.JWT_SECRET;

class UserController {
  /**
   * Send friend request
   * @param {*} req
   * @param {*} res
   */
  static sendFriendRequest(req, res) {
    try {
      // Check authentication
      let auth = req.decoded.user.is_auth;

      if (auth) {
        // Get user ID
        let userID = req.decoded.user.id;

        // Request form data
        let search = req.body.search;

        User.findOne({
          where: {
            [Op.or]: [
              { email: search },
              { phone: search }
            ]
          }
        }).then(userIsValid => {
          if (userIsValid) {
            if (userID == userIsValid.id) {
              return HTTP.ERROR(res, "You can not add yourself.");
            } else {
              // Check if user already have friend
              UserFriends.findOne({
                where: { user_id: userID, friend_id: userIsValid.id }
              }).then(alreadyExist => {
                if (alreadyExist) {
                  if (alreadyExist.status == "pending") {
                    return HTTP.ERROR(res, 'Request already sent. Your friend request is still pending.');
                  } else if (alreadyExist.status == "accepted") {
                    return HTTP.ERROR(res, `You are already friend with ${userIsValid.fullname}`);
                  } else if (alreadyExist.status == "blocked") {
                    return HTTP.ERROR(res, `Your friend request has been blocked.`);
                  }
                } else {
                  UserFriends.create({
                    user_id: userID,
                    friend_id: userIsValid.id
                  }).then(saved => {
                    if (saved) {
                      return HTTP.OK(res, { message: 'Friend request sent!' });
                    } else {
                      return HTTP.FAILED(res);
                    }
                  }).catch(() => {
                    return HTTP.FAILED(res);
                  })
                }
              }).catch(() => {
                return HTTP.FAILED(res);
              })
            }
          } else {
            return HTTP.ERROR(res, "We can't find a user associated with your entry.");
          }
        }).catch(() => {
          return HTTP.FAILED(res);
        });
      } else {
        return HTTP.NOT_AUTHORIZED(res);
      }
    } catch (error) {
      return HTTP.NETWORK_ERROR(res);
    }
  }

  /**
   * Show friend request notification
   * @param {*} req
   * @param {*} res
   */
  static showFriendRequestNotification(req, res) {
    try {
      // Check authentication
      let auth = req.decoded.user.is_auth;

      if (auth) {
        // Get logged in user ID
        let userID = req.decoded.user.id;

        let friendRequests = [];

        // Get logged in user friends (followers)
        UserFriends.findAll({
          where: {
            user_id: userID,
            status: { [Op.ne]: "blocked" }
          },
          order: [['updatedAt', 'DESC']]
        }).then(async result => {
          if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
              let check = await User.findOne({
                where: { id: result[i].get().friend_id }
              });

              moment.tz.setDefault(new Intl.DateTimeFormat().resolvedOptions().timeZone);

              if (check) {
                let record = {
                  id: check.id,
                  fullname: check.fullname,
                  date: moment(result[i].updatedAt, "YYYY-MM-DD h:mm:ss").fromNow(),
                  image: check.image,
                  is_user: false,
                  is_friend: true,
                  status: result[i].status,
                  updatedAt: result[i].updatedAt
                };

                friendRequests.push(record);
              }
            }
          }

          // Get logged in user friend details (following)
          UserFriends.findAll({
            where: {
              friend_id: userID,
              status: { [Op.ne]: "blocked" }
            },
            order: [['updatedAt', 'DESC']]
          }).then(async data => {
            if (data.length > 0) {
              for (let i = 0; i < data.length; i++) {
                let check = await User.findOne({
                  where: { id: data[i].get().user_id }
                });

                moment.tz.setDefault(new Intl.DateTimeFormat().resolvedOptions().timeZone);

                if (check) {
                  let record = {
                    id: check.id,
                    fullname: check.fullname,
                    image: check.image,
                    date: moment(data[i].updatedAt, "YYYY-MM-DD h:mm:ss").fromNow(),
                    is_user: true,
                    is_friend: false,
                    status: data[i].status,
                    updatedAt: data[i].updatedAt
                  };

                  friendRequests.push(record);
                }
              }
            }

            // order date by latest
            friendRequests.sort((a, b) => b.updatedAt - a.updatedAt);
            return HTTP.OK(res, { data: friendRequests });
          }).catch(() => {
            return HTTP.FAILED(res);
          });
        }).catch(() => {
          return HTTP.FAILED(res);
        });
      } else {
        return HTTP.NOT_AUTHORIZED(res);
      }
    } catch (error) {
      return HTTP.NETWORK_ERROR();
    }
  }

  /**
   * Accept or decline friend request
   * @param {*} req
   * @param {*} res
   */
  static acceptOrDeclineFriendRequest(req, res) {
    try {
      // Check authentication
      let auth = req.decoded.user.is_auth;

      if (auth) {
        // Get user ID
        let userID = req.decoded.user.id;

        // Request params
        let friendID = req.params.friend_id;

        // Request Form Data
        let status = req.body.status;

        if (status == "decline") {
          UserFriends.destroy({ where: { user_id: userID, friend_id: friendID } }).then(deleted => {
            if (deleted) {
              return HTTP.OK(res, { message: 'Friend request declined' });
            } else {
              return HTTP.FAILED(res);
            }
          }).catch(() => {
            return HTTP.FAILED(res);
          })
        } else {
          UserFriends.findOne({
            where: {
              user_id: friendID,
              friend_id: userID,
              status: status
            }
          }).then(alreadyAccepted => {
            if (alreadyAccepted) {
              return HTTP.ERROR(res, 'Friend request already accepted!');
            } else {
              UserFriends.update({
                status: status
              }, {
                where: { user_id: friendID, friend_id: userID }
              }).then(updated => {
                if (updated) {
                  return HTTP.OK(res, { message: 'Friend request accepted.' })
                } else {
                  return HTTP.FAILED(res);
                }
              }).catch(() => {
                return HTTP.FAILED(res);
              })
            }
          }).catch(() => {
            return HTTP.FAILED(res);
          });
        }
      } else {
        return HTTP.NOT_AUTHORIZED(res);
      }
    } catch (error) {
      return HTTP.NETWORK_ERROR(res);
    }
  }

  /**
   * Block or unblock friend
   * @param {*} req
   * @param {*} res
   */
  static blockOrUnblockFriend(req, res) {

  }

  /**
   * Mark all friend request notifications as read
   * @param {*} req
   * @param {*} res
   */
  static async markAllFriendRequestNotificationAsRead(req, res) {
    try {
      // Check authentication
      let auth = req.decoded.user.is_auth;

      if (auth) {
        // Get logged in user ID
        let userID = req.decoded.user.id;

        // Mark all (user) notifications as read
        UserFriends.update(
          { user_read_status: "read" },
          {
            where: {
              user_id: userID,
              user_read_status: "unread"
            },
            silent: true
          }
        ).then(done => {
          if (done) {
            UserFriends.update(
              { friend_read_status: "read" },
              {
                where: {
                  friend_id: userID,
                  friend_read_status: "unread"
                },
                silent: true
              }
            ).then(done => {
              if (done) {
                return HTTP.OK(res, { message: "Notification marked as read." });
              } else {
                return HTTP.FAILED(res);
              }
            }).catch(() => {
              return HTTP.FAILED(res);
            })
          } else {
            return HTTP.FAILED(res);
          }
        }).catch(() => {
          return HTTP.FAILED(res);
        });
      } else {
        return HTTP.NOT_AUTHORIZED(res);
      }
    } catch (error) {
      return HTTP.NETWORK_ERROR();
    }
  }

  /**
   * Count all unread friend request notification
   * @param {*} req
   * @param {*} res
   */
  static countAllUnreadFriendRequest(req, res) {
    try {
      // Check authentication
      let auth = req.decoded.user.is_auth;

      if (auth) {
        // Get logged in user ID
        let userID = req.decoded.user.id;

        // Count all unread (user) friend request notification
        UserFriends.count({
          where: {
            user_id: userID,
            user_read_status: "unread",
            status: { [Op.ne]: "blocked" }
          }
        }).then(async userCount => {
          // count all unread (friend) friend request notification
          let friendCount = await UserFriends.count({
            where: {
              friend_id: userID,
              friend_read_status: "unread",
              status: { [Op.ne]: "blocked" }
            }
          });

          let totalCount = parseInt(userCount) + parseInt(friendCount);

          return HTTP.OK(res, { count: totalCount });
        }).catch(() => {
          return HTTP.FAILED(res);
        });
      } else {
        return HTTP.NOT_AUTHORIZED(res);
      }
    } catch (error) {
      return HTTP.NETWORK_ERROR();
    }
  }

  /**
   * Show all user friends
   * @param {*} req
   * @param {*} res
   */
  static showAllFriends(req, res) {
    try {
      // Check authentication
      let auth = req.decoded.user.is_auth;

      if (auth) {
        // Get logged in user ID
        let userID = req.decoded.user.id;

        let friends = [];
        let status = "accepted";

        // Get logged in user friends (followers)
        UserFriends.findAll({
          where: {
            user_id: userID,
            status: status
          }
        }).then(async result => {
          if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
              let check = await User.findOne({
                where: { id: result[i].get().friend_id }
              });

              if (check) {
                let record = {
                  id: check.id,
                  fullname: check.fullname,
                  image: check.image,
                  display_name: check.display_name,
                  email: check.email,
                  phone: check.phone
                };

                friends.push(record);
              }
            }
          }

          // Get logged in user friend details (following)
          UserFriends.findAll({
            where: {
              friend_id: userID,
              status: status
            }
          }).then(async data => {
            if (data.length > 0) {
              for (let i = 0; i < data.length; i++) {
                let check = await User.findOne({
                  where: { id: data[i].get().user_id }
                });

                if (check) {
                  let record = {
                    id: check.id,
                    fullname: check.fullname,
                    image: check.image,
                    display_name: check.display_name,
                    email: check.email,
                    phone: check.phone
                  };

                  friends.push(record);
                }
              }
            }

            return HTTP.OK(res, { data: friends });
          }).catch(() => {
            return HTTP.FAILED(res);
          });
        }).catch(() => {
          return HTTP.FAILED(res);
        });

      } else {
        return HTTP.NOT_AUTHORIZED(res);
      }
    } catch (error) {
      return HTTP.NETWORK_ERROR();
    }
  }

  /**
   * Show all user groups
   * @param {*} req
   * @param {*} res
   */
  static showAllGroups(req, res) {
    try {
      // Check authentication
      let auth = req.decoded.user.is_auth;

      if (auth) {
        // Get logged in user ID
        let userID = req.decoded.user.id;

        let groups = [];

        // Get all user groups
        GroupUser.findAll({
          where: { user_id: userID },
          include: [
            { model: User },
            { model: Group },
            { model: Role }
          ]
        }).then(async result => {
          if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
              let record = {
                id: result[i].get().Group.id,
                group_name: result[i].get().Group.group_name,
                image: result[i].get().Group.image,
                group_uuid: result[i].get().Group.group_uuid
              };

              groups.push(record);
            }
          }

          return HTTP.OK(res, { data: groups });
        }).catch(() => {
          return HTTP.FAILED(res);
        });
      } else {
        return HTTP.NOT_AUTHORIZED(res);
      }
    } catch (error) {
      return HTTP.NETWORK_ERROR();
    }
  }

  /**
   * Show chat list
   * @param {*} req
   * @param {*} res
   */
  static showLastChatMessage(req, res) {
    try {
      // Check authentication
      let auth = req.decoded.user.is_auth;

      if (auth) {
        // Get logged in user ID
        let userID = req.decoded.user.id;

        let messages = [];

        // Get distinct receiver
        Message.aggregate(
          "receiver_id", "DISTINCT", {
          plain: false,
          where: {
            sender_id: userID
          }
        }).then(async receiverID => {
          if (receiverID.length > 0) {
            for (let i = 0; i < receiverID.length; i++) {
              let check = await Message.findOne({
                where: {
                  [Op.or]: [
                    {
                      [Op.and]: [
                        { receiver_id: receiverID[i].DISTINCT },
                        { sender_id: userID }
                      ]
                    },
                    {
                      [Op.and]: [
                        { sender_id: receiverID[i].DISTINCT },
                        { receiver_id: userID }
                      ]
                    },
                  ]
                },
                order: [["id", "DESC"]]
              });

              let friendID = check.get().sender_id == userID ? check.get().receiver_id : check.get().sender_id;
              let userDetails = await User.findOne({
                where: { id: friendID }
              });

              // count unread message
              let unreadMessageCount = await Message.count({
                where: {
                  [Op.or]: [
                    {
                      [Op.and]: [
                        { receiver_id: receiverID[i].DISTINCT },
                        { sender_id: userID }
                      ]
                    },
                    {
                      [Op.and]: [
                        { sender_id: receiverID[i].DISTINCT },
                        { receiver_id: userID }
                      ]
                    },
                  ],
                  message_status: "delivered"
                }
              });

              if (check) {
                let record = {
                  message_id: check.get().id,
                  fullname: userDetails.get().fullname,
                  image: userDetails.get().image,
                  message: check.get().message,
                  date: check.get().createdAt,
                  unread: unreadMessageCount,
                  friend_id: userDetails.get().id,
                  sender_id: check.get().sender_id,
                  receiver_id: check.get().receiver_id,
                  delete_action: check.get().delete_action,
                  message_status: check.get().message_status,
                  user_typing: null,
                  phone: userDetails.get().phone,
                  email: userDetails.get().email,
                  display_name: userDetails.get().display_name
                };

                // Check if data already exist
                let findMessageIndex = messages.findIndex(item => item.message_id == check.get().id);

                if (findMessageIndex < 0) {
                  messages.push(record);
                }
              }
            }
          }

          return HTTP.OK(res, { data: messages });
        }).catch((err) => {
          return res.send(err.stack);
          return HTTP.FAILED(res);
        })
      } else {
        return HTTP.NOT_AUTHORIZED(res);
      }
    } catch (error) {
      return HTTP.NETWORK_ERROR(res);
    }
  }

  /**
   * Add new group
   * @param {*} req
   * @param {*} res
   */
  static addNewGroup(req, res) {
    try {
      // Check authentication
      let auth = req.decoded.user.is_auth;

      if (auth) {
        // Get user ID
        let userID = req.decoded.user.id;

        // Request form data
        let groupName = req.body.group_name;

        // Generate UUID
        let groupUUID = Helpers.uuid();

        // Create new group
        Group.create({
          group_name: groupName,
          group_uuid: groupUUID
        }).then(async groupCreated => {
          if (groupCreated) {
            // Get administrator role
            let adminRole = await Role.findOne({ where: { role: "admin" } });

            // Add Creator to group
            GroupUser.create({
              role_id: adminRole.id,
              user_id: userID,
              group_id: groupCreated.id
            }).then(userAdded => {
              if (userAdded) {
                return HTTP.OK(res, { message: 'Group successfully created!' });
              } else {
                return HTTP.FAILED(res);
              }
            }).catch(() => {
              return HTTP.FAILED(res);
            })
          } else {
            return HTTP.FAILED(res);
          }
        }).catch(() => {
          return HTTP.FAILED(res);
        })
      } else {
        return HTTP.NOT_AUTHORIZED(res);
      }
    } catch (error) {
      return HTTP.NETWORK_ERROR(res);
    }
  }
}

module.exports = UserController;