const {
  createUser,
  getUser,
  removeUser,
  findRoom,
  usersInRoom,
} = require("../utils/users");

const socketHandler = (io, socket) => {
  if (getUser(socket.id)) removeUser(socket.id);

  socket.on("user:joinroom", (data) => {
    // fetch name and room from client
    const { name, room } = data;

    // check for existing rooms
    const roomExists = findRoom(room);

    // create new user - make admin if room does not exist
    const user = createUser(
      socket.id,
      name,
      room,
      roomExists === undefined ? true : false // make user admin if the room does not exists.
    );

    // add user into socket room
    socket.join(user.room);

    // broadcast user join message to room
    socket.to(user.room).emit("notification:toClient", {
      type: "notification",
      message: `${user.name} joined`,
    });

    // send updated number of users in the room.
    // to all clients in room1
    io.in(user.room).emit("roomData:toClient", {
      totalUsers: usersInRoom(user.room),
    });
  });

  socket.on("message:toServer", (data) => {
    const sender = getUser(socket.id);
    // if user is present in the connected users.
    if (sender) {
      // fetch message data
      const { user, message } = data.data;

      // broadcast message to connected users
      socket.to(sender.room).emit("message:toClient", {
        type: "message",
        time: Date.now(),
        user: user,
        message: message,
        received: true,
      });
    }
  });

  socket.on("disconnect", () => {
    const removedUser = removeUser(socket.id);

    socket.to(removedUser.room).emit("notification:toClient", {
      type: "notification",
      message: `${removedUser.name} left`,
    });
    socket.to(removedUser.room).emit("roomData:toClient", {
      totalUsers: usersInRoom(removedUser.room),
    });
  });
};

module.exports = { socketHandler };
