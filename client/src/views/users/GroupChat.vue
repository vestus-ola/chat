<template>
  <div class="main-wrapper">
    <div class="actionbar">
      <div class="back" @click="goBack">
        <i class="fa fa-arrow-left"></i>
      </div>
      <div class="avatar">
        <img src="@/assets/images/avatar.png" alt="Avatar" />
      </div>
      <div class="name">
        <span>Real Estate Management Team.</span>
        <span class="status">online</span>
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
    </div>

    <div class="container" v-chat-scroll>
      <div id="messages" ref="container_list">
        <div v-for="(item, index) in messages" :key="item.message_id">
          <!-- With Name and Arrow - RIGHT -->
          <div class="msg" v-if="item.is_you" @click="getText">
            <div v-if="item.parent_id == null || item.parent_id == undefined">
              <div
                class="bubble-follow alt"
                v-if="index > 1 && (item.is_you == true && messages[index - 1].is_you == true && item.user_id == messages[index - 1].user_id)"
              >
                <div class="txt">
                  <p class="message">
                    <span id="msg">{{ decodeEmoji(item.message) }}</span>
                    <span class="timestamp">
                      {{ convertTimeToHour(item.date) }}
                    </span>
                  </p>
                </div>
              </div>
              <div class="bubble alt" v-else>
                <div class="txt">
                  <p class="message">
                    <span id="msg">{{ decodeEmoji(item.message) }}</span>
                    <span class="timestamp">
                      {{ convertTimeToHour(item.date) }}
                    </span>
                  </p>
                </div>
                <div class="bubble-arrow alt"></div>
              </div>
            </div>
            <div class="bubble alt" v-else>
              <div class="txt">
                <span class="name">{{ item.user }}</span>
                <div class="reply_bubble reply_alt">
                  <div class="reply_txt">
                    <span class="reply_name">{{ item.parent_user }}</span>
                    <span class="reply_message">
                      <span id="msg">{{ decodeEmoji(item.reply_message) }}</span>
                    </span>
                  </div>
                </div>
                <span class="message">
                  <span id="msg">{{ decodeEmoji(item.message) }}</span>
                  <span class="timestamp">{{ convertTimeToHour(item.date) }}</span>
                </span>
              </div>
              <div class="bubble-arrow alt"></div>
            </div>
          </div>

          <!-- With Name and Arrow - LEFT -->
          <div class="msg" v-else @click="getText">
            <div v-if="item.parent_id == null || item.parent_id == undefined">
              <div
                class="bubble-follow"
                v-if="index > 1 && (item.is_you == false && messages[index - 1].is_you == false && item.user_id == messages[index - 1].user_id)"
              >
                <div class="txt">
                  <span class="name">{{ item.user }}</span>
                  <span class="message">
                    <span id="msg">{{ decodeEmoji(item.message) }}</span>
                    <span class="timestamp">{{ convertTimeToHour(item.date) }}</span>
                  </span>
                </div>
              </div>
              <div class="bubble" v-else>
                <div class="txt">
                  <span class="name">{{ item.user }}</span>
                  <span class="message">
                    <span id="msg">{{ decodeEmoji(item.message) }}</span>
                    <span class="timestamp">{{ convertTimeToHour(item.date) }}</span>
                  </span>
                </div>
                <div class="bubble-arrow"></div>
              </div>
            </div>
            <div class="bubble" v-else>
              <div class="txt">
                <span class="name">{{ item.user }}</span>
                <div class="reply_bubble">
                  <div class="reply_txt">
                    <span class="reply_name">{{ item.parent_user }}</span>
                    <span class="reply_message">
                      <span id="msg">{{ decodeEmoji(item.reply_message) }}</span>
                    </span>
                  </div>
                </div>
                <span class="message">
                  <span id="msg">{{ decodeEmoji(item.message) }}</span>
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
            radius="10"
            color="#000"
            icon="f118"
          ></VueChatEmoji>
          <textarea name="message" id="message" v-model="message" placeholder="Type a message"></textarea>
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
</template>

