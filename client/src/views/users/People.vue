<template>
  <div>
    <div class="main-wrapper">
      <div class="actionbar">
        <div class="name">
          <span>People</span>
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
        <NotificationComponent :notify_count="count"></NotificationComponent>
      </div>

      <div class="input-container" v-if="search_container">
        <div class="input-rounded">
          <input name="message" id="message" v-model="search" placeholder="Enter email or phone" />
          <span class="send-button">
            <i
              class="material-icons"
              @click="sendFriendRequest"
              :style="`color: ${messageColor}; font-size: 36px; margin-top: -5px;`"
            >person_add</i>
          </span>
        </div>
        <div
          id="error-message"
          v-if="errorMessage"
          style="margin-top: 2px; background-color: #BD362F; width: 98%; margin-left: auto; margin-right: auto; text-align: center;border-left: 5px solid #BD362F; border-radius: 0px;"
        >
          <span
            style="color: #FFFFFF; -ms-word-wrap: break-word; word-wrap: break-word; font-weight: 700;margin-right: 5px; margin-left: 5px; font-size: 14px;"
          >{{ errorMessage }}</span>
        </div>

        <div
          id="success-message"
          v-if="successMessage"
          style="margin-top: 2px; background-color: #51A351; width: 98%; margin-left: auto; margin-right: auto; text-align: center;border-left: 5px solid #51A351; border-radius: 0px;"
        >
          <span
            style="color: #FFFFFF; -ms-word-wrap: break-word; word-wrap: break-word; font-weight: 700;margin-right: 5px; margin-left: 5px; font-size: 14px;"
          >{{ successMessage }}</span>
        </div>
      </div>

      <div class="container" :style="{ 'height': containerHeight }">
        <div v-if="isLoading">
          <!-- Loader -->
          <Loader></Loader>
        </div>

        <div class="list-group" v-else>
          <div v-for="item in friends" :key="item.fullname" @click="goToChatPage(item)" class="list-group-item">
            <div class="user-list">
              <div class="avatar">
                <img v-if="item.image" :src="item.image" alt="Avatar" />
                <img v-else src="@/assets/images/avatar.png" alt="Avatar" />
              </div>
              <div class="name">
                <span>{{ item.fullname }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- floating button -->
        <button type="button" class="floating-button ripple" @click="toggleSearchButton">
          <span class="material-icons" style="font-size: 32px;">{{ actionButton }}</span>
        </button>
      </div>

      <BottomNavigation></BottomNavigation>
    </div>
  </div>
</template>

<script>
import { url } from "@/shared/api";
import { mapGetters } from "vuex";
import { emojis } from "vue-chat-emoji";
import NotificationComponent from "@/components/NotificationComponent";
import Loader from "@/components/Loader";
export default {
  components: {
    Loader,
    NotificationComponent
  },
  data() {
    return {
      messageColor: "#257aa6",
      search: "",
      friends: [],
      actionButton: "add",
      search_container: false,
      containerHeight: "88vh",
      successMessage: null,
      errorMessage: null,
      isLoading: true,
      count: 0,
    };
  },
  methods: {
    checkIfAuthenticated() {
      this.$store.commit("LOAD_FROM_LOCAL");
      if (this.token == null) {
        this.$router.push("/");
      }
    },
    tempData() {
      this.friends = [];
      this.friends.push(
        {
          fullname: "Jonathan Doe",
          image: "/static/images/user_1.jpg"
        },
        {
          fullname: "Jane Doe",
          image: "/static/images/user_2.jpg"
        },
        {
          fullname: "McCarthy Roland",
          image: "/static/images/user_3.jpg"
        },
        {
          fullname: "Isabella Houston",
          image: "/static/images/user_4.jpg"
        },
        {
          fullname: "Immanuella Mikel",
          image: "/static/images/user_5.jpg"
        },
        {
          fullname: "Tribett John",
          image: "/static/images/user_6.jpg"
        },
        {
          fullname: "James Richard",
          image: "/static/images/user_7.jpg"
        },
        {
          fullname: "Samuel Jackson",
          image: "/static/images/user_8.jpg"
        },
        {
          fullname: "Jameel Xhadam",
          image: "/static/images/avatar.png"
        }
      );

      let vm = this;
      setTimeout(() => {
        vm.isLoading = false;
      }, 1000);
    },
    goBack() {
      this.$router.back();
    },
    convertTimeToHour(date) {
      var newDate = new Date().toDateString() + " " + date;
      var parsedDate = new Date(Date.parse(newDate));
      return new Intl.DateTimeFormat("en-US", {
        hour12: true,
        hour: "2-digit",
        minute: "numeric"
      }).format(parsedDate);
    },
    toggleSearchButton() {
      if (this.actionButton == "add") {
        this.search_container = true;
        this.actionButton = "clear";
        this.containerHeight = "80vh";
      } else {
        this.actionButton = "add";
        this.containerHeight = "88vh";
        this.search_container = false;
      }
    },
    sendFriendRequest() {
      if (this.search == "") {
        return false;
      } else {
        this.axios.post(`${url}/user/send_friend_request`, { search: this.search }, {
          headers: {
            "Content-Type": "application/json",
            Authorization: this.token
          }
        }).then(response => {
          if (response.status == 200) {
            this.successMessage = response.data.message;
            this.hideMessage();
            this.search = "";
            this.count = 1;
          } else {
            this.errorMessage = response.data.message;
            this.hideMessage();
          }
        }).catch(error => {
          this.errorMessage = error.message;
          this.hideMessage();
        })
      }
    },
    hideMessage() {
      let vm = this;
      this.containerHeight = "76vh";
      setTimeout(() => {
        if (vm.errorMessage) {
          document.querySelector("#error-message").classList.toggle("fade-out");
          vm.containerHeight = "80vh";
        }

        if (vm.successMessage) {
          document.querySelector("#success-message").classList.toggle("fade-out");
          vm.toggleSearchButton();
          vm.containerHeight = "88vh";
        }
        vm.errorMessage = null;
        vm.successMessage = null;
      }, 3000);
    },
    showFriends() {
      let vm = this;
      this.axios.get(`${url}/user/friends`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: this.token
        }
      }).then(response => {
        if (response.status == 200) {
          this.friends = response.data.data;
          this.isLoading = false;
        } else {
          notify.error(response.data.message);
        }
      }).catch(error => {
        notify.error(error.message);
      })
    },
    goToChatPage(args) {
      this.$store.dispatch("setActiveFriend", args);

      this.$router.push({
        name: "user-chat-page",
        params: { friend: args }
      });
    }
  },
  mounted() {
    // this.tempData();
    this.showFriends();
  },
  computed: {
    ...mapGetters(["token", "info", "active_friend"])
  },
  beforeMount() {
    this.checkIfAuthenticated();
  }
};
</script>

