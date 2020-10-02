import Vue from 'vue'
import Router from 'vue-router'

// Import all guest components
import HomePage from "@/views/Index";
import ForgotPassword from "@/views/ForgotPassword";

// Users component
import UserChat from "@/views/users/Chat";
import UserHome from "@/views/users/Home";
import People from "@/views/users/People";
import Settings from "@/views/users/Settings";
import NewGroup from "@/views/users/NewGroup";
import GroupList from "@/views/users/GroupList";
import GroupChat from "@/views/users/GroupChat";
import Notification from "@/views/users/Notification";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home-page",
      component: HomePage
    },
    {
      path: "/forgot-password",
      name: "forgot-password-page",
      component: ForgotPassword
    },
    {
      path: "/user-chat",
      name: "user-chat-page",
      component: UserChat,
      props: (route) => ({ ...route.params })
    },
    {
      path: "/user-home",
      name: "user-home-page",
      component: UserHome,
      props: (route) => ({ ...route.params })
    },
    {
      path: "/user-people",
      name: "user-people-page",
      component: People
    },
    {
      path: "/user-settings",
      name: "user-settings-page",
      component: Settings
    },
    {
      path: "/create-new-group",
      name: "create-new-group-page",
      component: NewGroup
    },
    {
      path: "/user-group-list",
      name: "user-group-list-page",
      component: GroupList
    },
    {
      path: "/user-group-chat",
      name: "user-group-chat-page",
      component: GroupChat
    },
    {
      path: "/user-notification",
      name: "user-notification-page",
      component: Notification
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      setTimeout(() => {
        return { x: 0, y: 0 };
      }, 500);
    }
  }
});