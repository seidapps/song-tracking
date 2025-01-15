import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';

export function SongList() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      console.log('Starting to fetch songs...');
      try {
        // Get current user's ID
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Current user:', user?.id);

        const { data, error } = await supabase
          .from('songs')
          .select('*')
          .eq('user_id', user?.id);

        console.log('Query response:', { data, error });

        if (error) {
          console.error('Error fetching songs:', error);
          return;
        }

        setSongs(data || []);
      } catch (error) {
        console.error('Exception while fetching songs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  if (loading) return <div>Loading songs...</div>;
  if (songs.length === 0) return <div>No songs found matching your criteria</div>;

  return (
    <div>
      {songs.map((song) => (
        <div key={song.id}>{song.title}</div>
      ))}
    </div>
  );
} 