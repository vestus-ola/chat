const getters = {
  token: state => {
    return state.token;
  },
  info: state => {
    return state.info;
  },
  active_friend: state => {
    return state.active_friend;
  },
  active_group: state => {
    return state.active_group;
  },
  is_copy: state => {
    return state.is_copy;
  },
  is_paste: state => {
    return state.is_paste;
  },
  clipboard: state => {
    return state.clipboard;
  }
};

export default getters;