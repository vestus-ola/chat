<template>
  <div
    class="main-wrapper"
    id="main-wrapper"
    v-click-outside="{
      exclude: ['emojicontainer'],
      handler: 'closeEmojiContainer'
    }"
  >
    <div class="actionbar">
      <div class="back" @click="goBack">
        <i class="fa fa-arrow-left"></i>
      </div>
      <div class="avatar">
        <img v-if="active_friend.image" :src="active_friend.image" alt="Avatar" />
        <img v-else src="@/assets/images/avatar.png" alt="Avatar" />
      </div>
      <div class="name" :style="{ 'width': actionBarWidth }">
        <span>{{ active_friend.fullname }}</span>
        <span class="status" v-if="user_typing">
          <i>{{ user_typing }}</i>
        </span>
        <span class="status" v-else>online</span>
      </div>

      <div class="actions more">
        <span class="dropdown">
          <a
            href="#"
            data-toggle="dropdown"
            role="button"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <i class="glyphicon glyphicon-option-vertical" style="color: #fff;"></i>
          </a>
          <ul class="dropdown-menu dropdown-menu-right">
            <li>
              <a href="#">New Group</a>
            </li>
            <li role="separator" class="divider"></li>
            <li>
              <a href="#">Settings</a>
            </li>
          </ul>
        </span>
      </div>
      <div class="actions more" v-if="is_copy && copy_count > 0" style="margin-top: 3px;">
        <i class="fa fa-copy" @click="copyText"></i>
        <span class="badge badge-notify">{{ copy_count }}</span>
      </div>
      <div class="actions more" v-if="is_paste" style="margin-top: 3px;">
        <i class="fa fa-paste" @click="pasteText"></i>
      </div>
      <div class="actions more" v-if="copy_count > 0" style="margin-top: 3px;">
        <i class="fa fa-trash" @click="pasteText"></i>
      </div>
    </div>

    <div class="page-content">
      <div
        class="container"
        v-chat-scroll="{always: false, smooth: true, scrollonremoved:true, smoothonremoved: false}"
      >
        <div id="messages" ref="container_list">
          <div v-for="(item, index) in messages" :key="item.message_id">
            <!-- With Name and Arrow - RIGHT -->
            <div class="msg" v-if="item.is_you" @click="getText">
              <div
                class="bubble-follow alt"
                v-if="index > 1 && (item.is_you == true && messages[index - 1].is_you == true)"
              >
                <div class="txt">
                  <p class="message">
                    <span id="msg" v-html="decodeEmoji(item.message)"></span>
                    <span class="timestamp">
                      {{ convertTimeToHour(item.date) }}
                      <span
                        class="tick tick-animation"
                        v-if="item.status == 'delivered'"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="16"
                          id="msg-dblcheck"
                          x="2047"
                          y="2061"
                        >
                          <path
                            d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"
                            fill="#92a58c"
                          />
                        </svg>
                      </span>
                      <span class="tick tick-animation" v-else>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="16"
                          id="msg-dblcheck"
                          x="2047"
                          y="2061"
                        >
                          <path
                            d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"
                            fill="#2ecc51"
                          />
                        </svg>
                      </span>
                    </span>
                  </p>
                </div>
              </div>
              <div class="bubble alt" v-else>
                <div class="txt">
                  <p class="message">
                    <span id="msg" v-html="decodeEmoji(item.message)"></span>
                    <span class="timestamp">
                      {{ convertTimeToHour(item.date) }}
                      <span
                        class="tick tick-animation"
                        v-if="item.status == 'delivered'"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="16"
                          id="msg-dblcheck"
                          x="2047"
                          y="2061"
                        >
                          <path
                            d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"
                            fill="#92a58c"
                          />
                        </svg>
                      </span>
                      <span class="tick tick-animation" v-else>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="16"
                          id="msg-dblcheck"
                          x="2047"
                          y="2061"
                        >
                          <path
                            d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"
                            fill="#2ecc51"
                          />
                        </svg>
                      </span>
                    </span>
                  </p>
                </div>
                <div class="bubble-arrow alt"></div>
              </div>
            </div>

            <!-- With Name and Arrow - LEFT -->
            <div class="msg" v-else @click="getText">
              <div
                class="bubble-follow"
                v-if="index > 1 && (item.is_you == false && messages[index - 1].is_you == false)"
              >
                <div class="txt">
                  <span class="message">
                    <span id="msg" v-html="decodeEmoji(item.message)"></span>
                    <span class="timestamp">{{ convertTimeToHour(item.date) }}</span>
                  </span>
                </div>
              </div>
              <div class="bubble" v-else>
                <div class="txt">
                  <span class="message">
                    <span id="msg" v-html="decodeEmoji(item.message)"></span>
                    <span class="timestamp">{{ convertTimeToHour(item.date) }}</span>
                  </span>
                </div>
                <div class="bubble-arrow"></div>
              </div>
            </div>
          </div>
        </div>
        <div style="display: none;" id="copy_clipboard"></div>
      </div>

      <div class="fixed-bottom">
        <form id="form" method="post">
          <div class="input-rounded">
            <VueChatEmoji
              @click="insertToInputBox($event)"
              backgroundColor="#f5f5f5"
              :open="open"
              @toggle="showOrHide"
              radius="10"
              color="#000"
              icon="fal fa-smile"
              ref="emojicontainer"
            >
            </VueChatEmoji>
            <textarea
              name="message"
              id="message"
              v-model="message"
              @keyup="checkInput"
              placeholder="Type a message"
            ></textarea>
            <span class="send-button" @click="sendMessage">
              <i
                class="material-icons"
                :style="`color: ${messageColor}; font-size: 36px; margin-top: -5px;`"
              >send</i>
            </span>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { url } from "@/shared/api";
