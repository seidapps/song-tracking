import { supabase } from '../lib/supabase';

const fetchSongs = async () => {
  console.log('Starting to fetch songs...');
  try {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      // Add logging to see the response
      .then(result => {
        console.log('Query response:', result);
        return result;
      });

    if (error) {
      console.error('Error fetching songs:', error);
      return;
    }

    console.log('Songs fetched successfully:', data?.length || 0, 'songs');
  } catch (error) {
    console.error('Exception while fetching songs:', error);
  }
}; 