"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { useAppStore, useEvents } from "@/lib/store";
import type { Event } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/components/FileUpload";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";

export default function EventsAdmin() {
  const { data: events = [] } = useEvents();
  const { addEvent, updateEvent, deleteEvent } = useAppStore();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [confirm, setConfirm] = useState<{ title: string; description: string; onConfirm: () => void } | null>(null);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const eventData = {
      title: fd.get("title") as string,
      date: fd.get("date") as string,
      time: fd.get("time") as string,
      status: fd.get("status") as Event["status"],
      imageUrl: fd.get("imageUrl") as string,
      description: fd.get("description") as string,
    };
    if (editingEvent) {
      setConfirm({
        title: "Update Event",
        description: "Save changes to this event?",
        onConfirm: async () => {
          await updateEvent(editingEvent.id, eventData);
          setEditingEvent(null);
          toast.success("Event updated");
        },
      });
    } else {
      setConfirm({
        title: "Add Event",
        description: "Add this new event?",
        onConfirm: async () => {
          await addEvent(eventData);
          setIsAddOpen(false);
          toast.success("Event added");
        },
      });
    }
  };

  const EventForm = ({ event }: { event?: Event | null }) => (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="space-y-2"><Label>Title</Label><Input name="title" defaultValue={event?.title} required /></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Date</Label><Input name="date" type="date" defaultValue={event?.date} required /></div>
        <div className="space-y-2"><Label>Time</Label><Input name="time" type="time" defaultValue={event?.time} required /></div>
        <div className="space-y-2">
          <Label>Status</Label>
          <select name="status" defaultValue={event?.status || "upcoming"} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>
        <div className="space-y-2"><Label>Image</Label><FileUpload name="imageUrl" folder="events" defaultValue={event?.imageUrl} /></div>
      </div>
      <div className="space-y-2"><Label>Description</Label><Textarea name="description" defaultValue={event?.description} rows={4} required /></div>
      <DialogFooter>
        <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
        <Button type="submit">Save Event</Button>
      </DialogFooter>
    </form>
  );

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Events Management</h2>
          <p className="text-muted-foreground">Manage cinema events, premieres, and festivals.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild><Button className="w-full sm:w-auto"><Plus className="w-4 h-4 mr-2" /> Add Event</Button></DialogTrigger>
          <DialogContent className="sm:max-w-2xl"><DialogHeader><DialogTitle>Add New Event</DialogTitle></DialogHeader><EventForm /></DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border rounded-lg shadow-sm">
        <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={event.imageUrl} alt="" className="w-16 h-10 object-cover rounded shadow-sm" />
                    <div className="font-medium">{event.title}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>{new Date(event.date).toLocaleDateString()}</div>
                  <div className="text-xs text-muted-foreground">{event.time}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={event.status === "upcoming" ? "default" : "secondary"}>{event.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog open={editingEvent?.id === event.id} onOpenChange={(open) => !open && setEditingEvent(null)}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setEditingEvent(event)}><Edit2 className="w-4 h-4" /></Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-2xl"><DialogHeader><DialogTitle>Edit Event</DialogTitle></DialogHeader><EventForm event={event} /></DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setConfirm({ title: "Delete Event", description: "Delete this event?", onConfirm: async () => { await deleteEvent(event.id); toast.success("Event deleted"); } })}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {events.length === 0 && (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No events found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
        </div>
      </div>
      {confirm && <ConfirmDialog open={!!confirm} onOpenChange={() => setConfirm(null)} title={confirm.title} description={confirm.description} onConfirm={confirm.onConfirm} />}
    </AdminLayout>
  );
}
