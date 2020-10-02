const actions = {
  setToken({ commit }, payload) {
    commit('SET_TOKEN', payload);
  },
  setInfo({ commit }, payload) {
    commit('SET_INFO', payload);
  },
  clearAuth({ commit }) {
    commit('CLEAR_AUTH');
    localStorage.removeItem("chat_token");
    localStorage.removeItem("user_info");
  },
  setActiveFriend({ commit}, payload) {
    commit("SET_ACTIVE_FRIEND", payload);
  },
  setActiveGroup({ commit}, payload) {
    commit("SET_ACTIVE_GROUP", payload);
  },
  setIsCopy({ commit }, payload) {
    commit("SET_IS_COPY", payload);
  },
  setIsPaste({ commit }, payload) {
    commit("SET_IS_PASTE", payload);
  },
  setClipboard({ commit }, payload) {
    commit("SET_CLIPBOARD", payload);
  }
};

export default actions;