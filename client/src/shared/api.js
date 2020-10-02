let NODE_ENV = process.env.NODE_ENV;
let api;

if (NODE_ENV == "development") {
  api = {
    url: `http://192.168.137.1:3000/api/v1`
  };
} else {
  api = {
    url: `http://testler.com/api/v1`
  };
}

module.exports = api;