<template>
  <div>
    <nav class="mobile-bottom-nav">
      <div class="mobile-bottom-nav__item mobile-bottom-nav__item--active">
        <router-link to="/user-home" class="router-link" style="text-decoration: none;">
          <div class="mobile-bottom-nav__item-content">
            <i class="material-icons">chat</i> Chats
          </div>
        </router-link>
      </div>
      <div class="mobile-bottom-nav__item">
        <router-link to="/user-group-list" class="router-link" style="text-decoration: none;">
          <div class="mobile-bottom-nav__item-content">
            <i class="material-icons">forum</i> Groups
          </div>
        </router-link>
      </div>
      <div class="mobile-bottom-nav__item">
        <router-link to="/user-people" class="router-link" style="text-decoration: none;">
          <div class="mobile-bottom-nav__item-content">
            <i class="material-icons">people</i> People
          </div>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  data() {
    return {

    };
  },
  methods: {
    bottomNavigation() {
      var navItems = document.querySelectorAll(".mobile-bottom-nav__item");
      navItems.forEach(function(e, i) {
        e.addEventListener("click", function(e) {
          navItems.forEach(function(e2, i2) {
            e2.classList.remove("mobile-bottom-nav__item--active");
          });
          this.classList.add("mobile-bottom-nav__item--active");
        });
      });
    },
    selectActiveRoute() {
      var vm = this;
      var routerLink = document.querySelectorAll(".router-link");
      routerLink.forEach(function(e, i) {
        if (vm.$route.path == e.pathname) {
          e.classList.remove("router-link");
          e.classList.add("router-link-exact-active");
        } else {
          e.classList.remove("router-link-exact-active");
          e.classList.add("router-link");
        }
      });
    }
  },
  mounted() {
    this.bottomNavigation();
    this.selectActiveRoute();
  },
  created() {
    this.selectActiveRoute();
  }
};
</script>

<style scoped>
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
    width: 100vw;
    overflow-y: auto;
    height: 88vh;
    overflow-x: hidden;
  }
  .actionbar .name {
    margin-left: 35%;
  }
}
.router-link {
  color: #ccc;
}
.router-link-exact-active {
  color: #fff;
}
</style>