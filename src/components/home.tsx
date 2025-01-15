import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import SongGrid from "./SongGrid";
import AddSongDialog from "./AddSongDialog";
import { Button } from "@/components/ui/button";
import { signInWithGoogle, signOut, getCurrentUser } from "@/lib/auth";
import {
  getSongs,
  addSong,
  updateSongStatus,
  deleteSong,
  updateSongOrder,
} from "@/lib/songs";
import { supabase } from "@/lib/supabase";
import type { Song } from "@/types/database";

const Home = () => {
  const navigate = useNavigate();
  const [isAddSongDialogOpen, setIsAddSongDialogOpen] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  const [songs, setSongs] = React.useState<Song[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const initialized = React.useRef(false);

  const loadSongs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSongs();
      console.log("Loaded songs:", data);
      setSongs(data || []);
    } catch (error) {
      console.error("Error loading songs:", error);
      setError("Failed to load songs");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initializeAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        console.log("Current user:", currentUser);
        if (currentUser) {
          setUser(currentUser);
          await loadSongs();
        }
      } catch (error) {
        console.error("Auth error:", error);
        setError("Authentication failed");
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user);
      if (event === "SIGNED_IN") {
        setUser(session?.user);
        await loadSongs();
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setSongs([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAddSong = async (url: string) => {
    try {
      const song = await addSong(url);
      setSongs((prev) => [song, ...prev]);
    } catch (error) {
      console.error("Error adding song:", error);
    }
  };

  const handleStatusChange = async (
    songId: string,
    status: "in-progress" | "mastered",
  ) => {
    try {
      await updateSongStatus(songId, status);
      setSongs((prev) =>
        prev.map((song) => (song.id === songId ? { ...song, status } : song)),
      );
    } catch (error) {
      console.error("Error updating song status:", error);
    }
  };

  const handleDeleteSong = async (songId: string) => {
    try {
      await deleteSong(songId);
      setSongs((prev) => prev.filter((song) => song.id !== songId));
    } catch (error) {
      console.error("Error deleting song:", error);
    }
  };

  const handleReorder = async (reorderedSongs: Song[]) => {
    try {
      setSongs(reorderedSongs);
      await updateSongOrder(
        reorderedSongs.map((song, index) => ({
          id: song.id,
          order: index,
        })),
      );
    } catch (error) {
      console.error("Error updating song order:", error);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Error signing in:", error);
      setError("Failed to sign in");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            Song Learning Tracker
          </h1>
          <p className="text-gray-400 mb-8">Please log in to continue</p>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <Button
            onClick={handleLogin}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Sign in with Google
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <DashboardHeader
        userName={user.user_metadata?.full_name || "User"}
        userEmail={user.email}
        userAvatar={user.user_metadata?.avatar_url}
        onAddSong={() => setIsAddSongDialogOpen(true)}
        onLogout={handleLogout}
      />

      <main className="py-6">
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <Button
              onClick={loadSongs}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white"
            >
              Retry
            </Button>
          </div>
        ) : (
          <SongGrid
            songs={songs}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteSong}
            onReorder={handleReorder}
            loading={loading}
          />
        )}
      </main>

      <AddSongDialog
        open={isAddSongDialogOpen}
        onOpenChange={setIsAddSongDialogOpen}
        onSubmit={handleAddSong}
      />
    </div>
  );
};

export default Home;
