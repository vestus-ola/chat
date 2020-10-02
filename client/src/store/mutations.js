const mutations = {
  SET_TOKEN(state, payload) {
    state.token = payload;
    localStorage.setItem("chat_token", payload);
    return state.token;
  },
  SET_INFO(state, payload) {
    state.info = payload;
    localStorage.setItem("user_info", JSON.stringify(payload));
    return state.info;
  },
  CLEAR_AUTH(state) {
    state.token = null;
    state.info = {};
    state.active_friend = {};
    state.active_group = {};
  },
  LOAD_FROM_LOCAL(state) {
    const storedState = localStorage.getItem("chat_token");
    const storedUser = localStorage.getItem("user_info");
    const selectedChatUser = localStorage.getItem("selected_user");
    const selectedGroup = localStorage.getItem("selected_group");
    if (storedState) {
      const token = storedState;
      const user = JSON.parse(storedUser);
      state.active_friend = JSON.parse(selectedChatUser);
      state.active_group = JSON.parse(selectedGroup);
      state.token = token;
      state.info = user;
    }
  },
  SET_ACTIVE_FRIEND(state, payload) {
    state.active_friend = payload;
    localStorage.setItem("selected_user", JSON.stringify(payload));
    return state.active_friend;
  },
  SET_ACTIVE_GROUP(state, payload) {
    state.active_group = payload;
    localStorage.setItem("selected_group", JSON.stringify(payload));
    return state.active_group;
  },
  SET_IS_COPY(state, payload) {
    return state.is_copy = payload;
  },
  SET_IS_PASTE(state, payload) {
    return state.is_paste = payload;
  },
  SET_CLIPBOARD(state, payload) {
    return state.clipboard = payload;
  }
};

export default mutations;