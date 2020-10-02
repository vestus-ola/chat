<template>
  <div class="fixed-bottom">
    <div class="input-rounded">
      <VueChatEmoji
        @click="insertToInputBox($event)"
        backgroundColor="#f5f5f5"
        radius="10"
        color="#000"
        icon="f118"
      ></VueChatEmoji>
      <textarea name="message" id="message" v-model="message" placeholder="Type message"></textarea>
      <span class="send-button" @click="sendMessage">
        <i class="icon-send fa fa-location-arrow" :style="`color: ${messageColor}`"></i>
      </span>
    </div>
  </div>
</template>

<script>
import { emojis } from "vue-chat-emoji";
export default {
  name: "Emoticon",
  components: {
    
  },
  data() {
    return {
      message: "",
      messageColor: "#000"
    };
  },
  methods: {
    insertToInputBox(args) {
      let value = this.message;
      this.message = value + "" + args.emoji + "";
    },
    sendMessage() {
      // var encoded = emojis.encodeEmoji(this.message);
      // var decoded = emojis.decodeEmoji(encoded);
      // console.log(encoded);
      // console.log(decoded);
      this.message = "";
    }
  },
  mounted() {

  },
  watch: {
    message() {
      if (this.message != "") {
        this.messageColor = "#257aa6";
        document.querySelector("#message").scrollTop = document.querySelector(
          "#message"
        ).scrollHeight;
      } else {
        this.messageColor = "#000";
      }
    }
  }
};
</script>

<style scoped>
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
</style>