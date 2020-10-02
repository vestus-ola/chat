let bcrypt = require('bcryptjs');
let Sequelize = require('sequelize');
let moment = require("moment-timezone");
let Op = Sequelize.Op;

// Include Models
let User = require('../database/models').User;
let UserFriends = require('../database/models').UserFriends;
let Message = require("../database/models").Message;

require('dotenv').config();

let friends = [];

module.exports = function (socket) {
  console.log("user connected");

  socket.on("privateMessageRead", (data) => {
    // Update Message
    Message.update(
      { message_status: "read" },
      {
      where: {
        [Op.or]: [
          {
            [Op.and]: [
              { receiver_id: data.receiver_id },
              { sender_id: data.sender_id }
            ]
          },
          {
            [Op.and]: [
              { sender_id: data.receiver_id  },
              { receiver_id: data.sender_id }
            ]
          },
        ],
        id: data.message_id
      }
    }).then(updated => {
      if (updated) {
        let sender = friends.find(item => item.id == data.sender_id);
        if (sender) {
          socketIO.to(sender.socket_id).emit("privateMessageRead", { data: "read" });
        }
      } else {
        let sender = friends.find(item => item.id == data.sender_id);
        if (sender) {
          socketIO.to(sender.socket_id).emit("privateMessageRead", { data: "delivered" });
        }
      }
    });
  });

  socket.on("privateMessageTyping", function (data) {
    let receiver = friends.find(item => item.id == data.receiver.id);
    if (receiver) {
      socketIO.to(receiver.socket_id).emit("privateMessageTyped", { message: data.msg, user: data.sender });
    }
  });

  socket.on("register_user", (data) => {
    data.user.socket_id = socket.id;
    let findFriend = friends.findIndex(item => item.id == data.user.id);
    if (findFriend < 0)  {
      friends.push(data.user);
    } else {
      friends[findFriend] = data.user;
    }
    socket.emit("regiserUserDone", data.user);
  });

  socket.on("sendPrivateMessage", (data, callback) => {
    // Save message
    Message.create({
      sender_id: data.data.sender_id,
      receiver_id: data.data.receiver_id,
      message: data.data.message
    }).then(result => {
      if (result) {
        let record = {
          sender_id: result.get().sender_id,
          sender_fullname: data.data.sender_fullname,
          sender_image: data.data.sender_image,
          receiver_id: result.get().receiver_id,
          message_id: result.get().id,
          message: result.get().message,
          date: result.get().createdAt,
          is_you: false,
          status: result.get().message_status,
          delete_action: result.get().delete_action
        };

        callback({
          sender_id: result.get().sender_id,
          sender_fullname: data.data.sender_fullname,
          sender_image: data.data.sender_image,
          receiver_id: result.get().receiver_id,
          message_id: result.get().id,
          message: result.get().message,
          date: result.get().createdAt,
          is_you: true,
          status: result.get().message_status,
          delete_action: result.get().delete_action
        });

        let receiver = friends.find(item => item.id == data.data.receiver_id);
        if (receiver) {
          socketIO.to(receiver.socket_id).emit("receivedPrivateMessage", { data: record });
        }
      }
    });
  });

  socket.on("disconnect", function () {
    console.log("User disconnected");
  });
};