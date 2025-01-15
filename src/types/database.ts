export interface Song {
  id: string;
  user_id: string;
  title: string;
  video_id: string;
  thumbnail_url: string;
  status: "in-progress" | "mastered";
  notes: string;
  created_at: string;
  order: number;
}
