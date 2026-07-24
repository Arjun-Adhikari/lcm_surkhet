"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { useAppStore } from "@/lib/store";
import type { GalleryItem } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";

export default function GalleryAdmin() {
  const { gallery, addGalleryItem, deleteGalleryItem } = useAppStore();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await addGalleryItem({
      title: fd.get("title") as string,
      imageUrl: fd.get("imageUrl") as string,
      category: fd.get("category") as GalleryItem["category"],
    });
    setIsAddOpen(false);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gallery Management</h2>
          <p className="text-muted-foreground">Manage cinema photos and categories.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> Add Photo</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Photo</DialogTitle></DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2"><Label>Title</Label><Input name="title" required /></div>
              <div className="space-y-2"><Label>Image URL</Label><Input name="imageUrl" type="url" required /></div>
              <div className="space-y-2">
                <Label>Category</Label>
                <select name="category" defaultValue="interior" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="exterior">Exterior</option>
                  <option value="interior">Interior</option>
                  <option value="events">Events</option>
                  <option value="audience">Audience</option>
                </select>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                <Button type="submit">Upload Photo</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {gallery.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {gallery.map((item) => (
            <div key={item.id} className="group relative bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="aspect-4/3 overflow-hidden">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <div className="font-medium text-sm truncate">{item.title}</div>
                <Badge variant="secondary" className="mt-1 text-[10px]">{item.category}</Badge>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full shadow-md" onClick={() => { if (window.confirm("Delete this photo?")) deleteGalleryItem(item.id); }}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed rounded-xl bg-card">
          <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <p className="text-muted-foreground">No photos in gallery. Add some to get started.</p>
        </div>
      )}
    </AdminLayout>
  );
}
