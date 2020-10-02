<template>
  <div>
    <div class="main-wrapper">
      <div class="actionbar">
        <div class="back" @click="goBack">
          <i class="fa fa-arrow-left"></i>
        </div>
        <div class="name">
          <span>Notifications</span>
        </div>
      </div>

      <div class="container">
        <div v-if="isLoading">
          <!-- Loader goes here -->
          <Loader />
        </div>

        <div class="list-group" v-else>
          <div v-for="item in notifications" :key="item.fullname" class="list-group-item">
            <div class="notification-list" v-if="item.is_user">
              <div class="avatar">
                <img v-if="item.image" :src="item.image" alt="Avatar" />
                <img v-else src="@/assets/images/avatar.png" alt="Avatar" />
              </div>
              <div class="name" v-if="item.status == 'pending'">
                <span>
                  <b>{{ item.fullname }}</b> sent you a friend request.
                </span>
                <span class="message">
                  <span class="date text-muted">
                    <i class="glyphicon glyphicon-time" style="font-size: 18px;"></i>
                    {{ item.date }}
                  </span>
                  <span class="action-button btn-danger" @click="declineFriendRequest(item.id)">Decline</span>
                  <span class="action-button btn-primary" @click="acceptFriendRequest(item.id)">Accept</span>
                </span>
              </div>
              <div class="name" v-else>
                <span>
                  You have accepted <b>{{ item.fullname }}</b> friend request.
                </span>
                <span class="message">
                  <span class="date text-muted">
                    <i class="glyphicon glyphicon-time" style="font-size: 18px;"></i>
                    {{ item.date }}
                  </span>
                </span>
              </div>
            </div>

            <div class="notification-list" v-else>
              <div class="avatar">
                <img v-if="item.image" :src="item.image" alt="Avatar" />
                <img v-else src="@/assets/images/avatar.png" alt="Avatar" />
              </div>
              <div class="name" v-if="item.status == 'pending'">
                <span>
                  Your request to add <b>{{ item.fullname }}</b> is still pending.
                </span>
                <span class="message">
                  <span class="date text-muted">
                    <i class="glyphicon glyphicon-time" style="font-size: 18px;"></i>
                    {{ item.date }}
                  </span>
                </span>
              </div>
              <div class="name" v-else>
                <span>
                  <b>{{ item.fullname }}</b> has accepted your friend request.
                </span>
                <span class="message">
                  <span class="date text-muted">
                    <i class="glyphicon glyphicon-time" style="font-size: 18px;"></i>
                    {{ item.date }}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { url } from "@/shared/api";
