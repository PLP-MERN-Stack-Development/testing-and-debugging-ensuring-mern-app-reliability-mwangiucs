const { randomUUID } = require('crypto');

class User {
  constructor(doc) {
    this._id = doc._id || randomUUID();
    this.username = doc.username;
    this.email = doc.email;
    this.password = doc.password;
  }

  toObject() {
    return { _id: this._id, username: this.username, email: this.email, password: this.password };
  }

  static _store = new Map();

  static async create(doc) {
    const user = new User(doc);
    User._store.set(user._id.toString(), user);
    return user;
  }

  static async findById(id) {
    return User._store.get(id?.toString()) || null;
  }
}

module.exports = User;