import notify from "@/shared/toastr";
import { mapGetters } from "vuex";
import { emojis } from "vue-chat-emoji";
export default {
  data() {
    return {
      messages: [],
      messageColor: "#000",
      message: "",
      copy_count: 0,
      actionBarWidth: "60vw",
      firstTime: true,
      user_typing: null,
      is_typing: false,
      isWindowActive: false,
      open: false
    };
  },
  sockets: {
    connect: function() {
      console.log("socket connected...");
    },
    regiserUserDone: function(data) {
      this.$store.dispatch("setInfo", data);
    },
    privateMessageTyped: function(data) {
      let vm = this;
      if (data.message) {
        vm.user_typing = data.message;
      } else {
        vm.user_typing = null;
      }
    },
    receivedPrivateMessage: function(data) {
      this.messages.push({
        sender_id: data.data.sender_id,
        receiver_id: data.data.receiver_id,
        message_id: data.data.id,
        message: data.data.message,
        date: data.data.date,
        is_you: false,
        status: data.data.message_status,
        delete_action: data.data.delete_action
      });
    },
    privateMessageRead: function(data) {
      this.getAllMessages();
    }
  },
  methods: {
    checkIfAuthenticated() {
      this.$store.commit("LOAD_FROM_LOCAL");
      if (this.token == null) {
        this.$router.push("/");
      }
    },
    getAllMessages() {
      let vm = this;
      let friend_id = this.active_friend.id;

      this.axios
        .get(`${url}/user/chat_messages/${friend_id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: this.token
          }
        })
        .then(response => {
          if (response.status == 200) {
            this.messages = response.data.data;
            setTimeout(() => {
              vm.isLoading = false;
              vm.scrollToBottom();
            }, 100);
          } else {
            notify.error(response.data.message);
          }
        })
        .catch(error => {
          notify.error(error.message);
        });
    },
    markAllFriendMessageAsRead() {
      let vm = this;
      let friend_id = this.active_friend.id;

      this.axios
        .get(`${url}/user/friend/message/${friend_id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: this.token
          }
        })
        .then(response => {
          if (response.status == 200) {
            console.log(response.data.message);
          } else {
            notify.error(response.data.message);
          }
        })
        .catch(error => {
          notify.error(error.message);
        });
    },
    sendMessage() {
      if (this.message == "") return;
      let vm = this;
      this.$socket.emit(
        "sendPrivateMessage",
        {
          data: {
            sender_id: this.info.id,
            receiver_id: this.active_friend.id,
            message: emojis.encodeEmoji(this.message),
            sender_fullname: this.info.fullname,
            sender_image:
              this.info.image ||
              "http://localhost:8080/static/images/avatar.png",
            app_logo: "http://localhost:8080/static/images/logo.png"
          }
        },
        function(data) {
          vm.messages.push(data);
          vm.scrollToBottom();
        }
      );

      this.message = "";
    },
    insertToInputBox(args) {
      this.message += "" + args.emoji + "";
    },
    goBack() {
      this.$router.back();
    },
    scrollToBottom() {
      let vm = this;
      setTimeout(() => {
        if (vm.firstTime) {
          vm.$refs.container_list.scrollTop =
            vm.$refs.container_list.scrollHeight;
          vm.firstTime = false;
        } else if (
          vm.$refs.container_list.scrollTop +
            vm.$refs.container_list.clientHeight ===
          vm.$refs.container_list.scrollHeight
        ) {
          vm.$refs.container_list.scrollTop =
            vm.$refs.container_list.scrollHeight;
        }
      }, 400);
    },
    getText(args) {
      let inputBox = document.getElementById("copy_clipboard");
      if (args.path[3].getAttribute("class") == "msg") {
        this.$store.dispatch("setIsCopy", true);
        args.path[3].classList.add("copied");
        this.copy_count += 1;
        inputBox.innerHTML += args.target.innerHTML + " ";
        this.actionBarWidth = "40vw";
      }
      if (args.path[4].getAttribute("class") == "msg") {
        this.$store.dispatch("setIsCopy", true);
        args.path[4].classList.add("copied");
        this.copy_count += 1;
        inputBox.innerHTML += args.target.innerHTML + " ";
        this.actionBarWidth = "40vw";
      } else if (args.path[3].getAttribute("class") == "msg copied") {
        args.path[3].classList.remove("copied");
        inputBox.innerHTML = inputBox.innerHTML.replace(
          args.target.innerHTML,
          ""
        );
        this.copy_count -= 1;
        this.actionBarWidth = "40vw";
      } else if (args.path[4].getAttribute("class") == "msg copied") {
        args.path[4].classList.remove("copied");
        inputBox.innerHTML = inputBox.innerHTML.replace(
          args.target.innerHTML,
          ""
        );
        this.copy_count -= 1;
        this.actionBarWidth = "40vw";
      }
    },
    copyText() {
      let text = document.getElementById("copy_clipboard").innerHTML;
      this.$store.dispatch("setIsCopy", false);
      this.$store.dispatch("setClipboard", text);
      this.$store.dispatch("setIsPaste", true);
      document.querySelectorAll(".msg").forEach((item, i) => {
        item.classList.remove("copied");
      });
    },
    pasteText() {
      this.message = this.clipboard;
      this.$store.dispatch("setIsPaste", false);
      this.$store.dispatch("setClipboard", null);
      this.copy_count = 0;
    },
    register() {
      this.$socket.emit("register_user", { user: this.info });
    },
    checkInput() {
      let vm = this;
      let timeout;
      vm.is_typing = true;

      vm.$socket.emit("privateMessageTyping", {
        receiver: vm.active_friend,
        sender: vm.info,
        msg: "Is typing..."
      });
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        vm.timeoutFunction();
      }, 1000);
    },
    timeoutFunction() {
      this.is_typing = false;
      this.$socket.emit("privateMessageTyping", {
        receiver: this.active_friend,
        sender: this.info,
        msg: null
      });
    },
    decodeEmoji(message) {
      return emojis.decodeEmoji(message);
    },
    convertTimeToHour(date) {
      var parsedDate = new Date(Date.parse(date));
      return new Intl.DateTimeFormat("en-US", {
        hour12: true,
        hour: "2-digit",
        minute: "numeric"
      }).format(parsedDate);
    },
    animateMessage(message) {
      setTimeout(function() {
        var tick = message.querySelector(".tick");
        tick.classList.remove("tick-animation");
      }, 500);
    },
    markMessageAsRead() {
      let vm = this;
      setTimeout(() => {
        if (vm.messages.length > 0) {
          let messageID = parseInt(
            vm.messages[vm.messages.length - 1].message_id
          );
          let receiverID = parseInt(vm.info.id);
          let senderID = parseInt(vm.active_friend.id);

          if (messageID) {
            // Emit connected (message read)
            vm.$socket.emit("privateMessageRead", {
              message_id: messageID,
              sender_id: senderID,
              receiver_id: receiverID
            });
          }
        }
      }, 100);
    },
    checkIfWindowIsActive() {
      let vm = this;

      var hasFocus = document.hasFocus();
      setInterval(function() {
        var hasFocusNow = document.hasFocus();
        if (hasFocus !== hasFocusNow && hasFocus) {
          // lost focus
          vm.isWindowActive = false;
        } else if (hasFocus !== hasFocusNow) {
          // gained focus
          vm.isWindowActive = true;
        }

        if (hasFocusNow) {
          if (vm.$route.path != "/user-chat") {
            hasFocusNow = false;
          } else {
            hasFocusNow = true;
            vm.markMessageAsRead();
          }
        }

        hasFocus = hasFocusNow;
        vm.isWindowActive = hasFocus;
      }, 1000);
    },
    showOrHide() {
      this.open = !this.open;
    },
    closeEmojiContainer() {
      if (this.open) {
        this.open = false;
      }
    }
  },
  mounted() {
    this.getAllMessages();
    this.markAllFriendMessageAsRead();
    this.register();
    this.checkIfWindowIsActive();
  },
  watch: {
    message() {
      if (this.message != "") {
        this.messageColor = "#257aa6";
        document.querySelector("#message").scrollTop = document.querySelector(
          "#message"
        ).scrollHeight;
      } else {
        this.messageColor = "#000";
      }
    },
    copy_count() {
      if (this.copy_count < 1) {
        document.getElementById("copy_clipboard").value = "";
        this.$store.dispatch("setIsCopy", false);
        this.actionBarWidth = "60vw";
      }
    }
  },
  computed: {
    ...mapGetters([
      "token",
      "info",
      "active_friend",
      "is_copy",
      "is_paste",
      "clipboard"
    ])
  },
  beforeMount() {
    this.checkIfAuthenticated();
  }
};
</script>

