import React, { useState } from 'react';

function PostForm({ onSuccess, token }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!title || !content || !category) {
      setError('All fields are required');
      return;
    }
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ title, content, category }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to submit');
      }
      const data = await res.json();
      if (typeof onSuccess === 'function') onSuccess(data);
      setTitle('');
      setContent('');
      setCategory('');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-label="post-form">
      {error && <div role="alert">{error}</div>}
      <input
        aria-label="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        aria-label="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input
        aria-label="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export default PostForm;
