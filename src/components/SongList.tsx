import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';

export function SongList() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const getUserInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserInfo(user);
    };
    getUserInfo();
  }, []);

  useEffect(() => {
    const fetchSongs = async () => {
      console.log('Starting to fetch songs...');
      try {
        // Check if we're connected to Supabase
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Auth check:', { user });

        if (!user) {
          console.log('No user found');
          setError('No authenticated user');
          return;
        }

        // Try to fetch songs
        const { data, error: songError } = await supabase
          .from('songs')
          .select('*')
          .eq('user_id', user.id);

        console.log('Songs query:', { data, error: songError });

        if (songError) {
          console.error('Error fetching songs:', songError);
          setError(songError.message);
          return;
        }

        setSongs(data || []);
      } catch (err) {
        console.error('Exception:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  if (loading) return <div>Loading songs...</div>;
  if (error) return <div>Error: {error}</div>;
  if (songs.length === 0) return <div>No songs found for current user</div>;

  return (
    <div>
      <pre>{JSON.stringify({ userInfo }, null, 2)}</pre>
      {songs.map((song) => (
        <div key={song.id}>{song.title}</div>
      ))}
    </div>
  );
} 