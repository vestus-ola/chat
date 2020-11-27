<template>
  <div>
    <div class="main-wrapper">
      <div class="actionbar">
        <div class="name">
          <span>Chats</span>
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
                <router-link to="/create-new-group">New Group</router-link>
              </li>
              <li role="separator" class="divider"></li>
              <li>
                <router-link to="/user-settings">Settings</router-link>
              </li>
            </ul>
          </span>
        </div>

        <!-- Notification component -->
        <NotificationComponent></NotificationComponent>
      </div>

      <div class="container">
        <div v-if="isLoading">
          <Loader />
        </div>

        <div class="list-group" v-else>
          <div v-if="skeletonLoader">
            <div class="list-group-item" v-for="item in skeletonItem"
              :key="item">
              <div class="skeleton-list">
                <div class="avatar animate-linear">
                  <div class="avatar-circle"></div>
                </div>
                <div class="name">
                  <span class="animate-linear"></span>
                  <span class="message animate-linear"></span>
                </div>
                <div class="actions">
                  <div class="notification"></div>
                  <span class="time-block">
                    <span v-text="' '" class="animate-linear"></span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="itemsLoaded">
            <div v-for="item in friends" :key="item.fullname" @click="goToChat(item)" class="list-group-item">
              <div class="user-list">
                <div class="avatar">
                  <img :src="item.image" v-if="item.image" alt="Avatar" />
                  <img src="@/assets/images/avatar.png" v-else alt="Avatar" />
                </div>
                <div class="name">
                  <span>{{ item.fullname }}</span>
                  <span class="typing" v-if="item.user_typing">
                    {{ item.user_typing }}
                  </span>
                  <span class="message" v-else>
                    <span v-if="item.sender_id == info.id">
                      <span class="tick" v-if="item.message_status == 'read'">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" id="msg-dblcheck-ack" x="2063" y="2076"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="#4fc3f7"/></svg>
                      </span>
                      <span class="tick" v-else><svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" id="msg-dblcheck-ack" x="2063" y="2076"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="#777"/>
                        </svg>
                      </span>
                      </span>
                    {{ stringifyMessage(item.message) }}
                  </span>
                </div>
                <div class="actions">
                  <div class="notification"></div>
                  <span v-if="item.unread" v-text="item.unread" class="unread"></span>
                  <span class="time-block">
                    <span v-text="convertTimeToHour(item.date)" :class="item.unread > 0 ? 'time-unread': 'time'"></span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation></BottomNavigation>
    </div>
  </div>
</template>