<style scoped>
.main-wrapper {
  background: #efe7dd url(~/static/images/background_1.png) repeat;
  /* position: relative; */
  /* z-index: 0; */
  /* -webkit-background-size: cover; */
  /* -moz-background-size: cover; */
  /* -o-background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover; */
  font-family: "Helvetica Neue", Helvetica /*, sans-serif*/;
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100%;
}
.container {
  width: 90%;
  margin: 0 auto;
  /* margin-top: 60px; */
  overflow-y: auto;
  height: 80vh;
  position: relative;
}
.container::-webkit-scrollbar {
  width: 4px;
}
.container::-webkit-scrollbar-track {
  background: #ddd;
}
.container::-webkit-scrollbar-thumb {
  background: #bdbdbd;
  border-radius: 6px;
}
.msg {
  width: 100%;
  height: auto;
  display: inline-block;
  overflow: hidden;
}
.msg .bubble {
  float: left;
  max-width: 75%;
  width: auto;
  height: auto;
  display: block;
  background: #fff;
  align-self: flex-start;
  border-radius: 5px;
  position: relative;
  margin: 10px 0 3px 15px;
}
.msg .bubble.alt {
  margin: 10px 15px 3px 0px;
  background: #42a5f5;
  float: right;
}
.msg .bubble-follow {
  float: left;
  max-width: 75%;
  width: auto;
  height: auto;
  display: block;
  background: #fff;
  align-self: flex-start;
  border-radius: 5px;
  position: relative;
  margin: 0px 0 3px 15px;
}
.msg .bubble-follow.alt {
  margin: 0 15px 3px 0;
  background: #42a5f5;
  float: right;
}
.msg .bubble-follow .txt {
  padding: 8px 0 8px 0;
  width: 100%;
}
.msg .bubble-follow .txt .name {
  font-weight: 600;
  font-size: 14px;
  display: inline-table;
  padding: 0 0 0 15px;
  margin: 0 0 4px 0;
  color: #3498db;
}
.msg .bubble-follow .txt .name span {
  font-weight: normal;
  color: #b3b3b3;
  overflow: hidden;
}
.msg .bubble-follow .txt .name.alt {
  color: #fff;
}
.msg .bubble-follow .txt .message {
  font-size: 14px;
  font-weight: 500;
  padding: 0 15px 0 15px;
  color: #000;
  display: block;
  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;
}
.msg .bubble-follow.alt .txt .message {
  font-size: 14px;
  font-weight: 500;
  padding: 0 15px 0 15px;
  color: #fff;
  display: block;
  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;
}
.msg .bubble-follow .txt .timestamp {
  font-size: 10px;
  padding: 0 3px 0 4px;
  margin-top: 10px;
  /* display: inline-block; */
  display: block;
  float: right;
  position: relative;
  text-transform: uppercase;
  font-weight: 600;
  color: #555;
}
.msg .bubble-follow.alt .txt .timestamp {
  color: #fff;
  padding: 0 15px 0 5px;
}
.msg .bubble .txt {
  padding: 8px 0 8px 0;
  width: 100%;
}
.msg .bubble .txt .name {
  font-weight: 600;
  font-size: 14px;
  display: inline-table;
  padding: 0 0 0 15px;
  margin: 0 0 4px 0;
  color: #3498db;
}
.msg .bubble .txt .name span {
  font-weight: normal;
  color: #b3b3b3;
  overflow: hidden;
}
.msg .bubble .txt .name.alt {
  color: #fff;
}
.msg .bubble .txt .message {
  font-size: 14px;
  font-weight: 500;
  padding: 0 15px 0 15px;
  color: #000;
  display: block;
  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;
}
.msg .bubble.alt .txt .message {
  font-size: 14px;
  font-weight: 500;
  padding: 0 15px 0 15px;
  color: #fff;
  display: block;
  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;
}
.msg .bubble .txt .timestamp {
  font-size: 10px;
  padding: 0 3px 0 4px;
  margin-top: 10px;
  /* display: inline-block; */
  display: block;
  float: right;
  position: relative;
  text-transform: uppercase;
  font-weight: 600;
  color: #555;
}
.msg .bubble.alt .txt .timestamp {
  color: #fff;
  padding: 0 15px 0 5px;
}
.msg .bubble .bubble-arrow {
  position: absolute;
  float: left;
  left: -11px;
  top: 0px;
}
.msg .bubble .bubble-arrow.alt {
  bottom: 20px;
  left: auto;
  right: 4px;
  float: right;
}
.msg .bubble .bubble-arrow:after {
  content: "";
  position: absolute;
  border-top: 15px solid #fff;
  border-left: 15px solid transparent;
  border-radius: 4px 0 0 0px;
  width: 0;
  height: 0;
}
.msg .bubble .bubble-arrow.alt:after {
  border-top: 15px solid #42a5f5;
  transform: scaleX(-1);
}
@keyframes slideFromLeft {
  0% {
    margin-left: -200px;
    opacity: 0;
  }
  100% {
    margin-left: 0;
    opacity: 1;
  }
}
@-webkit-keyframes slideFromLeft {
  0% {
    margin-left: -200px;
    opacity: 0;
  }
  100% {
    margin-left: 0;
    opacity: 1;
  }
}
@keyframes slideFromRight {
  0% {
    margin-right: -200px;
    opacity: 0;
  }
  100% {
    margin-right: 0;
    opacity: 1;
  }
}
@-webkit-keyframes slideFromRight {
  0% {
    margin-right: -200px;
    opacity: 0;
  }
  100% {
    margin-right: 0;
    opacity: 1;
  }
}
#messages {
  margin-top: 3px;
  margin-bottom: 10px;
}
.fixed-bottom {
  width: 100vw;
  bottom: 0;
  position: fixed;
  padding-right: 10px;
  padding-left: 10px;
  margin-bottom: 8px;
}
.input-rounded {
  border-radius: 24px;
}
.img-circle {
  width: 40px;
  height: 40px;
}
.user_name {
  margin-left: 10px;
  font-weight: 700;
  font-size: 20px;
  color: #fff;
}
.status {
  margin-left: 10px;
  color: #fff;
}
.navbar-whatsapp {
  /* background-color: #075e54;
  border: 1px solid #075e54; */
  background-color: #4b8799;
  border: 1px solid #4b8799;
}
.nav-table {
  margin-top: -10px;
  margin-bottom: -10px;
}
li a:hover:not(.active) {
  background-color: transparent;
}
.nav-back {
  color: #fff;
  font-size: 24px;
  margin-right: 20px;
  cursor: pointer;
}
.user-panel {
  float: left;
  overflow: hidden;
  clear: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.btn-chat {
  background-color: #257aa6;
  border-color: #257aa6;
}
.icon-send {
  transform: rotate(50deg);
  color: #222;
  font-size: 26px;
}
.icon-emoticon {
  color: #000;
  font-size: 26px;
  top: 50%;
  left: 50%;
}
.fixed-bottom {
  width: 100vw;
  bottom: 0;
  position: fixed;
  padding-right: 10px;
  padding-left: 10px;
  margin-bottom: 8px;
}
.input-rounded {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  flex-flow: row;
  -ms-flex-flow: row;
  flex-direction: row;
  justify-content: center;
  border: 1px solid #ddd;
  height: 50px;
  background-color: #fff;
  border-radius: 24px;
  padding: 5px 10px;
}
textarea,
textarea:focus {
  border: transparent;
  border-top: none;
  resize: none;
  overflow-y: auto;
}
textarea#message {
  flex-grow: 2;
  border: none;
  outline: none;
  padding: 5px 20px;
  font-size: 14px;
  margin-left: 10px;
}
textarea#message::placeholder {
  color: #777;
  font-size: 18px;
}
textarea#message:focus {
  outline: none;
  border: none;
}
span.send-button {
  outline: none;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  bottom: 0;
}
textarea::-webkit-scrollbar {
  width: 3px;
}
textarea::-webkit-scrollbar-track {
  background: #ddd;
}
textarea::-webkit-scrollbar-thumb {
  background: #bdbdbd;
  border-radius: 6px;
}
/* Action Bar */
.actionbar {
  height: 55px;
  background: #257aa6;
  color: #fff;
  padding: 0 8px;
  font-size: 24px;
  position: relative;
  z-index: 1;
}
.actionbar:after {
  content: "";
  display: table;
  clear: both;
}
.actionbar div {
  float: left;
  transform: translateY(-50%);
  position: relative;
  top: 50%;
}
.actionbar .back {
  cursor: pointer;
  margin-right: 5px;
}
.actionbar .actions {
  float: right;
  /* float: left;: left; */
  margin: 0 0 0 8px;
  cursor: pointer;
  line-height: 55px;
}
.actionbar .actions.more {
  margin: 0 5px 0 5px;
}
.actionbar .actions.attachment {
  margin: 0 5px 0 5px;
}
.actionbar .avatar {
  margin: 0 0 0 5px;
  width: 36px;
  height: 36px;
}
.actionbar .avatar img {
  border-radius: 50%;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.1);
  display: block;
  width: 100%;
}
.actionbar .name {
  font-size: 16px;
  font-weight: 600;
  text-overflow: ellipsis;
  margin: 0 0 0 8px;
  overflow: hidden;
  white-space: nowrap;
  width: 60vw;
}
.actionbar .status {
  display: block;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0;
}
.badge-notify {
  background: #f5f5f5;
  position: relative;
  color: #257aa6;
  top: -20px;
  left: -20px;
}
.actions.more .badge-notify {
  margin-right: -20px;
}
.copied {
  background: lightskyblue;
}
.message .tick {
  display: inline-block;
  position: absolute;
  margin-left: 4px;
  height: 18px;
  width: 18px;
}
.message .tick svg {
  position: absolute;
  transition: 0.5s ease-in-out;
}
.message .tick svg {
  /* -webkit-backface-visibility: visible;
          backface-visibility: visible; */
  -webkit-transform: perspective(800px) rotateY(0);
  transform: perspective(800px) rotateY(0);
}
.message .tick-animation svg {
  -webkit-transform: perspective(800px) rotateY(0);
  transform: perspective(800px) rotateY(0);
}
@media only screen and (max-width: 450px) {
  .main-wrapper {
    position: fixed;
  }
  .container {
    width: 100%;
    overflow-y: auto;
  }
  .user-panel {
    width: 75%;
    float: left;
    overflow: hidden;
    clear: left;
    text-overflow: ellipsis;
    color: white;
    white-space: nowrap;
  }
  .page-content .container {
    height: calc(100vh - 155px);
  }
  #messages {
    margin-top: 3px;
  }
}
</style>