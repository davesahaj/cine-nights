const users = [];
const rooms = new Map();

function createUser(socketID, name, room, isAdmin = false) {
  const user = { socketID, name, room, isAdmin };
  users.push(user);

  // increment room user count
  if (isAdmin) {
    rooms.set(room, 1);
  } else {
    rooms.set(room, rooms.get(room) + 1);
  }

  return user;
}

function getUser(socketID) {
  return users.find((user) => user.socketID === socketID);
}

function removeUser(socketID) {
  const index = users.findIndex((user) => user.socketID === socketID);

  if (index !== -1) {
    const user = users.splice(index, 1)[0];

    rooms.set(user.room, rooms.get(user.room) - 1);

    if (rooms.get(user.room) < 1) {
      rooms.delete(user.room);
    }

    return user;
  }

  return false;
}

function findRoom(roomID) {
  return users.find((user) => user.room === roomID);
}

function usersInRoom(roomID) {
  return rooms.get(roomID);
}

module.exports = {
  createUser,
  getUser,
  removeUser,
  users,
  findRoom,
  usersInRoom,
};