<script>
import { url } from "@/shared/api";
import notify from "@/shared/toastr";
import { emojis } from "vue-chat-emoji";
import { mapGetters } from "vuex";
import NotificationComponent from "@/components/NotificationComponent";
import Loader from "@/components/Loader";
export default {
  components: {
    NotificationComponent,
    Loader
  },
  data() {
    return {
      messageColor: "#000",
      message: "",
      friends: [],
      isLoading: true,
      itemsLoaded: false,
      skeletonLoader: false,
      skeletonItem: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    };
  },
  sockets: {
    connect: function () {
      console.log('socket connected...')
    },
    privateMessageTyped: function (data) {
      let vm =  this;
      let friend = this.friends.find(user => user.friend_id == data.user.id);
      if (data.message) {
        friend.user_typing = data.message;
      } else {
        friend.user_typing = null;
      }
    },
    receivedPrivateMessage: function(data) {
      this.showChatLists();

      // Check browser notification permission
      Notification.requestPermission(function () {
        if (Notification.permission == "granted") {
          // Access granted
          let messageNotification = new Notification(`New Message from ${data.data.sender_fullname}`, {
            body: data.data.message,
            icon: data.data.app_logo,
            image: data.data.sender_image,
            timestamp: new Date(data.data.date).getTime(),
            vibrate: [200, 100, 200]
          });

          messageNotification.onclick = function (event) {
            event.preventDefault();
            window.open(messageNotification)
          };
        } else if (Notification.permission == "denied") {
          // Notification denied
        } else {
          // Notification not enabled
        }
      })
    },
  },
  methods: {
    checkIfAuthenticated() {
      this.$store.commit("LOAD_FROM_LOCAL");
      if (this.token == null) {
        this.$router.push("/");
      }
    },
    stringifyMessage(message) {
      return emojis.decodeEmoji(message);
    },
    emojifyMessage(message) {},
    tempData() {
      this.items = [];
      this.items.push(
        {
          fullname: "Jonathan Doe",
          message: this.decodeEmoji("Where are you?"),
          unread: 0,
          date: this.convertTimeToHour("15:26"),
          image: "/static/images/user_1.jpg",
          friend_id: 0,
          message_id: 1,
          delete_action: 0,
          message_status: "read"
        },
        {
          fullname: "Jane Doe",
          message: this.decodeEmoji(":thumbs_up: That's the point."),
          unread: 0,
          date: this.convertTimeToHour("08:12"),
          image: "/static/images/user_2.jpg",
          friend_id: 0,
          message_id: 1,
          delete_action: 0,
          message_status: "read"
        },
        {
          fullname: "McCarthy Roland",
          message: this.decodeEmoji("When are you coming to work?"),
          unread: 6,
          date: this.convertTimeToHour("12:26"),
          image: "/static/images/user_3.jpg",
          friend_id: 0,
          message_id: 1,
          delete_action: 0,
          message_status: "read"
        },
        {
          fullname: "Isabella Houston",
          message: this.decodeEmoji("I will definately be there."),
          unread: 0,
          date: this.convertTimeToHour("13:00"),
          image: "/static/images/user_4.jpg",
          friend_id: 0,
          message_id: 1,
          delete_action: 0,
          message_status: "read"
        },
        {
          fullname: "Immanuella Mikel",
          message: this.decodeEmoji("Wow! That's fine by me."),
          unread: 0,
          date: this.convertTimeToHour("09:21"),
          image: "/static/images/user_5.jpg",
          friend_id: 0,
          message_id: 1,
          delete_action: 0,
          message_status: "read"
        },
        {
          fullname: "Tribett John",
          message: this.decodeEmoji("Will Real Madrid win this night?"),
          unread: 1,
          date: this.convertTimeToHour("22:23"),
          image: "/static/images/user_6.jpg",
          friend_id: 0,
          message_id: 1,
          delete_action: 0,
          message_status: "delivered"
        },
        {
          fullname: "James Richard",
          message: this.decodeEmoji("Where are you?"),
          unread: 26,
          date: this.convertTimeToHour("12:01"),
          image: "/static/images/user_7.jpg",
          friend_id: 0,
          message_id: 1,
          delete_action: 0,
          message_status: "delivered"
        },
        {
          fullname: "Samuel Jackson",
          message: this.decodeEmoji("Where are you?"),
          unread: 1,
          date: this.convertTimeToHour("10:10"),
          image: "/static/images/user_8.jpg",
          friend_id: 0,
          message_id: 1,
          delete_action: 0,
          message_status: "read"
        },
        {
          fullname: "Jameel Xhadam",
          message: this.decodeEmoji("Hey. Are you there?"),
          unread: 12,
          date: this.convertTimeToHour("10:10"),
          image: "/static/images/avatar.png",
          friend_id: 0,
          message_id: 1,
          delete_action: 0,
          message_status: "delivered"
        }
      );

      let vm = this;
      setTimeout(() => {
        vm.isLoading = false;
      }, 1000);
    },
    goToChat(item) {
      this.$store.dispatch("setActiveFriend", {
        id: item.friend_id,
        image: item.image,
        fullname: item.fullname,
        email: item.email,
        phone: item.phone,
        display_name: item.display_name
      });

      this.$router.push({
        name: "user-chat-page",
        params: {
          friend: {
            id: item.friend_id,
            image: item.image,
            fullname: item.fullname,
            email: item.email,
            phone: item.phone,
            display_name: item.display_name
          }
        }
      });
    },
    register() {
      this.$socket.emit("register_user", { user: this.info });
    },
    convertTimeToHour(date) {
      var parsedDate = new Date(Date.parse(date));
      return new Intl.DateTimeFormat("en-US", {
        hour12: true,
        hour: "2-digit",
        minute: "numeric"
      }).format(parsedDate);
    },
    showChatLists() {
      let vm = this;
      this.skeletonLoader = true;
      this.axios.get(`${url}/user/chat_lists`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: this.token
        }
      }).then(response => {
        if (response.status == 200) {
          this.friends = response.data.data;
          setTimeout(() => {
            vm.isLoading = false;
          }, 100);
          setTimeout(() => {
            vm.skeletonLoader = false;
            vm.itemsLoaded = true;
          }, vm.getRandomInt(1000, 5000))
        } else {
          notify.error(response.data.message);
        }
      }).catch(error => {
        notify.error(error.message);
      })
    },
    getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  },
  mounted() {
    this.showChatLists();
  },
  computed: {
    ...mapGetters([
      "token", "info", "active_friend"
    ]),
  },
  beforeMount() {
    this.checkIfAuthenticated();
  },
  watch: {
    user_is_typing() {
      this.user_typing = this.user_is_typing;
    },
  },
};
</script>

