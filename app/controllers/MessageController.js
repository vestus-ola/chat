/**
 |---------------------------------------------------------
 | Message Controller
 |---------------------------------------------------------
 */
// Include modules or plugins
let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');
let HTTP = require('./RequestController');
let Sequelize = require('sequelize');
let moment = require("moment-timezone");
let Op = Sequelize.Op;

// Include Models
let User = require('../../database/models').User;
let UserFriends = require('../../database/models').UserFriends;
let Message = require("../../database/models").Message;

require('dotenv').config();
let secret = process.env.JWT_SECRET;

var users = [];

class MessageController {
  /**
   * Show message by friend
   * @param {*} req
   * @param {*} res
   */
  static showMessageByFriend(req, res) {
    try {
      // Check authentication
      let auth = req.decoded.user.is_auth;

      if (auth) {
        // Get logged in user ID
        let userID = req.decoded.user.id;

        // Request params
        let friendID = req.params.friend_id;

        let messages = [];

        // Load messages
        Message.findAll({
          where: {
            sender_id: userID,
            receiver_id: friendID
          }
        }).then(result => {
          if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
              let record = {
                sender_id: result[i].get().id,
                receiver_id: result[i].get().receiver_id,
                message_id: result[i].get().id,
                message: result[i].get().message,
                date: result[i].get().createdAt,
                is_you: true,
                status: result[i].get().message_status,
                delete_action: result[i].get().delete_action
              };

              messages.push(record);
            }
          }

          // Load messages
          Message.findAll({
            where: {
              sender_id: friendID,
              receiver_id: userID
            }
          }).then(data => {
            if (data.length > 0) {
              for (let i = 0; i < data.length; i++) {
                let record = {
                  sender_id: data[i].get().id,
                  receiver_id: data[i].get().receiver_id,
                  message_id: data[i].get().id,
                  message: data[i].get().message,
                  date: data[i].get().createdAt,
                  is_you: false,
                  status: data[i].get().message_status,
                  delete_action: data[i].get().delete_action
                };

                messages.push(record);
              }
            }

            // Order message by date ASC
            messages.sort((a, b) => a.date - b.date);

            return HTTP.OK(res, { data: messages });
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
   * @param {*} req
   * @param {*} res
   * @param {*} friends
   */
  static messageFriend(req, res, friends) {
    try {
      // Check authentication
      let auth = req.decoded.user.is_auth;

      if (auth) {
        // Get logged in user ID
        let userID = req.decoded.user.id;

        // Get friend ID
        let friendID = req.params.friend_id;

        // Request form data
        let message = req.body.message;

        let socketIO = req.app.get("socketio");

        socketIO.on("sendPrivateMessage", (data) => {
          // Save message
          Message.create({
            where: {
              sender_id: data.data.sender_id,
              receiver_id: data.data.receiver_id,
              message: data.data.message
            }
          }).then(result => {
            if (result) {
              let record = {
                sender_id: result.get().sender_id,
                receiver_id: result.get().receiver_id,
                message_id: result.get().id,
                message: result.get().message,
                date: result.get().createdAt,
                is_you: false,
                status: result.get().message_status,
                delete_action: result.get().delete_action
              };

              let receiver = friends.find(item => item.id == data.data.receiver_id);
              if (receiver) {
                socketIO.to(receiver.socket_id).emit("receivedPrivateMessage", { data: record });
              }

              return HTTP.CREATED(res, "Message successfully sent!");
            } else {
              return HTTP.ERROR(res, "Message not sent");
            }
          }).catch(() => {
            return HTTP.FAILED(res);
          });
        });
      } else {
        return HTTP.NOT_AUTHORIZED(res);
      }
    } catch (error) {
      return HTTP.NETWORK_ERROR();
    }
  }

  /**
   * Mark all message as read
   * @param {*} req
   * @param {*} res
   */
  static markMessageAsReadByFriend(req, res) {
    try {
      // Check authentication
      let auth = req.decoded.user.is_auth;

      if (auth) {
        // Get logged in user ID
        let userID = req.decoded.user.id;

        // Get friend ID
        let friendID = req.params.friend_id;

        // Update message
        Message.update({ message_status: "read" },{
          where: {
            receiver_id: userID,
            sender_id: friendID
          }
        }).then(updated => {
          if (updated) {
            return HTTP.OK(res, { message: "Marked as read."});
          } else {
            return HTTP.ERROR(res, "Message not marked as read.");
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
}

module.exports = MessageController;