import notify from "@/shared/toastr";
import { emojis } from "vue-chat-emoji";
import { mapGetters } from "vuex";
import Loader from "@/components/Loader";
export default {
  components: {
    Loader
  },
  data() {
    return {
      notifications: [],
      isLoading: true
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
      this.notifications = [];
      this.notifications.push(
        {
          id: 1,
          fullname: "Jonathan Doe",
          image: "/static/images/user_1.jpg",
          is_user: true,
          is_friend: false,
          date: "5 mins ago"
        },
        {
          id: 2,
          fullname: "Jane Doe",
          image: "/static/images/user_2.jpg",
          is_user: false,
          is_friend: true,
          date: "3 days ago"
        },
        {
          id: 3,
          fullname: "McCarthy Roland",
          image: "/static/images/user_3.jpg",
          is_user: false,
          is_friend: true,
          date: "10 days ago"
        },
        {
          id: 4,
          fullname: "Isabella Houston",
          image: "/static/images/user_4.jpg",
          is_user: true,
          is_friend: false,
          date: "2 days ago"
        },
        {
          id: 6,
          fullname: "Immanuella Mikel",
          image: "/static/images/user_5.jpg",
          is_user: true,
          is_friend: false,
          date: "8 hours ago"
        },
        {
          id: 5,
          fullname: "Tribett John",
          image: "/static/images/user_6.jpg",
          is_user: false,
          is_friend: true,
          date: "few days ago"
        }
      );
    },
    getRequestNotification() {
      let vm = this;
      this.axios.get(`${url}/user/friend_request_notification`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: this.token
        }
      }).then(response => {
        if (response.status == 200) {
          this.notifications = response.data.data;
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
    markAllNotificationsAsRead() {
      this.axios.get(`${url}/user/friend_request/mark_as_read`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: this.token
        }
      }).then(response => {
        if (response.status == 200) {
          console.log(response.data.message)
        } else {
          console.log(response.data.message);
        }
      }).catch(error => {
        console.log(error.message);
      })
    },
    goBack() {
      this.$router.back();
    },
    acceptFriendRequest(friend_id) {
      this.axios.post(`${url}/user/friend_request/accept_or_decline/${friend_id}`, { status: "accepted" }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: this.token
        }
      }).then(response => {
        if (response.status == 200) {
          this.getRequestNotification();
        } else {
          notify.error(response.data.message);
        }
      }).catch(error => {
        notify.error(error.message);
      })
    },
    declineFriendRequest() {
      this.axios.post(`${url}/user/friend_request/accept_or_decline/${friend_id}`, { status: "decline" }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: this.token
        }
      }).then(response => {
        if (response.status == 200) {
          this.getRequestNotification();
        } else {
          notify.error(response.data.message);
        }
      }).catch(error => {
        notify.error(error.message);
      })
    }
  },
  mounted() {
    this.markAllNotificationsAsRead();
    this.getRequestNotification();
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
.notification-list {
  margin-top: 4px;
  height: 70px;
  font-size: 24px;
}
.notification-list:after {
  content: "";
  display: block;
  clear: both;
}
.notification-list div {
  float: left;
  transform: translateY(-50%);
  position: relative;
  top: 50%;
}
.notification-list .actions {
  float: right;
  text-align: center;
  margin: 0 0 0 10px;
}
.notification-list .actions .time-block {
  display: block;
  font-size: 14px;
  font-weight: 400;
}
.notification-list .avatar {
  margin: 2px 2px;
  width: 50px;
  height: 50px;
}
.notification-list .avatar img {
  border-radius: 50%;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.1);
  display: block;
  width: 100%;
  border: 3px solid #f5f5f5;
}
.notification-list .name {
  display: block;
  font-size: 14px;
  letter-spacing: 0.3px;
  margin: 0 0 0 8px;
  overflow: hidden;
  width: 85%;
}
.notification-list .message {
  display: block;
  font-size: 14px;
  font-weight: 400;
  margin-top: 5px;
}
.notification-list .message .date {
  font-size: 13px;
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
.actionbar .back {
  cursor: pointer;
}
.actionbar .name {
  text-align: center;
  align-content: center;
  align-self: center;
  line-height: 55px;
  justify-content: center;
  vertical-align: middle;
  margin: 0 0 0 8px;
  margin-left: calc(100% / 2 - 80px);
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
.action-button {
  display: block;
  padding: 1px 3px;
  font-size: 12px;
  line-height: 1.5;
  margin-right: 5px;
  margin-left: 5px;
  font-weight: normal;
  text-align: center;
  white-space: nowrap;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-image: none;
  border: 1px solid transparent;
  border-radius: 3px;
  float: right;
}
.action-button:focus,
.action-button:active:focus,
.action-button.active:focus,
.action-button.focus,
.action-button:active.focus,
.action-button.active.focus {
  outline: 5px auto -webkit-focus-ring-color;
  outline-offset: -2px;
}
.action-button:hover,
.action-button:focus,
.action-button.focus {
  color: #fff;
  text-decoration: none;
}
.action-button:active,
.action-button.active {
  background-image: none;
  outline: 0;
  -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
  box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
}

@media (max-width: 467px) {
  .actionbar .name {
    margin-left: 28%;
  }

  .notification-list .name {
    font-size: 14px;
    letter-spacing: 0.3px;
    margin: 0 0 0 8px;
    overflow: hidden;
    width: 80%;
  }
}

@media (max-width: 340px) {
  .notification-list .name {
    font-size: 14px;
    letter-spacing: 0.3px;
    margin: 0 0 0 8px;
    overflow: hidden;
  }
}

@media (max-width: 330px) {
  .notification-list .name {
    display: block;
    font-size: 14px;
    letter-spacing: 0.3px;
    margin: 0 0 0 5px;
    overflow: hidden;
  }
}

@media (max-width: 324px) {
  .actionbar .name {
    margin-left: 20%;
  }
  .notification-list .name {
    font-size: 14px;
    letter-spacing: 0.3px;
    margin: 0 0 0 5px;
    overflow: hidden;
    width: 78%;
  }
  .notification-list .message {
    font-size: 13px;
  }
  .notification-list .message .date {
    font-size: 12px;
  }
}

@media (max-width: 315px) {
  .notification-list .name {
    display: block;
    font-size: 13px;
    letter-spacing: 0.3px;
    margin: 0 0 0 4px;
    overflow: hidden;
  }

  .notification-list .message {
    font-size: 12px;
  }
  .notification-list .message .date {
    font-size: 11px;
  }
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