// db.test.js - Demonstrate database operations with a test database (mongodb-memory-server-core)
// This test is skipped on Node >= 22 or Windows due to upstream compatibility issues.

const major = parseInt(process.versions.node.split('.')[0], 10);
const skip = major >= 22 || process.platform === 'win32';

(skip ? describe.skip : describe)('DB integration with mongodb-memory-server-core', () => {
  let mongoose;
  let MongoMemoryServer;
  let mongo;
  let Item;

  beforeAll(async () => {
    // Defer requires so they are not evaluated if suite is skipped
    mongoose = require('mongoose');
    ({ MongoMemoryServer } = require('mongodb-memory-server-core'));

    const itemSchema = new mongoose.Schema({
      name: { type: String, required: true },
      value: { type: Number, required: true },
    });

    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri);
    Item = mongoose.model('Item', itemSchema);
  });

  afterAll(async () => {
    if (mongoose) await mongoose.disconnect();
    if (mongo) await mongo.stop();
  });

  it('performs CRUD operations against test DB', async () => {
    // Create
    const created = await Item.create({ name: 'foo', value: 1 });
    expect(created._id).toBeDefined();

    // Read
    const found = await Item.findById(created._id).lean();
    expect(found.name).toBe('foo');
    expect(found.value).toBe(1);

    // Update
    await Item.updateOne({ _id: created._id }, { $set: { value: 2 } });
    const updated = await Item.findById(created._id).lean();
    expect(updated.value).toBe(2);

    // Delete
    await Item.deleteOne({ _id: created._id });
    const shouldBeNull = await Item.findById(created._id).lean();
    expect(shouldBeNull).toBeNull();
  });
});
