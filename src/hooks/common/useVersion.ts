import { useState, useEffect } from 'react';

export function useVersion() {
  const [version, setVersion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/version')
      .then((res) => {
        if (!res.ok) throw new Error('Error fetching version');
        return res.json();
      })
      .then((data) => {
        setVersion(data.version);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { version, loading, error };
}
