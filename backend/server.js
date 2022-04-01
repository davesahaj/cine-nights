const dotenv = require("dotenv").config({ path: "backend/config/.env" });
const app = require("./app");
const { colorTheme } = require("./ColorTheme");
const colors = require("colors").setTheme(colorTheme);

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  // pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

const { socketHandler } = require("./sockets/socketHandler");

io.on("connection", (socket) => socketHandler(io, socket));

server.listen(process.env.PORT, () => {
  console.clear();
  console.log(
    `server has been started on port ${process.env.PORT}`.underline.info
  );
});
