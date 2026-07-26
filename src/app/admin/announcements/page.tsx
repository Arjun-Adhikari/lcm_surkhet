"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { useAppStore } from "@/lib/store";
import type { Announcement } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";

export default function AnnouncementsAdmin() {
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useAppStore();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [confirm, setConfirm] = useState<{ title: string; description: string; onConfirm: () => void } | null>(null);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      text: fd.get("text") as string,
      type: fd.get("type") as Announcement["type"],
      isActive: fd.get("isActive") === "true",
    };
    if (editingAnnouncement) {
      setConfirm({
        title: "Update Announcement",
        description: "Save changes to this announcement?",
        onConfirm: async () => {
          await updateAnnouncement(editingAnnouncement.id, data);
          setEditingAnnouncement(null);
          toast.success("Announcement updated");
        },
      });
    } else {
      setConfirm({
        title: "Add Announcement",
        description: "Add this new announcement?",
        onConfirm: async () => {
          await addAnnouncement(data);
          setIsAddOpen(false);
          toast.success("Announcement added");
        },
      });
    }
  };

  const AnnouncementForm = ({ announcement }: { announcement?: Announcement | null }) => (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="space-y-2"><Label>Announcement Text</Label><Input name="text" defaultValue={announcement?.text} required /></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Type</Label>
          <select name="type" defaultValue={announcement?.type || "info"} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <select name="isActive" defaultValue={announcement ? (announcement.isActive ? "true" : "false") : "true"} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
        <Button type="submit">Save Announcement</Button>
      </DialogFooter>
    </form>
  );

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Announcements</h2>
          <p className="text-muted-foreground">Manage scrolling ticker announcements.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild><Button className="w-full sm:w-auto"><Plus className="w-4 h-4 mr-2" /> Add Announcement</Button></DialogTrigger>
          <DialogContent><DialogHeader><DialogTitle>Add New Announcement</DialogTitle></DialogHeader><AnnouncementForm /></DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border rounded-lg shadow-sm">
        <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Text</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {announcements.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.text}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={a.type === "info" ? "border-blue-500 text-blue-500" : a.type === "success" ? "border-green-500 text-green-500" : "border-yellow-500 text-yellow-500"}>
                    {a.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={a.isActive ? "default" : "secondary"}>{a.isActive ? "Active" : "Inactive"}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog open={editingAnnouncement?.id === a.id} onOpenChange={(open) => !open && setEditingAnnouncement(null)}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setEditingAnnouncement(a)}><Edit2 className="w-4 h-4" /></Button>
                      </DialogTrigger>
                      <DialogContent><DialogHeader><DialogTitle>Edit Announcement</DialogTitle></DialogHeader><AnnouncementForm announcement={a} /></DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setConfirm({ title: "Delete Announcement", description: "Delete this announcement?", onConfirm: async () => { await deleteAnnouncement(a.id); toast.success("Announcement deleted"); } })}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {announcements.length === 0 && (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No announcements found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
        </div>
      </div>
      {confirm && <ConfirmDialog open={!!confirm} onOpenChange={() => setConfirm(null)} title={confirm.title} description={confirm.description} onConfirm={confirm.onConfirm} />}
    </AdminLayout>
  );
}
