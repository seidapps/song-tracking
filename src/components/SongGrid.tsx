import React, { useEffect } from "react";
import SongCard from "./SongCard";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Song } from "@/types/database";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { supabase } from "@/lib/supabase";

interface SongGridProps {
  songs?: Song[];
  loading?: boolean;
  onStatusChange?: (songId: string, status: "in-progress" | "mastered") => void;
  onDelete?: (songId: string) => void;
  onReorder?: (songs: Song[]) => void;
}

const SongGrid = ({
  songs = [],
  loading = false,
  onStatusChange,
  onDelete,
  onReorder,
}: SongGridProps) => {
  const [filter, setFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<
    "all" | "in-progress" | "mastered"
  >("all");

  useEffect(() => {
    console.log("SongGrid received songs:", songs.length);
    console.log("Loading state:", loading);
  }, [songs, loading]);

  const filteredSongs = songs.filter((song) => {
    console.log("Filtering song:", song.title);
    const matchesSearch = song.title
      .toLowerCase()
      .includes(filter.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || song.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(filteredSongs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the order property for all songs
    const updatedSongs = items.map((song, index) => ({
      ...song,
      order: index,
    }));

    onReorder?.(updatedSongs);
  };

  return (
    <div className="w-full min-h-screen bg-zinc-950">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              className="pl-10 bg-zinc-900 border-zinc-800"
              placeholder="Search songs..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              onClick={() => setStatusFilter("all")}
              className="text-white hover:text-white"
            >
              All
            </Button>
            <Button
              variant={statusFilter === "in-progress" ? "default" : "outline"}
              onClick={() => setStatusFilter("in-progress")}
              className="text-white hover:text-white"
            >
              In Progress
            </Button>
            <Button
              variant={statusFilter === "mastered" ? "default" : "outline"}
              onClick={() => setStatusFilter("mastered")}
              className="text-white hover:text-white"
            >
              Mastered
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading songs...</p>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="songs" direction="horizontal">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center"
                >
                  {filteredSongs.map((song, index) => (
                    <Draggable
                      key={song.id}
                      draggableId={song.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="relative"
                        >
                          <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm font-medium text-white z-10">
                            {filteredSongs.length - index}
                          </div>
                          <SongCard
                            id={song.id}
                            title={song.title}
                            thumbnailUrl={song.thumbnail_url}
                            videoId={song.video_id}
                            status={song.status}
                            notes={song.notes}
                            onStatusChange={(newStatus) =>
                              onStatusChange?.(song.id, newStatus)
                            }
                            onDelete={() => onDelete?.(song.id)}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}

        {filteredSongs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">
              No songs found matching your criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongGrid;
