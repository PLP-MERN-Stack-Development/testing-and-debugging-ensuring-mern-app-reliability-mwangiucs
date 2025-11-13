const express = require('express');
const Post = require('./models/Post');
const { authMiddleware, generateToken } = require('./utils/auth');
const { requestLogger, notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
app.use(express.json());
app.use(requestLogger);

// Helpers
function paginateArray(arr, page = 1, limit = 10) {
  const p = Math.max(1, Number(page) || 1);
  const l = Math.max(1, Number(limit) || 10);
  const start = (p - 1) * l;
  return arr.slice(start, start + l);
}

// Routes
app.get('/', (req, res) => res.status(200).send('ok'));
app.post('/api/posts', authMiddleware, async (req, res) => {
  try {
    const { title, content, category } = req.body || {};
    if (!title || !content || !category) {
      return res.status(400).json({ error: 'Validation failed' });
    }
    const slug = (title || '').toLowerCase().replace(/\s+/g, '-');
    const post = await Post.create({
      title,
      content,
      author: req.user.id,
      category,
      slug,
    });
    return res.status(201).json(post.toObject());
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    const all = await Post.find(filter);
    const pageItems = paginateArray(all, page, limit);
    return res.status(200).json(pageItems);
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(post.toObject());
  } catch (e) {
    return res.status(404).json({ error: 'Not found' });
  }
});

app.put('/api/posts/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    if (post.author?.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    const { title, content } = req.body || {};
    if (title) post.title = title;
    if (content) post.content = content;
    await post.save();
    return res.status(200).json(post.toObject());
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/posts/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    if (post.author?.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    await post.deleteOne();
    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// Test-only endpoints (not in production)
if (process.env.NODE_ENV !== 'production') {
  app.post('/__test__/reset', (req, res) => {
    if (typeof Post._reset === 'function') Post._reset();
    return res.status(200).json({ ok: true });
  });

  app.get('/__test__/token', (req, res) => {
    const userId = req.query.userId || 'test-user';
    const token = generateToken({ _id: userId });
    return res.json({ token, userId });
  });
}

// Fallbacks
app.use(notFound);
app.use(errorHandler);

module.exports = app;
