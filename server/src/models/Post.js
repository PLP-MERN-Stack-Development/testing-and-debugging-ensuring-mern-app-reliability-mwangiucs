const { randomUUID } = require('crypto');

class Post {
  constructor(doc) {
    this._id = doc._id || randomUUID();
    this.title = doc.title;
    this.content = doc.content;
    this.author = doc.author?.toString();
    this.category = doc.category?.toString();
    this.slug = doc.slug;
  }

  toObject() {
    return {
      _id: this._id.toString(),
      title: this.title,
      content: this.content,
      author: this.author?.toString(),
      category: this.category?.toString(),
      slug: this.slug,
    };
  }

  static _store = new Map();

  static async create(doc) {
    const post = new Post(doc);
    Post._store.set(post._id.toString(), post);
    return post;
  }

  static async insertMany(arr) {
    const created = [];
    for (const doc of arr) {
      created.push(await Post.create(doc));
    }
    return created;
  }

  static async findById(id) {
    const p = Post._store.get(id?.toString());
    return p ? new Post(p) : null;
  }

  static async find(filter = {}) {
    const all = Array.from(Post._store.values()).map((p) => p.toObject());
    return all.filter((p) => {
      for (const key of Object.keys(filter)) {
        if (p[key]?.toString() !== filter[key]?.toString()) return false;
      }
      return true;
    });
  }

  async save() {
    Post._store.set(this._id.toString(), this);
    return this;
  }

  async deleteOne() {
    Post._store.delete(this._id.toString());
  }

  static _reset() {
    Post._store.clear();
  }
}

module.exports = Post;