<style scoped>
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
.input-container {
  width: 100vw;
  padding-right: 10px;
  padding-left: 10px;
  margin-bottom: 5px;
}
.input-rounded {
  margin-top: 10px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  flex-flow: row;
  -ms-flex-flow: row;
  flex-direction: row;
  justify-content: center;
  border: 1px solid #999;
  height: 45px;
  background-color: #fff;
  border-radius: 24px;
  width: 98vw;
  position: relative;
  padding: 5px;
}
input,
input:focus {
  outline: none;
  border: none;
  border-top: none;
  resize: none;
  overflow-y: auto;
}
input#message {
  flex-grow: 2;
  border: none;
  outline: none;
  padding: 2px 20px;
}
input#message::placeholder {
  color: #777;
  font-size: 18px;
}
input#message:focus {
  outline: none;
  border: none;
}
span.send-button {
  outline: none;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
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
.list-group {
  margin-top: 2px;
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
  height: 60px;
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
  border: 2px solid #f5f5f5;
}
.user-list .name {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.3px;
  margin: 0 0 0 8px;
}
.user-list .message {
  display: block;
  font-size: 14px;
  font-weight: 400;
  margin-top: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
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
  display: inline-block;
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
}
.actionbar .name {
  display: table;
  text-align: center;
  align-content: center;
  align-self: center;
  line-height: 55px;
  justify-content: center;
  vertical-align: middle;
  margin: 0 0 0 8px;
  margin-left: 44.5%;
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
@media (max-width: 957px) {
  .actionbar .name {
    margin-left: 43.5%;
  }
}
@media (max-width: 857px) {
  .actionbar .name {
    margin-left: 43%;
  }
}
@media (max-width: 767px) {
  .actionbar .name {
    margin-left: 42%;
  }
  .input-rounded {
    width: 95vw;
  }
}
@media (max-width: 467px) {
  .actionbar .name {
    margin-left: 35%;
  }
  .input-rounded {
    width: 95vw;
  }
}
@media (max-width: 324px) {
  .actionbar .name {
    margin-left: 20%;
  }
}
.floating-button {
  height: 60px;
  width: 60px;
  background: #257aa6;
  color: #fff;
  border-radius: 50%;
  border: 1px solid #257aa6;
  box-shadow: 0px 4px 3px rgba(0, 0, 0, 0.2);
  bottom: 80px;
  right: 5%;
  position: fixed;
  cursor: pointer;
}
button:focus {
  outline: none !important;
  border: none !important;
  color: #fff;
}
/* Ripple effect */
.ripple {
  background-position: center;
  transition: background 0.3s;
}
.ripple:focus {
  background: #257aa6 radial-gradient(circle, transparent 1%, #257aa6 1%) center/15000%;
}
.ripple:active {
  background-color: #6eb9f7;
  background-size: 100%;
  transition: background 0s;
}
.fade-out {
  overflow-y: hidden;
  max-height: 0;
  box-sizing: border-box;
  transition-property: all;
  transition-duration: 0.5s;
  transition-timing-function: cubic-bezier(0.17, 0.04, 0.03, 0.94);
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
</style>