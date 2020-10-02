<template>
  <div class="main-wrapper">
    <div class="page-content">
      <div class="app">
        <div class="container">
          <form action method="POST" @submit.prevent="register" v-if="!isLoggin">
            <header>
              <img src="@/assets/logo.png" />
            </header>
            <div class="inputs">
              <input
                type="text"
                name="fullname"
                id="fullname"
                v-model.trim="registerForm.fullname"
                placeholder="John Doe"
                :class="{ 'form-group--error': $v.registerForm.fullname.$error }"
              />
              <div
                class="error--feedback"
                v-if="registerFormStatus && !$v.registerForm.email.required"
              >
                <strong>Fullname is required.</strong>
              </div>

              <input
                type="email"
                name="email"
                v-model.trim="registerForm.email"
                id="email"
                placeholder="johndoe@example.com"
                @change="validateEmail"
                :class="{ 'form-group--error': $v.registerForm.email.$error }"
              />
              <div
                class="error--feedback"
                v-if="registerFormStatus && !$v.registerForm.email.required"
              >
                <strong>Email is required.</strong>
              </div>
              <div
                class="error--feedback"
                v-if="is_email_validated"
              >
                <strong>Email has already been taken.</strong>
              </div>
              <div
                class="error--feedback"
                v-if="registerFormStatus && !$v.registerForm.email.email"
              >
                <strong>Email entered is invalid.</strong>
              </div>

              <input
                type="number"
                name="phone"
                id="phone"
                placeholder="+2348100000000"
                @change="validatePhone"
                v-model.trim="registerForm.phone"
                :class="{ 'form-group--error': $v.registerForm.phone.$error }"
              />
              <div
                class="error--feedback"
                v-if="registerFormStatus && !$v.registerForm.phone.required"
              >
                <strong>Phone is required.</strong>
              </div>
              <div
                class="error--feedback"
                v-if="is_phone_validated"
              >
                <strong>Phone has already been taken.</strong>
              </div>
              <div
                class="error--feedback"
                v-if="registerFormStatus && !$v.registerForm.phone.minLength"
              >
                <strong>Phone number cannot be less than {{ $v.registerForm.phone.$params.minLength.min }}.</strong>
              </div>

              <input
                type="password"
                name="password"
                id="password"
                v-model.trim="registerForm.password"
                placeholder="*********"
                :class="{ 'form-group--error': $v.registerForm.password.$error }"
              />

              <div
                class="error--feedback"
                v-if="registerFormStatus && !$v.registerForm.password.required"
              >
                <strong>Password is required.</strong>
              </div>
              <div
                class="error--feedback"
                v-if="registerFormStatus && !$v.registerForm.phone.minLength"
              >
                <strong>Password cannot be less than {{ $v.registerForm.password.$params.minLength.min }}.</strong>
              </div>

              <input
                type="password"
                name="confirm_password"
                v-model.trim="registerForm.confirm_password"
                id="confirm_password"
                placeholder="*********"
                :class="{ 'form-group--error': $v.registerForm.confirm_password.$error }"
              />

              <div
                class="error--feedback"
                v-if="registerFormStatus && !$v.registerForm.confirm_password.required"
              >
                <strong>Confirm Password is required.</strong>
              </div>
              <div
                class="error--feedback"
                v-if="registerFormStatus && !$v.registerForm.confirm_password.minLength"
              >
                <strong>Confirm Password cannot be less than {{ $v.registerForm.confirm_password.$params.minLength.min }}.</strong>
              </div>
              <div
                class="error--feedback"
                v-if="registerFormStatus && !$v.registerForm.confirm_password.equal"
              >
                <strong>Passwords does not match.</strong>
              </div>

              <button type="submit" :disabled="loginBtn" class="btn">Register</button>
              <br />
              <br />
            </div>
          </form>

          <form v-else method="POST" @submit.prevent="login">
            <header>
              <img src="@/assets/logo.png" />
            </header>
            <div class="inputs">
              <input
                type="email"
                name="email"
                v-model.trim="loginForm.email"
                id="email"
                placeholder="johndoe@example.com"
                :class="{ 'form-group--error': $v.loginForm.email.$error }"
              />
              <div class="error--feedback" v-if="loginFormStatus && !$v.loginForm.email.required">
                <strong>Email is required.</strong>
              </div>
              <div class="error--feedback" v-if="loginFormStatus && !$v.loginForm.email.email">
                <strong>Email entered is invalid.</strong>
              </div>
              <input
                type="password"
                v-model.trim="loginForm.password"
                name="password"
                id="password"
                placeholder="*********"
                :class="{ 'form-group--error': $v.loginForm.password.$error }"
              />
              <div></div>
              <div
                class="error--feedback"
                v-if="loginFormStatus && !$v.loginForm.password.required"
              >
                <strong>Password is required.</strong>
              </div>
              <router-link to="/forgot-password" class="pull-right forgot_pswd">Forgot Password?</router-link>

              <button type="submit" :disabled="loginBtn" class="btn">Login</button>
              <br />
              <br />
            </div>
          </form>
          <span class="register" v-if="isLoggin" @click="toggleForm">
            Don't have an account.
            <b>Register</b>
          </span>
          <span class="register" v-else @click="toggleForm">
            Already a member.
            <b>Login</b>
          </span>
        </div>
        <footer>
          <span>Copyright &copy; {{ current_year }}. All right reserved.</span>
        </footer>
      </div>
      <div class="flexbox"></div>
    </div>
  </div>
