<template>
  <div class="main-wrapper">
    <div class="actionbar">
      <div class="back" @click="goBack">
        <i class="fa fa-arrow-left"></i>
      </div>
      <div class="name">
        <span>New Group</span>
      </div>
    </div>

    <div class="container">
      <div class="input-container">
        <form method="POST" @submit.prevent="addNewGroup">
          <div
            class="input-rounded"
            :class="{ 'form-group--error': $v.addNewGroupForm.group_name.$error }"
          >
            <input
              name="group_name"
              id="group_name"
              v-model="addNewGroupForm.group_name"
              placeholder="Enter Group Name"
            />
            <button type="submit" class="send-button" style="margin: -8px 3px;">
              <i class="material-icons" style="font-size: 36px;">add</i>
            </button>
          </div>
          <span
            class="error--feedback"
            v-if="addNewGroupFormStatus && !$v.addNewGroupForm.group_name.required"
          >
            <strong>Group Name is required.</strong>
          </span>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { url } from "@/shared/api";
import { emojis } from "vue-chat-emoji";
import { mapGetters } from "vuex";
import { required, minLength } from "vuelidate/lib/validators";
import Loader from "@/components/Loader";
export default {
  data() {
    return {
      items: [],
      addNewGroupForm: {},
      addNewGroupFormStatus: false
    };
  },
  validations: {
    addNewGroupForm: {
      group_name: {
        required
      }
    }
  },
  methods: {
    checkIfAuthenticated() {
      this.$store.commit("LOAD_FROM_LOCAL");
      if (this.token == null) {
        this.$router.push("/");
      }
    },
    sendMessage() {
      this.message = "";
    },
    tempData() {
      this.items = [];
    },
    goBack() {
      this.$router.back();
    },
    addNewGroup() {
      // Validate verify password form
      this.$v.addNewGroupForm.$touch();
      let formError = this.$v.addNewGroupForm.$error;
      if (formError) {
        this.addNewGroupFormStatus = true;
      } else {
        this.axios
          .post(`${url}/group/create`, this.addNewGroupForm, {
            headers: {
              "Content-Type": "application/json",
              Authorization: this.token
            }
          })
          .then(response => {
            if (response.status == 200) {
              this.$router.push({
                name: "user-group-list-page"
              });
            } else {
              console.log(response.data.message);
            }
          })
          .catch(error => {
            console.log(error.message);
          });
      }
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
  overflow-x: hidden;
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
.input-container {
  width: 100vw;
  padding-top: 10px;
  margin-bottom: 5px;
  overflow: hidden;
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
  padding: 6px 10px;
  margin-bottom: 10px;
}
input,
input:focus {
  outline: none;
  border: none;
  border-top: none;
  resize: none;
  overflow-y: auto;
}
input#group_name {
  flex-grow: 2;
  border: none;
  outline: none;
  padding: 2px 20px;
}
input#group_name::placeholder {
  color: #777;
  font-size: 18px;
}
input#group_name:focus {
  outline: none;
  border: none;
}
button.send-button {
  outline: none;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  background: transparent;
}
.form-group--error {
  border-color: #a94442;
}
.form-group--error:focus {
  border-color: #843534;
}
.error--feedback {
  color: #a94442;
  border-color: #a94442;
}
@media only screen and (max-width: 450px) {
  .main-wrapper {
    position: fixed;
  }
  .actionbar .name {
    margin-left: 35%;
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
    width: 94vw;
  }
}
</style>