import toastr from "toastr";
require('toastr/build/toastr.min.css');

const notify = {
  success: function (msg) {
    toastr.success(msg);
  },
  error: function (msg) {
    return toastr.error(msg);
  },
  info: function (msg) {
    return toastr.info(msg);
  },
  warning: function (msg) {
    return toastr.warning(msg);
  },
  clear: function () {
    toastr.clear();
  }
};

export default notify;