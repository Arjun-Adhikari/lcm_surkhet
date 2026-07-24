"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { useAppStore } from "@/lib/store";
import type { Showtime } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default function ShowtimesAdmin() {
  const { showtimes, movies, addShowtime, updateShowtime, deleteShowtime } = useAppStore();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState<Showtime | null>(null);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const showtimeData = {
      movieId: fd.get("movieId") as string,
      date: fd.get("date") as string,
      time: fd.get("time") as string,
      screen: fd.get("screen") as string,
      price: Number(fd.get("price")),
      ticketPrices: [
        { type: "General", price: Number(fd.get("generalPrice")) },
        { type: "Student", price: Number(fd.get("studentPrice")) },
        { type: "Child", price: Number(fd.get("childPrice")) },
      ].filter((t) => t.price > 0),
      availableSeats: Number(fd.get("availableSeats")),
    };
    if (editingShowtime) {
      await updateShowtime(editingShowtime.id, showtimeData);
      setEditingShowtime(null);
    } else {
      await addShowtime(showtimeData);
      setIsAddOpen(false);
    }
  };

  const sortedShowtimes = [...showtimes].sort((a, b) => {
    return new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime();
  });

  const ShowtimeForm = ({ showtime }: { showtime?: Showtime | null }) => (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="space-y-2">
        <Label>Movie</Label>
        <select name="movieId" defaultValue={showtime?.movieId || movies[0]?.id} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
          {movies.filter((m) => m.status !== "archived").map((m) => (
            <option key={m.id} value={m.id}>{m.title}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Date</Label><Input name="date" type="date" defaultValue={showtime?.date} required /></div>
        <div className="space-y-2"><Label>Time</Label><Input name="time" type="time" defaultValue={showtime?.time} required /></div>
        <div className="space-y-2">
          <Label>Screen</Label>
          <select name="screen" defaultValue={showtime?.screen || "Screen 1"} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="Screen 1">Screen 1</option>
            <option value="Screen 2">Screen 2</option>
            <option value="Screen 3">Screen 3</option>
          </select>
        </div>
        <div className="space-y-2"><Label>Base Price (Rs.)</Label><Input name="price" type="number" defaultValue={showtime?.price || 300} required /></div>
        <div className="space-y-2"><Label>Total Seats</Label><Input name="availableSeats" type="number" defaultValue={showtime?.availableSeats || 150} required /></div>
      </div>
      <div className="space-y-3 rounded-lg border bg-muted/20 p-4">
        <Label className="text-base">Ticket Prices</Label>
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-2"><Label>General (Rs.)</Label><Input name="generalPrice" type="number" min="0" defaultValue={showtime?.ticketPrices?.find((t) => t.type === "General")?.price || 300} /></div>
          <div className="space-y-2"><Label>Student (Rs.)</Label><Input name="studentPrice" type="number" min="0" defaultValue={showtime?.ticketPrices?.find((t) => t.type === "Student")?.price || 250} /></div>
          <div className="space-y-2"><Label>Child (Rs.)</Label><Input name="childPrice" type="number" min="0" defaultValue={showtime?.ticketPrices?.find((t) => t.type === "Child")?.price || 200} /></div>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
        <Button type="submit">Save Showtime</Button>
      </DialogFooter>
    </form>
  );

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Showtimes Management</h2>
          <p className="text-muted-foreground">Schedule movie screenings across screens.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> Add Showtime</Button></DialogTrigger>
          <DialogContent><DialogHeader><DialogTitle>Add New Showtime</DialogTitle></DialogHeader><ShowtimeForm /></DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Movie</TableHead>
              <TableHead>Screen</TableHead>
              <TableHead>Ticket Prices</TableHead>
              <TableHead>Seats</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedShowtimes.map((showtime) => {
              const movie = movies.find((m) => m.id === showtime.movieId);
              return (
                <TableRow key={showtime.id}>
                  <TableCell>
                    <div className="font-medium">{new Date(showtime.date).toLocaleDateString()}</div>
                    <div className="text-xs text-muted-foreground">{showtime.time}</div>
                  </TableCell>
                  <TableCell>{movie?.title ?? <span className="text-muted-foreground italic">Unknown</span>}</TableCell>
                  <TableCell>{showtime.screen}</TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      {(showtime.ticketPrices || [{ type: "General", price: showtime.price }]).map((t) => (
                        <div key={t.type} className="text-xs"><span className="text-muted-foreground">{t.type}:</span> Rs. {t.price}</div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{showtime.availableSeats}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog open={editingShowtime?.id === showtime.id} onOpenChange={(open) => !open && setEditingShowtime(null)}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setEditingShowtime(showtime)}><Edit2 className="w-4 h-4" /></Button>
                        </DialogTrigger>
                        <DialogContent><DialogHeader><DialogTitle>Edit Showtime</DialogTitle></DialogHeader><ShowtimeForm showtime={showtime} /></DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => { if (window.confirm("Delete this showtime?")) deleteShowtime(showtime.id); }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {sortedShowtimes.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No showtimes scheduled.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
