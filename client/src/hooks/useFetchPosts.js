import { useEffect, useState } from 'react';

export default function useFetchPosts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch('/api/posts');
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const json = await res.json();
        if (mounted) setData(json);
      } catch (e) {
        if (mounted) setError(e.message || 'Error');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, error };
}