<script>
import { emojis } from "vue-chat-emoji";
import { mapGetters } from "vuex";
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
      isWindowActive: false
    };
  },
  sockets: {
    connect: function() {
      console.log("socket connected...");
    },
    regiserUserDone: function(data) {
      this.$store.dispatch("setInfo", data);
    },
    groupMessageTyped: function(data) {
      let vm = this;
      if (data.message) {
        vm.user_typing = data.message;
      } else {
        vm.user_typing = null;
      }
    },
    receivedGroupMessage: function(data) {
      this.messages.push({
        id: data.data.id,
        user_id: data.data.user_id,
        message: data.data.message,
        user: data.data.user_id,
        date: data.data.date,
        is_you: data.data.is_you,
        status: data.data.status,
        user_typing: null
      });
    },
    groupMessageRead: function(data) {
      this.getAllMessages();
    }
  },
  methods: {
    checkIfAuthenticated() {
      this.$store.commit("LOAD_FROM_LOCAL");
      if (this.token == null) {
        this.$router.push('/');
      }
    },
    getAllMessages() {
      let vm = this;
      let group_id = this.active_group.id;

      this.axios
        .get(`${url}/user/group_messages/${group_id}`, {
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
    sendMessage() {
      return false;
      let vm = this;
      this.$socket.emit(
        "sendGroupMessage",
        {
          data: {
            sender_id: this.info.id,
            group_uuid: this.active_group.group_uuid,
            message: emojis.encodeEmoji(this.message)
          }
        },
        function(data) {
          vm.messages.push(data);
          vm.scrollToBottom();
        }
      );

      this.message = "";
      console.log(emojis.encodeEmoji(this.message));
      this.message = "";
    },
    tempData() {
      this.messages = [];
      this.messages.push(
        {
          id: 1,
          user_id: 3,
          message: "Welcome guys",
          user: "You",
          date: new Date(),
          is_you: true,
          status: "read",
          user_typing: null
        },
        {
          id: 2,
          user_id: 2,
          message: "Hello there",
          user: "Martins Sharp",
          date: new Date(),
          is_you: false,
          status: "read",
          user_typing: null
        },
        {
          id: 3,
          user_id: 5,
          message: "I'm happy to be here.",
          user: "Taylor Otwell",
          date: new Date(),
          is_you: false,
          status: "read",
          user_typing: null
        },
        {
          id: 4,
          user_id: 3,
          message: "I'm happy to announce to you that you being a part of this group, you will not regret ever joining this group",
          user: "You",
          date: new Date(),
          is_you: true,
          status: "read",
          user_typing: null
        },
        {
          id: 5,
          user_id: 3,
          message: "I'm happy to be here.",
          user: "You",
          date: new Date(),
          is_you: true,
          status: "read",
          user_typing: null
        },
        {
          id: 6,
          user_id: 10,
          message: "Hi guys",
          user: "+2348188813284",
          date: new Date(),
          is_you: false,
          status: "read",
          user_typing: null
        },
        {
          id: 7,
          user_id: 10,
          message: "Please add Adedigba to this group",
          user: "+2348188813284",
          date: new Date(),
          is_you: false,
          status: "read",
          user_typing: null
        },
        {
          id: 8,
          user_id: 11,
          parent_id: 7,
          message: "Please do @admin, I really miss that guy.",
          reply_message: 'Please add Adedigba to this group',
          parent_user: "+2348188813284",
          user: "+2349036410489",
          date: new Date(),
          is_you: false,
          status: "read",
          user_typing: null
        },
        {
          id: 10,
          user_id: 3,
          parent_id: 8,
          reply_message: "Please do @admin, I really miss that guy.",
          message: 'Sure.',
          parent_user: "+2349036410489",
          user: "You",
          date: new Date(),
          is_you: true,
          status: "read",
          user_typing: null
        },
      );
    },
    insertToInputBox(args) {
      this.message += "" + args.emoji + "";
    },
    goBack() {
      this.$router.back();
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

      vm.$socket.emit("groupMessageTyping", {
        sender: vm.info,
        group_uuid: vm.active_group.group_uuid,
        msg: "Is typing..."
      });
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        vm.timeoutFunction();
      }, 1000);
    },
    timeoutFunction() {
      this.is_typing = false;
      this.$socket.emit("groupMessageTyping", {
        sender: this.info,
        group_uuid: this.active_group.group_uuid,
        msg: null
      });
    },
  },
  mounted() {
    this.tempData();
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
    ...mapGetters(["token", "info", "active_group"])
  },
  beforeMount() {
    this.checkIfAuthenticated();
  }
};
</script>

