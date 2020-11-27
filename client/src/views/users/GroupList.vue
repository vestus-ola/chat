<template>
  <div class="main-wrapper">
    <div class="actionbar">
      <div class="name">
        <span>Groups</span>
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
        <!-- Loader -->
        <Loader></Loader>
      </div>

      <div class="list-group" v-else>
        <div v-if="skeletonLoader">
          <div class="list-group-item" v-for="item in items"
            :key="item">
            <div class="skeleton-list">
              <div class="avatar">
                <img alt="im" src="@/assets/images/avatar.png" />
              </div>
              <div class="name">
                <span></span>
                <span class="message"></span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="itemsLoaded">
          <div
            v-for="item in items"
            :key="item.fullname"
            @click="goToGroupChat"
            class="list-group-item"
          >
            <div class="group-list">
              <div class="avatar">
                <img :src="item.image" v-if="item.image" alt="Avatar" />
                <img src="@/assets/images/avatar.png" v-else alt="Avatar" />
              </div>
              <div class="name">
                <span>{{ item.group_name }}</span>
                <span class="typing" v-if="item.user_typing">
                  {{ item.user_typing }}
                </span>
                <span class="message" v-else>{{ stringifyMessage(item.message) }}</span>
              </div>
              <div class="actions">
                <div class="notification"></div>
                <span class="time-block">
                  <span v-text="item.when" :class="item.unread > 0 ? 'time-unread': 'time'"></span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <BottomNavigation></BottomNavigation>
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
      items: [],
      isLoading: true,
      groups: [],
      itemsLoaded: false,
      skeletonLoader: false
    };
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
    tempData() {
      this.items = [];
      this.skeletonLoader = true;
      this.items.push(
        {
          group_name: "Jonathan Doe",
          message: "Where are you?",
          unread: 0,
          when: this.convertTimeToHour("15:26"),
          image: "/static/images/user_1.jpg"
        },
        {
          group_name: "Jane Doe",
          message: ":thumbs_up: That's the point.",
          unread: 0,
          when: this.convertTimeToHour("08:12"),
          image: "/static/images/user_2.jpg"
        },
        {
          group_name: "McCarthy Roland",
          message: "When are you coming to work?",
          unread: 6,
          when: this.convertTimeToHour("12:26"),
          image: "/static/images/user_3.jpg"
        },
        {
          group_name: "Isabella Houston",
          message: "I will definately be there.",
          unread: 0,
          when: this.convertTimeToHour("13:00"),
          image: "/static/images/user_4.jpg"
        },
        {
          group_name: "Immanuella Mikel",
          message: "Wow! That's fine by me.",
          unread: 0,
          when: this.convertTimeToHour("09:21"),
          image: "/static/images/user_5.jpg"
        },
        {
          group_name: "Tribett John",
          message: "Will Real Madrid win this night?",
          unread: 1,
          when: this.convertTimeToHour("22:23"),
          image: "/static/images/user_6.jpg"
        },
        {
          group_name: "James Richard",
          message: "Where are you?",
          unread: 26,
          when: this.convertTimeToHour("12:01"),
          image: "/static/images/user_7.jpg"
        },
        {
          group_name: "Samuel Jackson",
          message: "Where are you?",
          unread: 1,
          when: this.convertTimeToHour("10:10"),
          image: "/static/images/user_8.jpg"
        },
        {
          group_name: "Jameel Xhadam",
          message: "Hey. Are you there?",
          unread: 12,
          when: this.convertTimeToHour("10:10"),
          image: "/static/images/avatar.png"
        }
      );

      let vm = this;
      setTimeout(() => {
        vm.isLoading = false;
      }, 500);
      setTimeout(() => {
        vm.skeletonLoader = false;
        vm.itemsLoaded = true;
      }, vm.getRandomInt(1000,5000))
    },
    goToGroupChat(item) {
      this.$store.dispatch("setActiveGroup", {
        id: parseInt(item.group_id),
        image: item.image,
        group_name: item.group_name,
        group_uuid: item.group_uuid
      });

      this.$router.push("/user-group-chat");
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
    showGroupChatLists() {
      let vm = this;
      this.axios.get(`${url}/user/group_lists`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: this.token
        }
      }).then(response => {
        if (response.status == 200) {
          this.groups = response.data.data;
          setTimeout(() => {
            vm.isLoading = false;
          }, 100);
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
    this.tempData();
  },
  computed: {
    ...mapGetters(["token", "info"])
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
.group-list {
  height: 60px;
  font-size: 24px;
}
.group-list:after {
  content: "";
  display: table;
  clear: both;
}
.group-list div {
  float: left;
  transform: translateY(-50%);
  position: relative;
  top: 50%;
}
.group-list .actions {
  float: right;
  text-align: center;
  margin: 0 0 0 10px;
}
.group-list .actions .time-block {
  display: block;
  font-size: 14px;
  font-weight: 400;
}
.group-list .avatar {
  margin: 2px 2px;
  width: 50px;
  height: 50px;
}
.group-list .avatar img {
  border-radius: 50%;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.1);
  display: block;
  width: 100%;
}
.group-list .name {
  font-size: 16px;
  font-weight: 600;
  text-overflow: ellipsis;
  letter-spacing: 0.3px;
  margin: 0 0 0 8px;
  overflow: hidden;
  white-space: nowrap;
  width: 50vw;
}
.group-list .message {
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
@keyframes slideFromBotton {
  0% {
    margin-bottom: -200px;
    opacity: 0;
  }
  100% {
    margin-bottom: 0;
    opacity: 1;
  }
}
@-webkit-keyframes slideFromBotton {
  0% {
    margin-bottom: -200px;
    opacity: 0;
  }
  100% {
    margin-bottom: 0;
    opacity: 1;
  }
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
  animation: pulse-bg 1s infinite;
}
.skeleton-list .avatar img {
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
  width: 30vw;
  min-width: 20vw;
  min-height: 14px;
  width: 50px;
  animation: pulse-bg 1s infinite;
  content: ' ';
  margin-bottom: 5px;
}
.skeleton-list .name span.message {
  /* display: block; */
  display: block;
  /* font-size: 14px;
  font-weight: 400; */
  margin-top: 5px;
  /* text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap; */
  min-width: 60vw;
  min-height: 12px;
  width: 50px;
  animation: pulse-bg 1s infinite;
  content: ' ';
}

@keyframes pulse-bg {
  0% { background-color: #ddd; }
  50% { background-color: #d0d0d0; }
  100% { background-color: #ddd; }
}
@keyframes shimmer {
  100% {
    from{
      transform: translateX(-100%);
      background-image: linear-gradient(
        90deg,
        rgba(#fff, 0) 0,
        rgba(#fff, 0.2) 20%,
        rgba(#fff, 0.5) 60%,
        rgba(#fff, 0)
      );
    }
    to {
      transform: translateX(100%);

    }
  }
}
</style>