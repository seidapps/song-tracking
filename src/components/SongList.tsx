import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';

export function SongList() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      if (session?.user) {
        setUserInfo(session.user);
        fetchSongs(session.user.id);
      }
    });

    // Initial check for session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserInfo(session.user);
        fetchSongs(session.user.id);
      } else {
        setLoading(false);
      }
    };
    
    checkSession();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchSongs = async (userId: string) => {
    console.log('Fetching songs for user:', userId);
    try {
      const { data, error: songError } = await supabase
        .from('songs')
        .select('*')
        .eq('user_id', userId);

      console.log('Songs query result:', { data, error: songError });

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

  if (loading) return <div>Loading songs...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!userInfo) return <div>Please sign in to view songs</div>;
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