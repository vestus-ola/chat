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
let Group = require("../../database/models").Group;
let GroupUser = require("../../database/models").GroupUser;
let GroupMessage = require("../../database/models").GroupMessage;

require('dotenv').config();
let secret = process.env.JWT_SECRET;

var users = [];

class GroupMessageController {
  /**
   * Show message by friend
   * @param {*} req
   * @param {*} res
   */
  static showMessageByGroup(req, res) {
    try {
      // Check authentication
      let auth = req.decoded.user.is_auth;

      if (auth) {
        // Get logged in user ID
        let userID = req.decoded.user.id;

        // Request params
        let groupID = req.params.group_id;

        let messages = [];

        // Load messages
        GroupMessage.findAll({
          where: { group_id: groupID },
          include: [
            { model: User },
            { model: Group }
          ]
        }).then(async result => {
          if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
              // Check if user is on my friend list
              if (result[i].get().user_id != userID) {
                let checkIfUserIsOnMyFriendList = await UserFriends.findOne({
                  where: {
                    [Op.or]: [
                      {
                        [Op.and]: [
                          { user_id: userID },
                          { friend_id: result[i].get().user_id }
                        ]
                      },
                      {
                        [Op.and]: [
                          { user_id: result[i].get().user_id },
                          { friend_id: userID }
                        ]
                      },
                    ]
                  }
                });

                if (checkIfUserIsOnMyFriendList) {
                  let record = {
                    id: result[i].get().id,
                    user_id: result[i].get().user_id,
                    message: result[i].get().message,
                    user: result[i].get().User.fullname,
                    date: result[i].get().createdAt,
                    is_you: result[i].get().user_id == userID ? true : false,
                    status: result[i].get().status,
                    user_typing: null
                  };

                  messages.push(record);
                } else {
                  let record = {
                    id: result[i].get().id,
                    user_id: result[i].get().user_id,
                    message: result[i].get().message,
                    user: result[i].get().User.phone,
                    date: result[i].get().createdAt,
                    is_you: result[i].get().user_id == userID ? true : false,
                    status: result[i].get().status,
                    user_typing: null
                  };

                  messages.push(record);
                }
              } else {
                let record = {
                  id: result[i].get().id,
                  user_id: result[i].get().user_id,
                  message: result[i].get().message,
                  user: "You",
                  date: result[i].get().createdAt,
                  is_you: result[i].get().user_id == userID ? true : false,
                  status: result[i].get().status,
                  user_typing: null
                };

                messages.push(record);
              }
            }
          }

          // Order message by date ASC
          messages.sort((a, b) => a.date - b.date);

          return HTTP.OK(res, { data: messages });
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

module.exports = GroupMessageController;