<style lang="scss" scoped>
.main-wrapper {
  font-family: "Helvetica Neue", Helvetica /*, sans-serif*/;
  margin: 0;
  padding: 0;
  height: 100vh;
  overflow-x: hidden;
}
.chat-list {
  margin-top: 60px;
}
.container {
  width: 100vw;
  overflow-y: auto;
  height: 88vh;
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
  border-radius: 4px;
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
.actionbar-title {
  margin-top: 20px;
  color: #fff;
  font-size: 24px;
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
  font-size: 24px;
}
.icon-emoticon {
  color: #000;
  font-size: 24px;
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
  height: 45px;
  background-color: #fff;
  border-radius: 24px;
  padding: 5px;
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
  padding: 2px 20px;
}
textarea#message::placeholder {
  color: #777;
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
.info {
  font-size: 20px;
}
.time {
  color: #222;
  font-size: 14px;
  font-weight: 500;
  margin-right: 8px;
}
.muted {
  font-weight: normal;
  opacity: 0.4;
  font-size: 20px;
}
.time-unread {
  font-size: 14px;
  font-weight: 600;
  color: #579ffb;
  margin-right: 8px;
}
.unread {
  width: 30px;
  height: 30px;
  background: #257aa6;
  margin-right: 5px;
  margin-top: -2px;
  padding: 5px 7px;
  justify-content: space-evenly;
  color: #fff;
  font-weight: 600;
  font-size: 15px;
}
.list-group {
  margin-top: 2px;
  animation-name: slideFromTop;
  animation-duration: 200ms;
}
.list-group .list-group-item {
  color: #212121;
  font-size: 16px;
  margin: 0;
  padding: 5px;
  border: none;
  border-bottom: 1px solid #ccc;
}
.list-group .list-group-item:last-child {
  color: #212121;
  font-size: 16px;
  margin: 0;
  padding: 5px;
  border: none;
}
.list-group .list-group-item div {
  vertical-align: center;
}
.list-group .list-group-item .thumb {
  width: 60px;
  height: 60px;
  margin-right: 16px;
}
.list-group .list-group-item.active {
  background-color: #e0e0e0;
}
.list-group .list-group-item .list-group-item-text {
  color: #757575;
  font-size: 14px;
}
.user-list {
  height: 70px;
  font-size: 24px;
}
.user-list:after {
  content: "";
  display: table;
  clear: both;
}
.user-list div {
  float: left;
  transform: translateY(-50%);
  position: relative;
  top: 50%;
}
.user-list .actions {
  float: right;
  text-align: center;
  margin: 0 0 0 10px;
}
.user-list .actions .time-block {
  display: block;
  font-size: 14px;
  font-weight: 400;
}
.user-list .avatar {
  margin: 2px 2px;
  width: 50px;
  height: 50px;
}
.user-list .avatar img {
  border-radius: 50%;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.1);
  display: block;
  width: 100%;
}
.user-list .name {
  font-size: 16px;
  font-weight: 600;
  text-overflow: ellipsis;
  letter-spacing: 0.3px;
  margin: 0 0 0 8px;
  overflow: hidden;
  white-space: nowrap;
  width: 85vw;
}
.user-list .message {
  width: 85vw;
  display: block;
  font-size: 14px;
  font-weight: 400;
  margin-top: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.user-list .typing {
  display: block;
  font-style: italic;
  color: #42a5f5;
  font-size: 14px;
  font-weight: 400;
  margin-top: 5px;
}
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
.actionbar .name {
  text-align: center;
  align-content: center;
  align-self: center;
  line-height: 55px;
  justify-content: center;
  vertical-align: middle;
  margin: 0 0 0 8px;
  margin-left: 50%;
  font-size: 20px;
  font-weight: 700;
}
.actionbar .actions {
  float: right;
  margin: 0 0 0 20px;
  cursor: pointer;
}
.actionbar .actions.more {
  margin: 0 6px 0 12px;
  color: #fff;
}
@media only screen and (max-width: 450px) {
  .main-wrapper {
    position: fixed;
  }
  .container {
    /* margin-bottom: 60px; */
    width: 100vw;
    overflow-y: auto;
    height: 88vh;
    overflow-x: hidden;
  }
  .actionbar .name {
    margin-left: 40%;
  }

  .user-list .name {
    font-size: 16px;
    font-weight: 600;
    text-overflow: ellipsis;
    letter-spacing: 0.3px;
    margin: 0 0 0 5px;
    overflow: hidden;
    white-space: nowrap;
    width: 50vw;
  }
  .user-list .message {
    display: block;
    width: 60vw;
  }
}
@media only screen and (max-width: 400px) {
  .user-list .name {
    width: 45vw;
  }
  .user-list .message {
    display: block;
    width: 50vw;
  }
}
.badge-notify {
  background: red;
  position: relative;
  top: -20px;
  left: -20px;
}
@keyframes slideFromTop {
  0% {
    margin-top: -300px;
    opacity: 0;
  }
  100% {
    margin-top: 0;
    opacity: 1;
  }
}
@-webkit-keyframes slideFromTop {
  0% {
    margin-top: -300px;
    opacity: 0;
  }
  100% {
    margin-top: 0;
    opacity: 1;
  }
}
.message .tick {
  display: inline-block;
  margin-left: 2px;
  position: relative;
  top: 4px;
  height: 16px;
  width: 16px;
}
.message .tick svg {
  position: absolute;
  transition: .5s ease-in-out;
}
.message .tick svg:first-child {
  -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
  -webkit-transform: perspective(800px) rotateY(180deg);
          transform: perspective(800px) rotateY(180deg);
}
.message .tick svg:last-child {
  -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
  -webkit-transform: perspective(800px) rotateY(0deg);
          transform: perspective(800px) rotateY(0deg);
}
.message .tick-animation svg:first-child {
  -webkit-transform: perspective(800px) rotateY(0);
          transform: perspective(800px) rotateY(0);
}
.message .tick-animation svg:last-child {
  -webkit-transform: perspective(800px) rotateY(-179.9deg);
          transform: perspective(800px) rotateY(-179.9deg);
}

/* skeleton loader animation */
.skeleton-list {
  height: 60px;
  font-size: 24px;
}
.skeleton-list:after {
  content: "";
  display: table;
  clear: both;
}
.skeleton-list div {
  float: left;
  transform: translateY(-50%);
  position: relative;
  top: 50%;
}
.skeleton-list .actions {
  float: right;
  text-align: center;
  margin: 0 0 0 10px;
}
.skeleton-list .actions .time-block {
  display: block;
  font-size: 14px;
  font-weight: 400;
}
.skeleton-list .avatar {
  margin: 2px 2px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  width: 50px;
  background-color: #dddbdd;
}
.skeleton-list .avatar div {
  border-radius: 50%;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.1);
  display: block;
  width: 50px;
  height: 50px;
  width: 100%;
}
.skeleton-list .name span {
  display: block;
  font-size: 16px;
  font-weight: 600;
  text-overflow: ellipsis;
  letter-spacing: 0.3px;
  margin: 0 0 0 8px;
  overflow: hidden;
  white-space: nowrap;
  width: 50vw;
  min-width: 20vw;
  min-height: 14px;
  width: 50px;
  background-color: #dddbdd;
  content: ' ';
  margin-bottom: 5px;
}
.skeleton-list .name span.message {
  display: block;
  margin-top: 5px;
  width: 80vw;
  min-height: 12px;
  background-color: #dddbdd;
  content: ' ';
}
.skeleton-list .actions {
  float: right;
  text-align: center;
  margin: 0 0 0 10px;
}
.skeleton-list .actions span {
  display: block;
  font-size: 14px;
  font-weight: 400;
  height: 14px;
  width: 8vw;
  background-color: #dddbdd;
  content: ' ';
}

