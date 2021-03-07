const { userJoinedRoomEvent } = require("./events/emitters");

class ManagerBase {
  constructor() {
    return this.createInstance.call(this, arguments);
  }

  getInstance() {
    return this.instance;
  }

  initInstance(constructorArgs) {}

  createInstance() {
    if (this.instance && this.instance instanceof this) {
      return this.getInstance();
    } else {
      this.initInstance.call(this, arguments);
      this.instance = this;
    }
  }
}

module.exports = ManagerBase;

class UserManager extends ManagerBase {
  constructor(ioInstance) {
    return super(ioInstance);
  }
  /**
   * Store a user data against the userId
   * @param {String} User ID of the socket a client connected with;
   * @param {Object} userData Data of the user as in the Database
   */
  addUser(userId, socket) {
    this.usersMap.set(userId, socket);
    return this.getUser(userId);
  }

  /**
   * Removes a user from the user map
   * @param socketId {String} SocketId of the user
   */
  removeUser(userId = "") {
    this.usersMap.delete(userId);
  }

  getUser(userId = "") {
    return this.usersMap.get(userId);
  }

  getUsers() {
    return this.usersMap.entries();
  }

  /**
   * Returns the socket instance
   */
  getIOInstance() {
    return this.ioInstance;
  }
  setIOInstance(ioInstance) {
    this.ioInstance = ioInstance;
  }

  initInstance(ioInstance) {
    super.initInstance(ioInstance);
    this.usersMap = new Map();
    this.ioInstance = ioInstance;
  }

  // Join Chat Rooms And Conversations the user is a particapant of
  async joinChatRooms(userId, userSocket) {
    for (let i = 0; i < combinedConvo.length; i++) {
      const convo = combinedConvo[i];
      // Join Chat rooms by ID
      userSocket.join(convo._id);
      userJoinedRoomEvent(this.io, userSocket, userSocket.user);
    }
  }
}

module.exports = new UserManager();
