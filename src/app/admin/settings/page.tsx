"use client";

import React from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";

export default function SettingsAdmin() {
  const { settings, updateSettings } = useAppStore();

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!window.confirm("Save settings changes?")) return;
    const fd = new FormData(e.currentTarget);
    await updateSettings({
      name: fd.get("name") as string,
      address: fd.get("address") as string,
      phone: fd.get("phone") as string,
      email: fd.get("email") as string,
      openingTime: fd.get("openingTime") as string,
      closingTime: fd.get("closingTime") as string,
      ticketPolicy: fd.get("ticketPolicy") as string,
      mapEmbedUrl: fd.get("mapEmbedUrl") as string,
      aboutText: fd.get("aboutText") as string,
      facebookUrl: fd.get("facebookUrl") as string,
      instagramUrl: fd.get("instagramUrl") as string,
    });
    alert("Settings saved successfully!");
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Cinema Settings</h2>
        <p className="text-muted-foreground">Manage general cinema details, contact info, and links.</p>
      </div>

      <form onSubmit={handleSave} className="bg-card border rounded-lg shadow-sm p-6 max-w-4xl space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">General Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Cinema Name</Label><Input name="name" defaultValue={settings.name} required /></div>
          </div>
          <div className="space-y-2">
            <Label>About Text</Label>
            <Textarea name="aboutText" defaultValue={settings.aboutText} rows={4} required />
            <p className="text-xs text-muted-foreground">Appears on the About page and Footer.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Opening Time</Label><Input name="openingTime" defaultValue={settings.openingTime} required /></div>
            <div className="space-y-2"><Label>Closing Time</Label><Input name="closingTime" defaultValue={settings.closingTime} required /></div>
          </div>
          <div className="space-y-2">
            <Label>Ticket & Payment Policy</Label>
            <Textarea name="ticketPolicy" defaultValue={settings.ticketPolicy} rows={3} required />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Contact Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Address</Label><Input name="address" defaultValue={settings.address} required /></div>
            <div className="space-y-2"><Label>Phone Number</Label><Input name="phone" defaultValue={settings.phone} required /></div>
            <div className="space-y-2"><Label>Email</Label><Input name="email" type="email" defaultValue={settings.email} required /></div>
          </div>
          <div className="space-y-2">
            <Label>Google Maps Embed URL</Label>
            <Input name="mapEmbedUrl" defaultValue={settings.mapEmbedUrl} required />
            <p className="text-xs text-muted-foreground">Google Maps → Share → Embed a map → copy the src URL.</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Facebook URL</Label><Input name="facebookUrl" type="url" defaultValue={settings.facebookUrl} /></div>
            <div className="space-y-2"><Label>Instagram URL</Label><Input name="instagramUrl" type="url" defaultValue={settings.instagramUrl} /></div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg"><Save className="w-4 h-4 mr-2" /> Save Settings</Button>
        </div>
      </form>
    </AdminLayout>
  );
}
