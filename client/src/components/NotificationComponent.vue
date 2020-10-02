<template>
  <div class="actions" style="line-height: 55px; margin-right: 5px;">
    <router-link to="/user-notification" style="color: #fff;">
      <i class="glyphicon glyphicon-bell"></i>
      <span class="badge badge-notify" v-if="notification > 0">{{ notification }}</span>
    </router-link>
  </div>
</template>

<script>
import { url } from "@/shared/api";
import notify from "@/shared/toastr";
import { mapGetters } from "vuex";
export default {
  props: ["notify_count"],
  data() {
    return {
      notification: 0
    }
  },
  methods: {
    countAllUnreadFriendRequestNotifications() {
      this.axios.get(`${url}/user/friend_request/unread/count`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: this.token
        }
      }).then(response => {
        if (response.status == 200) {
          this.notification = response.data.count;
        } else {
          console.log(response.data.message);
        }
      }).catch(error => {
        console.log(error.message);
      })
    }
  },
  mounted() {
    this.countAllUnreadFriendRequestNotifications();
  },
  computed: {
    ...mapGetters(["token", "info"])
  },
  watch: {
    notify_count() {
      this.countAllUnreadFriendRequestNotifications();
    }
  },
}
</script>

<style scoped>
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
.badge-notify {
  background: red;
  position: relative;
  top: -20px;
  left: -20px;
}
</style>