.animate-linear {
  background: linear-gradient(-45deg, #DDDDDD, #F0F0F0, #DDDDDD, #F0F0F0);
	background-size: 400% 400%;
	-webkit-animation: Gradient 2.25s ease infinite;
	-moz-animation: Gradient 2.25s ease infinite;
	animation: Gradient 2.25s ease infinite;
}

@media only screen and (max-width: 450px) {
  .skeleton-list .actions span {
    width: 15vw;
  }

  .skeleton-list .name span.message {
    width: 50vw;
  }

  .skeleton-list .name span {
    width: 50px;
  }
}

@keyframes pulse-bg {
  0% { background-color: #ddd; }
  50% { background-color: #d0d0d0; }
  100% { background-color: #ddd; }
}

@-webkit-keyframes Gradient {
	0% {
		background-position: 0% 50%
	}
	50% {
		background-position: 100% 50%
	}
	100% {
		background-position: 0% 50%
	}
}

@-moz-keyframes Gradient {
	0% {
		background-position: 0% 50%
	}
	50% {
		background-position: 100% 50%
	}
	100% {
		background-position: 0% 50%
	}
}

@keyframes Gradient {
	0% {
		background-position: 0% 50%
	}
	50% {
		background-position: 100% 50%
	}
	100% {
		background-position: 0% 50%
	}
}
</style>