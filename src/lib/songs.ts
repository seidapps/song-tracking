import { supabase } from "./supabase";
import { Song } from "@/types/database";
import {
  getYoutubeVideoId,
  getYoutubeThumbnail,
  getYoutubeVideoTitle,
} from "./youtube";

export const getSongs = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("Current user:", user); // Debug log

  if (!user) {
    console.log("No user found"); // Debug log
    return [];
  }

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  console.log("Songs data:", data); // Debug log
  console.log("Songs error:", error); // Debug log

  if (error) {
    console.error("Supabase error:", error); // Debug log
    throw error;
  }
  return data as Song[];
};

export const addSong = async (url: string) => {
  const videoId = getYoutubeVideoId(url);
  if (!videoId) throw new Error("Invalid YouTube URL");

  const title = await getYoutubeVideoTitle(videoId);
  const thumbnailUrl = getYoutubeThumbnail(videoId);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) throw new Error("User not authenticated");

  // Get the highest order number
  const { data: songs } = await supabase
    .from("songs")
    .select("order")
    .eq("user_id", user.id)
    .order("order", { ascending: false })
    .limit(1);

  const nextOrder = songs && songs.length > 0 ? (songs[0].order || 0) + 1 : 0;

  const { data, error } = await supabase
    .from("songs")
    .insert({
      user_id: user.id,
      title,
      video_id: videoId,
      thumbnail_url: thumbnailUrl,
      status: "in-progress",
      notes: "",
      order: nextOrder,
    })
    .select()
    .single();

  if (error) {
    console.error("Add song error:", error); // Debug log
    throw error;
  }
  return data as Song;
};

export const updateSongStatus = async (
  id: string,
  status: "in-progress" | "mastered",
) => {
  const { error } = await supabase
    .from("songs")
    .update({ status })
    .eq("id", id);

  if (error) throw error;
};

export const updateSongNotes = async (id: string, notes: string) => {
  const { error } = await supabase.from("songs").update({ notes }).eq("id", id);

  if (error) throw error;
};

export const deleteSong = async (id: string) => {
  const { error } = await supabase.from("songs").delete().eq("id", id);

  if (error) throw error;
};

export const updateSongOrder = async (
  songs: { id: string; order: number }[],
) => {
  const { error } = await supabase.from("songs").upsert(
    songs.map(({ id, order }) => ({
      id,
      order,
    })),
    { onConflict: "id" },
  );

  if (error) throw error;
};
