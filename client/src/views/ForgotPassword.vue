<template>
  <div class="main-wrapper">
    <div class="page-content">
      <div class="app">
        <div class="container">
          <form
            action
            method="POST"
            @submit.prevent="sendForgotPasswordCode"
            v-if="!hasToken && !resetFormActivated"
          >
            <header>
              <img src="@/assets/logo.png" />
            </header>
            <div class="inputs">
              <input
                type="email"
                name="email"
                id="email"
                placeholder="johndoe@example.com"
                v-model="sendTokenForm.email"
                :class="{ 'form-group--error': $v.sendTokenForm.email.$error }"
              />
              <div
                class="error--feedback"
                v-if="sendTokenFormStatus && !$v.sendTokenForm.email.required"
              >
                <strong>Email is required.</strong>
              </div>
              <div
                class="error--feedback"
                v-if="sendTokenFormStatus && !$v.sendTokenForm.email.email"
              >
                <strong>Email entered is invalid.</strong>
              </div>

              <button type="submit" class="btn">Send Reset Code</button>
              <br />
            </div>
          </form>

          <form
            v-if="hasToken && !resetFormActivated"
            method="POST"
            @submit.prevent="verifyPasswordCode"
          >
            <header>
              <img src="@/assets/logo.png" />
            </header>
            <div class="inputs">
              <input
                type="number"
                name="code"
                id="code"
                placeholder="Enter verification code"
                v-model="verifyTokenForm.code"
                :class="{ 'form-group--error': $v.verifyTokenForm.code.$error }"
              />
              <div
                class="error--feedback"
                v-if="verifyTokenFormStatus && !$v.verifyTokenForm.code.required"
              >
                <strong>Verification code is required.</strong>
              </div>
              <button type="submit" class="btn">Continue</button>
              <br />
            </div>
          </form>

          <form v-if="resetFormActivated" method="POST" @submit.prevent="resetPasswordByCode">
            <header>
              <img src="@/assets/logo.png" />
            </header>
            <div class="inputs">
              <input
                type="password"
                name="password"
                id="password"
                v-model.trim="resetPasswordForm.password"
                placeholder="Enter new password"
                :class="{ 'form-group--error': $v.resetPasswordForm.password.$error }"
              />

              <div
                class="error--feedback"
                v-if="resetPasswordFormStatus && !$v.resetPasswordForm.password.required"
              >
                <strong>Password is required.</strong>
              </div>
              <div
                class="error--feedback"
                v-if="resetPasswordFormStatus && !$v.resetPasswordForm.password.minLength"
              >
                <strong>Password cannot be less than {{ $v.resetPasswordForm.password.$params.minLength.min }}.</strong>
              </div>

              <input
                type="password"
                name="confirm_password"
                v-model.trim="resetPasswordForm.confirmPassword"
                id="confirm_password"
                placeholder="Confirm new password"
                :class="{ 'form-group--error': $v.resetPasswordForm.confirmPassword.$error }"
              />

              <div
                class="error--feedback"
                v-if="resetPasswordFormStatus && !$v.resetPasswordForm.confirmPassword.required"
              >
                <strong>Confirm Password is required.</strong>
              </div>
              <div
                class="error--feedback"
                v-if="resetPasswordFormStatus && !$v.resetPasswordForm.confirmPassword.minLength"
              >
                <strong>Confirm Password cannot be less than {{ $v.resetPasswordForm.confirmPassword.$params.minLength.min }}.</strong>
              </div>
              <div
                class="error--feedback"
                v-if="resetPasswordFormStatus && !$v.resetPasswordForm.confirmPassword.equal"
              >
                <strong>Passwords does not match.</strong>
              </div>

              <button type="submit" class="btn">Reset Password</button>
              <br />
            </div>
          </form>

          <router-link
            to="/"
            accent
            class="register"
            v-if="!hasToken && !resetFormActivated"
            @click="toggleForm"
          >Back to Login</router-link>
        </div>
        <footer>
          <span>Copyright &copy; {{ current_year }}. All right reserved.</span>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import { required, minLength, email, sameAs } from "vuelidate/lib/validators";
