import React, { useEffect, useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import PostForm from './components/PostForm';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch('/api/posts');
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        if (mounted) setPosts(data);
      } catch (e) {
        if (mounted) setError(e.message || 'Error');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div role="alert">{error}</div>;
  return (
    <ul>
      {posts.map(p => (
        <li key={p._id}>
          <strong>{p.title}</strong>
          <div>{p.content}</div>
        </li>
      ))}
    </ul>
  );
}

function CreatePost() {
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function getToken() {
      try {
        const res = await fetch('/__test__/token?userId=ui-user');
        const json = await res.json();
        setToken(json.token);
      } catch (e) {
        // ignore
      }
    }
    getToken();
  }, []);

  return (
    <div>
      {message && <div role="status">{message}</div>}
      <PostForm
        token={token}
        onSuccess={() => setMessage('Post created successfully')}
      />
    </div>
  );
}

export default function App() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: 16 }}>
      <header style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <Link to="/">Posts</Link>
        <Link to="/create">Create</Link>
      </header>
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/create" element={<CreatePost />} />
      </Routes>
    </div>
  );
}
