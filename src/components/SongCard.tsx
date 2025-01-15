import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Youtube,
  Edit3,
  CheckCircle,
  Clock,
  Loader2,
  Trash2,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { updateSongNotes } from "@/lib/songs";

interface SongCardProps {
  id: string;
  title?: string;
  thumbnailUrl?: string;
  videoId?: string;
  status?: "in-progress" | "mastered";
  notes?: string;
  onStatusChange?: (status: "in-progress" | "mastered") => void;
  onDelete?: () => void;
}

const SongCard = ({
  id,
  title = "Untitled Song",
  thumbnailUrl = "https://images.unsplash.com/photo-1510915361894-db8b60106cb1",
  videoId = "",
  status = "in-progress",
  notes = "",
  onStatusChange,
  onDelete,
}: SongCardProps) => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [practiceNotes, setPracticeNotes] = React.useState(notes);
  const [isSaving, setIsSaving] = React.useState(false);

  const saveTimeout = React.useRef<NodeJS.Timeout>();

  const handleNotesChange = (value: string) => {
    setPracticeNotes(value);
    setIsSaving(true);

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(async () => {
      try {
        await updateSongNotes(id, value);
      } catch (error) {
        console.error("Error saving notes:", error);
      } finally {
        setIsSaving(false);
      }
    }, 1000);
  };

  React.useEffect(() => {
    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
  }, []);

  return (
    <Card className="w-[340px] bg-zinc-900 text-white hover:shadow-lg transition-shadow border border-zinc-800">
      <CardHeader className="relative p-0">
        <div
          className="w-full h-[120px] bg-indigo-900/40 cursor-pointer flex items-center justify-center"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-center">
            <Youtube className="w-12 h-12 text-red-500" />
          </div>
        </div>
        <Badge
          variant="secondary"
          className={`absolute top-2 right-2 ${
            status === "mastered" ? "bg-green-500" : "bg-yellow-500"
          } text-white`}
        >
          {status === "mastered" ? (
            <CheckCircle className="w-4 h-4 mr-1" />
          ) : (
            <Clock className="w-4 h-4 mr-1" />
          )}
          {status === "mastered" ? "Mastered" : "In Progress"}
        </Badge>
      </CardHeader>

      <CardContent className="pt-4">
        <h3 className="font-semibold text-lg truncate">{title}</h3>

        {isExpanded && (
          <div className="mt-4">
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="mt-4 relative">
              <Textarea
                placeholder="Add your practice notes here..."
                value={practiceNotes}
                onChange={(e) => handleNotesChange(e.target.value)}
                className="min-h-[100px] bg-zinc-800 border-zinc-700"
              />
              {isSaving && (
                <div className="absolute top-2 right-2">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-zinc-800 text-white hover:text-white hover:bg-zinc-700 border-zinc-700"
            onClick={() =>
              onStatusChange?.(
                status === "mastered" ? "in-progress" : "mastered",
              )
            }
          >
            {status === "mastered" ? "Mark In Progress" : "Mark as Mastered"}
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Edit3 className="w-4 h-4 mr-2" />
          {isExpanded ? "Collapse" : "Expand"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SongCard;
