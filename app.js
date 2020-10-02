let express = require('express');
let cors = require('cors');
let bodyParser = require("body-parser");
let app = express();
let helmet = require('helmet');
let http = require('http').createServer(app);

let socketIO = require("socket.io")(http);
let socket = require('./routes/sockets');
global.socketIO = socketIO;

socketIO.on("connect", socket);

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// routes
let apiRoutes = require("./routes");
app.use("/api/v1", apiRoutes);

// Set Port
let port = process.env.PORT || 3000;

//http.listen(port, "192.168.137.1", () => {
//  console.log(`Server running on port: ${port}`);
//});

http.listen(port, () => {
   console.log(`Server running on port: ${port}`);
});