<style scoped>
.main-wrapper {
  background: url(~/static/images/background_1.png);
  /* -webkit-background-size: cover; */
  /* -moz-background-size: cover; */
  /* -o-background-size: cover; */
  background-position: center center;
  /* background-repeat: no-repeat; */
  /* background-attachment: fixed; */
  /* background-size: cover; */
  font-family: "Helvetica Neue", Helvetica /*, sans-serif*/;
  margin: 0;
  padding: 0;
  height: 100vh;
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
  display: block;
  overflow: hidden;
}
.msg .bubble {
  float: left;
  max-width: 75%;
  width: auto;
  height: auto;
  display: block;
  background: #fff;
  border-radius: 5px;
  position: relative;
  margin: 10px 0 3px 15px;
  box-shadow: 0px 2px 1px rgba(0, 0, 0, 0.1);
}
.msg .bubble.alt {
  margin: 10px 15px 3px 0px;
  background: #42a5f5;
  float: right;
}
.msg .bubble .txt {
  padding: 8px 0 8px 0;
  width: 100%;
}
.msg .bubble .txt .name {
  font-weight: 600;
  font-size: 14px;
  display: table;
  padding: 0 0 0 15px;
  margin: 0 0 4px 0;
  color: #3498db;
}
.msg .bubble .txt .name span {
  font-weight: normal;
  color: #b3b3b3;
  overflow: hidden;
}
.msg .bubble.alt .txt .name {
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  display: table;
  padding: 0 0 0 15px;
  margin: 0 0 4px 0;
}
.msg .bubble .txt .message {
  font-size: 14px;
  font-weight: 500;
  padding: 0 15px 0 15px;
  color: #2b2b2b;
  display: block;
}
.msg .bubble.alt .txt .message {
  font-size: 14px;
  font-weight: 500;
  padding: 0 15px 0 15px;
  color: #fff;
  display: block;
}
.msg .bubble .txt .timestamp {
  font-size: 11px;
  padding: 0 5px 0 10px;
  margin-top: 5px;
  /* display: inline-block; */
  display: block;
  align-self: flex-end;
  float: right;
  text-transform: uppercase;
  font-weight: 600;
  color: #777;
}
.msg .bubble.alt .txt .timestamp {
  color: #fff;
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
  margin: 0px 15px 3px 0px;
  align-self: flex-end;
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
  margin: auto;
  color: #000;
  display: table;
}
.msg .bubble-follow.alt .txt .message {
  font-size: 14px;
  font-weight: 500;
  padding: 0 15px 0 15px;
  margin: auto;
  color: #fff;
  display: table;
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

/* Reply message */
.reply_bubble {
  max-width: 98%;
  width: auto;
  height: auto;
  display: flex;
  background: #e0dddd;
  border-radius: 0px 6px 6px 0px;
  position: relative;
  margin: 0px 0px 3px 0px;
  float: inline-start;
  opacity: 0.8;
}
.reply_bubble.reply_alt {
  margin: 0px 0 3px 8px;
  border-radius: 6px 0px 0px 6px;
  background: #fff;
  opacity: 1;
}
.reply_bubble .reply_txt {
  padding: 8px 0 8px 0;
  border-left: 2px solid #257aa6;
  width: 100%;
}
.reply_bubble.reply_alt .reply_txt {
  padding: 8px 0 8px 0;
  border-right: 2px solid #257aa6;
  border-left: transparent;
  width: 100%;
}
.reply_bubble .reply_txt .reply_name {
  font-weight: 600;
  font-size: 12px;
  display: inline-table;
  padding: 0 0 0 10px;
  margin: 0 0 1px 0;
  color: #000;
}
.reply_bubble .reply_txt .reply_name span {
  font-weight: normal;
  color: #b3b3b3;
  overflow: hidden;
}
.reply_bubble .reply_txt .reply_message {
  font-size: 12px;
  font-weight: 500;
  padding: 0 15px 0 15px;
  color: #222;
  display: block;
}
.reply_bubble.reply_alt .reply_txt .reply_message {
  font-size: 12px;
  font-weight: 500;
  padding: 0 15px 0 15px;
  color: #222;
  display: block;
}
.reply_bubble .reply_txt .reply_timestamp {
  font-size: 11px;
  padding: 0 5px 0 10px;
  margin-top: 5px;
  /* display: inline-block; */
  display: block;
  float: right;
  position: relative;
  text-transform: uppercase;
  font-weight: 600;
  color: #777;
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
@media only screen and (max-width: 450px) {
  .main-wrapper {
    position: fixed;
  }
  .container {
    width: 100%;
    overflow-y: auto;
    height: 82vh;
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
  #messages {
    margin-top: 3px;
    margin-bottom: 5px;
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
  margin: 0 0 0 20px;
  cursor: pointer;
}
.actionbar .actions.more {
  margin: 0 6px 0 20px;
}
.actionbar .actions.attachment {
  margin: 0 0 0 30px;
}
.actionbar .actions.attachment i {
  display: block;
  transform: rotate(-45deg);
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
  font-size: 18px;
  font-weight: 600;
  text-overflow: ellipsis;
  letter-spacing: 0.3px;
  margin: 0 0 0 8px;
  overflow: hidden;
  white-space: nowrap;
  width: 65%;
}
.actionbar .status {
  display: block;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0;
}
</style>