import { url } from "@/shared/api";
import notify from "@/shared/toastr";
export default {
  data() {
    return {
      hasToken: false,
      resetFormActivated: false,
      code: null,
      sendTokenForm: {},
      verifyTokenForm: {},
      verifyTokenFormStatus: false,
      sendTokenFormStatus: false,
      resetPasswordForm: {},
      resetPasswordFormStatus: false
    };
  },
  validations: {
    sendTokenForm: {
      email: {
        required,
        email
      }
    },
    verifyTokenForm: {
      code: {
        required
      }
    },
    resetPasswordForm: {
      password: {
        required,
        minLength: minLength(6)
      },
      confirmPassword: {
        required,
        minLength: minLength(6),
        equal: sameAs("password")
      }
    }
  },
  methods: {
    toggleForm() {
      this.isLoggin = !this.isLoggin;
      console.log(this.isLoggin);
    },
    sendForgotPasswordCode() {
      // Validate send reset token form
      this.$v.sendTokenForm.$touch();
      let formError = this.$v.sendTokenForm.$error;
      if (formError) {
        this.sendTokenFormStatus = true;
      } else {
        this.axios
          .post(`${url}/forgot_password`, this.sendTokenForm, {
            headers: {
              "Content-Type": "application/json"
            }
          })
          .then(response => {
            if (response.status == 200) {
              this.hasToken = true;
            } else {
              notify.error(response.data.message);
              this.hasToken = false;
            }
          })
          .catch(error => {
            notify.error(error.message);
            this.hasToken = false;
          });
      }
    },
    verifyPasswordCode() {
      // Validate verify password form
      this.$v.verifyTokenForm.$touch();
      let formError = this.$v.verifyTokenForm.$error;
      if (formError) {
        this.verifyTokenFormStatus = true;
      } else {
        this.axios
          .post(`${url}/forgot_password/verify`, this.verifyTokenForm, {
            headers: {
              "Content-Type": "application/json"
            }
          })
          .then(response => {
            if (response.status == 200) {
              this.code = this.verifyTokenForm.code;
              this.resetFormActivated = true;
              this.hasToken = false;
            } else {
              notify.error(response.data.message);
            }
          })
          .catch(error => {
            notify.error(error.message);
          });
      }
    },
    resetPasswordByCode() {
      // Validate reset password form
      this.$v.resetPasswordForm.$touch();
      let formError = this.$v.resetPasswordForm.$error;
      if (formError) {
        this.resetPasswordFormStatus = true;
      } else {
        this.resetPasswordForm.code = this.code;
        this.axios
          .put(`${url}/change_password/password`, this.resetPasswordForm, {
            headers: {
              "Content-Type": "application/json"
            }
          })
          .then(response => {
            if (response.status == 202) {
              this.$router.push("/");
            } else {
              notify.error(response.data.message);
            }
          })
          .catch(error => {
            notify.error(error.message);
          });
      }
    }
  },
  mounted() {},
  computed: {
    current_year() {
      return new Date().getFullYear();
    }
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
  margin: auto;
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
  height: 70%;
  margin: 2em auto;
  border-radius: 5px;
  padding: 1em;
  position: relative;
  overflow: hidden;
  box-shadow: 0 6px 31px -2px rgba(0, 0, 0, 0.3);
}

a {
  text-decoration: none;
  color: #257aa6;
}
.forgot_pswd {
  margin-top: 3px;
  margin-bottom: 3px;
  color: #257aa6;
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
  margin-bottom: 20px;
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
    height: 70%;
    border-radius: 6;
  }
  header {
    width: 80px;
    height: 80px;
    margin: 10px auto;
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