</template>

<script>
import { url } from "@/shared/api";
import notify from "@/shared/toastr";
import { required, minLength, email, sameAs } from "vuelidate/lib/validators";
import { mapGetters, mapState } from 'vuex';
export default {
  data() {
    return {
      isLoggin: true,
      loginForm: {},
      registerForm: {},
      loginFormStatus: false,
      registerFormStatus: false,
      is_phone_validated: false,
      is_email_validated: false
    };
  },
  validations: {
    loginForm: {
      email: {
        required,
        email
      },
      password: {
        required
      }
    },
    registerForm: {
      email: {
        required,
        email
      },
      fullname: {
        required
      },
      phone: {
        required,
        minLength: minLength(10)
      },
      password: {
        required,
        minLength: minLength(6)
      },
      confirm_password: {
        required,
        minLength: minLength(6),
        equal: sameAs("password")
      }
    }
  },
  methods: {
    checkIfAuthenticated() {
      this.$store.commit("LOAD_FROM_LOCAL");
      if (this.token != null) {
        this.$router.push("/user-home");
      }
    },
    toggleForm() {
      this.isLoggin = !this.isLoggin;
    },
    login() {
      // Validate login form
      this.$v.loginForm.$touch();
      let formError = this.$v.loginForm.$error;
      if (formError) {
        this.loginFormStatus = true;
      } else {
        this.axios.post(`${url}/login`, this.loginForm, {
          headers: {
            "Content-Type": "application/json"
          }
        }).then(response => {
          if (response.status == 200) {
            this.$store.dispatch("setToken", response.data.token);
            this.$store.dispatch("setInfo", response.data.user);
            this.$router.push({ path: "/user-home" });
          } else {
            notify.error(response.data.message);
          }
        }).catch(error => {
          notify.error(error.message);
        });
      }
    },
    register() {
      // validate register form
      this.$v.registerForm.$touch();
      let formError = this.$v.registerForm.$error;
      if (formError) {
        this.registerFormStatus = true;
      } else {
        this.axios.post(`${url}/register`, this.registerForm, {
          headers: {
            'Content-Type': "application/json"
          }
        }).then(response => {
          if (response.status == 200) {
            this.$store.dispatch("setToken", response.data.token);
            this.$store.dispatch("setInfo", response.data.user);
            this.$router.push({ path: "/user-home" });
          } else {
            notify.error(response.data.message);
          }
        }).catch(error => {
          notify(error.message, errorType);
        });
      }
    },
    validateEmail() {
      this.axios
        .post(`${url}/validate/email`, this.registerForm, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          if (response.status == 200) {
            this.is_email_validated = response.data.is_taken;
          } else {
            notify.error(response.data.message);
          }
        })
        .catch(error => {
          notify.error(error.message);
        });
    },
    validatePhone() {
      this.axios
        .post(`${url}/validate/phone`, this.registerForm, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          if (response.status == 200) {
            this.is_phone_validated = response.data.is_taken;
          } else {
            notify.error(response.data.message);
          }
        })
        .catch(error => {
          notify.error(error.message);
        });
    }
  },
  computed: {
    current_year() {
      return new Date().getFullYear();
    },
    ...mapGetters([
      "token", "info"
    ])
  },
  beforeMount() {
    this.checkIfAuthenticated();
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Playfair+Display:400,900|Poppins:400,500");
* {
  margin: 0;
  padding: 0;
  text-decoration: none;
  box-sizing: border-box;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-text-size-adjust: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.main-wrapper {
  margin: 0;
  padding: 0;
}
.page-content {
  background: #f6f6f6;
  font-family: "Poppins", sans-serif;
  overflow-x: hidden;
  height: 100vh;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  flex-flow: row wrap;
  -ms-flex-flow: row wrap;
}

img {
  max-width: 100%;
}

.app {
  background-color: #fff;
  width: 400px;
  height: 80vh;
  margin: 2em auto;
  border-radius: 8px;
  padding: 1em;
  position: relative;
  overflow-y: auto;
  box-shadow: 0 6px 31px -2px rgba(0, 0, 0, 0.3);
}

a {
  text-decoration: none;
  color: #257aa6;
}
.forgot_pswd {
  margin-top: 8px;
  margin-bottom: 8px;
  color: #257aa6;
  outline: none;
}
.register {
  margin-top: 5px;
  margin-bottom: 5px;
  color: #257aa6;
  cursor: pointer;
}
p {
  font-size: 13px;
  color: #333;
  line-height: 2;
}
.light {
  text-align: right;
  color: #fff;
}
.light a {
  color: #fff;
}
.container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  text-align: center;
  padding: 2em;
}

header {
  width: 100px;
  height: 100px;
  margin: 1.8em auto;
  margin-bottom: 50px;
}

form input {
  width: 100%;
  padding: 13px 15px;
  margin: 0.5em auto;
  border-radius: 100px;
  border: 1px solid #257aa6;
  background: #f5f5f5;
  font-family: "Poppins", sans-serif;
  outline: none;
  color: #777;
}
input::placeholder {
  color: #777;
  font-size: 13px;
}

.inputs {
  margin-top: -4em;
}

.inputs .help-block {
  float: left;
}

footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1em;
  text-align: center;
}

footer span {
  font-weight: 500;
}

button {
  width: 100%;
  padding: 13px 15px;
  border-radius: 100px;
  border: none;
  background: #257aa6;
  font-family: "Poppins", sans-serif;
  outline: none;
  color: #fff;
  margin-bottom: 10px;
}
button:hover {
  background: #257aa6;
  border: 1px solid #257aa6;
  box-shadow: 0 6px 10px -2px rgba(0, 0, 0, 0.3);
  font-family: "Poppins", sans-serif;
  outline: none;
  color: #fff;
}
button:focus {
  outline: none !important;
  border: none !important;
  color: #fff;
}

@media screen and (max-width: 467px) {
  .app {
    width: 90%;
    height: 80vh;
    border-radius: 8px;
  }
  header {
    width: 80px;
    height: 80px;
    margin: 5px auto;
    margin-bottom: 30px;
  }
  .inputs {
    margin: 0;
  }
  input,
  button {
    padding: 18px 15px;
  }
}

.form-group--error {
  border-color: #a94442;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
}
.form-group--error:focus {
  border-color: #843534;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #ce8483;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #ce8483;
}
.error--feedback {
  color: #a94442;
  border-color: #a94442;
}
</style>
