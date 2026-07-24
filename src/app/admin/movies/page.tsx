"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { useAppStore } from "@/lib/store";
import type { Movie } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/components/FileUpload";
import { Plus, Edit2, Trash2, Search } from "lucide-react";

export default function MoviesAdmin() {
  const { movies, addMovie, updateMovie, deleteMovie } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  const filteredMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const movieData = {
      title: fd.get("title") as string,
      director: fd.get("director") as string,
      durationMinutes: Number(fd.get("durationMinutes")),
      status: fd.get("status") as Movie["status"],
      language: fd.get("language") as string,
      ageRating: fd.get("ageRating") as string,
      releaseDate: fd.get("releaseDate") as string,
      posterUrl: fd.get("posterUrl") as string,
      backdropUrl: fd.get("backdropUrl") as string,
      trailerUrl: fd.get("trailerUrl") as string,
      synopsis: fd.get("synopsis") as string,
      genre: (fd.get("genre") as string).split(",").map((s) => s.trim()),
      cast: (fd.get("cast") as string).split(",").map((s) => s.trim()),
    };
    if (editingMovie) {
      await updateMovie(editingMovie.id, movieData);
      setEditingMovie(null);
    } else {
      await addMovie(movieData);
      setIsAddOpen(false);
    }
  };

  const MovieForm = ({ movie }: { movie?: Movie | null }) => (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input name="title" defaultValue={movie?.title} required />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <select name="status" defaultValue={movie?.status || "coming-soon"} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="now-showing">Now Showing</option>
            <option value="coming-soon">Coming Soon</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>Director</Label>
          <Input name="director" defaultValue={movie?.director} required />
        </div>
        <div className="space-y-2">
          <Label>Duration (mins)</Label>
          <Input name="durationMinutes" type="number" defaultValue={movie?.durationMinutes} required />
        </div>
        <div className="space-y-2">
          <Label>Language</Label>
          <Input name="language" defaultValue={movie?.language} required />
        </div>
        <div className="space-y-2">
          <Label>Age Rating</Label>
          <Input name="ageRating" defaultValue={movie?.ageRating} required />
        </div>
        <div className="space-y-2">
          <Label>Release Date</Label>
          <Input name="releaseDate" type="date" defaultValue={movie?.releaseDate} required />
        </div>
        <div className="space-y-2">
          <Label>Genre (comma separated)</Label>
          <Input name="genre" defaultValue={movie?.genre.join(", ")} required />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Cast (comma separated)</Label>
        <Input name="cast" defaultValue={movie?.cast.join(", ")} required />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Poster</Label>
          <FileUpload name="posterUrl" folder="movies" defaultValue={movie?.posterUrl} />
        </div>
        <div className="space-y-2">
          <Label>Backdrop</Label>
          <FileUpload name="backdropUrl" folder="movies" defaultValue={movie?.backdropUrl} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Trailer URL (YouTube)</Label>
        <Input name="trailerUrl" type="url" defaultValue={movie?.trailerUrl} required />
      </div>
      <div className="space-y-2">
        <Label>Synopsis</Label>
        <Textarea name="synopsis" defaultValue={movie?.synopsis} rows={3} required />
      </div>
      <DialogFooter>
        <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
        <Button type="submit">Save Movie</Button>
      </DialogFooter>
    </form>
  );

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Movies Management</h2>
          <p className="text-muted-foreground">Manage your cinema's movie catalog.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto"><Plus className="w-4 h-4 mr-2" /> Add Movie</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Add New Movie</DialogTitle></DialogHeader>
            <MovieForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border rounded-lg shadow-sm">
        <div className="p-4 border-b flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search movies..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
          </div>
        </div>

        <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Movie</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Release Date</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMovies.map((movie) => (
              <TableRow key={movie.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={movie.posterUrl} alt="" className="w-10 h-14 object-cover rounded shadow-sm" />
                    <div>
                      <div className="font-medium">{movie.title}</div>
                      <div className="text-xs text-muted-foreground">{movie.director}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={movie.status === "now-showing" ? "default" : movie.status === "coming-soon" ? "secondary" : "outline"}>
                    {movie.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(movie.releaseDate).toLocaleDateString()}</TableCell>
                <TableCell>{movie.durationMinutes}m</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog open={editingMovie?.id === movie.id} onOpenChange={(open) => !open && setEditingMovie(null)}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setEditingMovie(movie)}><Edit2 className="w-4 h-4" /></Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader><DialogTitle>Edit Movie: {movie.title}</DialogTitle></DialogHeader>
                        <MovieForm movie={movie} />
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => { if (window.confirm("Delete this movie?")) deleteMovie(movie.id); }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredMovies.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No movies found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
