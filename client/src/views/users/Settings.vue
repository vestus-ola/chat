<template>
<div>
  <div class="main-wrapper">
    <div class="actionbar">
      <div class="back" @click="goBack">
        <i class="fa fa-arrow-left"></i>
      </div>
      <div class="name">
        <span>Settings</span>
      </div>
    </div>

    <div class="container"></div>
  </div>
</div>
</template>

<script>
import { emojis } from "vue-chat-emoji";
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      messageColor: "#000",
      message: "",
      items: []
    };
  },
  methods: {
    checkIfAuthenticated() {
      this.$store.commit("LOAD_FROM_LOCAL");
      if (this.token == null) {
        this.$router.push("/");
      }
    },
    goBack() {
      this.$router.back();
    }
  },
  mounted() {
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
}
.user-list .name {
  font-size: 16px;
  font-weight: 600;
  text-overflow: ellipsis;
  letter-spacing: 0.3px;
  margin: 0 0 0 8px;
  overflow: hidden;
  white-space: nowrap;
  width: 50vw;
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
  margin-left: 45%;
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

/* bottom navigation */
.mobile-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  will-change: transform;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  display: -webkit-box;
  display: flex;
  height: 50px;
  box-shadow: 0 -2px 5px -2px #257aa6;
  background-color: #257aa6;
  color: #ccc;
}
.mobile-bottom-nav__item {
  -webkit-box-flex: 1;
  flex-grow: 1;
  text-align: center;
  font-size: 12px;
  display: -webkit-box;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  -webkit-box-pack: center;
  justify-content: center;
}
.mobile-bottom-nav__item--active {
  color: #fff;
  font-weight: 700;
}
.mobile-bottom-nav__item-content {
  display: -webkit-box;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
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
    margin-left: 35%;
  }
}
</style>