"use client";

import React, { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type MovieStatus = "now-showing" | "coming-soon" | "archived";

export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  director: string;
  cast: string[];
  durationMinutes: number;
  genre: string[];
  synopsis: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  status: MovieStatus;
  releaseDate: string;
  language: string;
  ageRating: string;
}

export interface Showtime {
  id: string;
  movieId: string;
  date: string;
  time: string;
  screen: string;
  price: number;
  ticketPrices: { type: string; price: number }[];
  availableSeats: number;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  imageUrl: string;
  status: "upcoming" | "past";
}

export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  category: "exterior" | "interior" | "events" | "audience";
}

export interface Announcement {
  id: string;
  text: string;
  isActive: boolean;
  type: "info" | "warning" | "success";
}

export interface CinemaSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  openingTime: string;
  closingTime: string;
  ticketPolicy: string;
  mapEmbedUrl: string;
  aboutText: string;
  facebookUrl: string;
  instagramUrl: string;
}

const API_BASE = "/api";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

interface AppContextType {
  movies: Movie[];
  showtimes: Showtime[];
  events: Event[];
  gallery: GalleryItem[];
  announcements: Announcement[];
  settings: CinemaSettings;

  addMovie: (m: Omit<Movie, "id">) => Promise<void>;
  updateMovie: (id: string, m: Partial<Movie>) => Promise<void>;
  deleteMovie: (id: string) => Promise<void>;

  addShowtime: (s: Omit<Showtime, "id">) => Promise<void>;
  updateShowtime: (id: string, s: Partial<Showtime>) => Promise<void>;
  deleteShowtime: (id: string) => Promise<void>;

  addEvent: (e: Omit<Event, "id">) => Promise<void>;
  updateEvent: (id: string, e: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;

  addGalleryItem: (g: Omit<GalleryItem, "id">) => Promise<void>;
  updateGalleryItem: (id: string, g: Partial<GalleryItem>) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;

  addAnnouncement: (a: Omit<Announcement, "id">) => Promise<void>;
  updateAnnouncement: (id: string, a: Partial<Announcement>) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;

  updateSettings: (s: Partial<CinemaSettings>) => Promise<void>;
  refresh: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const STALE_TIME = 1000 * 60 * 2; // 2 minutes

  const moviesQuery = useQuery({ queryKey: ["movies"], queryFn: () => fetchJson<Movie[]>(`${API_BASE}/movies`), staleTime: STALE_TIME });
  const showtimesQuery = useQuery({ queryKey: ["showtimes"], queryFn: () => fetchJson<Showtime[]>(`${API_BASE}/showtimes`), staleTime: STALE_TIME });
  const eventsQuery = useQuery({ queryKey: ["events"], queryFn: () => fetchJson<Event[]>(`${API_BASE}/events`), staleTime: STALE_TIME });
  const galleryQuery = useQuery({ queryKey: ["gallery"], queryFn: () => fetchJson<GalleryItem[]>(`${API_BASE}/gallery`), staleTime: STALE_TIME });
  const announcementsQuery = useQuery({ queryKey: ["announcements"], queryFn: () => fetchJson<Announcement[]>(`${API_BASE}/announcements`), staleTime: STALE_TIME });
  const settingsQuery = useQuery({ queryKey: ["settings"], queryFn: () => fetchJson<CinemaSettings>(`${API_BASE}/settings`), staleTime: Infinity });

  const movies = moviesQuery.data ?? [];
  const showtimes = showtimesQuery.data ?? [];
  const events = eventsQuery.data ?? [];
  const gallery = galleryQuery.data ?? [];
  const announcements = announcementsQuery.data ?? [];
  const settings = settingsQuery.data ?? ({
    name: "Laxmi Chalchitra Mandir", address: "", phone: "", email: "",
    openingTime: "", closingTime: "", ticketPolicy: "", mapEmbedUrl: "",
    aboutText: "", facebookUrl: "", instagramUrl: "",
  } as CinemaSettings);

  const ref = (key: string) => () => { queryClient.invalidateQueries({ queryKey: [key] }); };

  const addMovieMutation = useMutation({ mutationFn: (m: Omit<Movie, "id">) => fetchJson<Movie>(`${API_BASE}/movies`, { method: "POST", body: JSON.stringify(m) }), onSettled: ref("movies") });
  const updateMovieMutation = useMutation({ mutationFn: ({ id, ...patch }: { id: string } & Partial<Movie>) => fetchJson<Movie>(`${API_BASE}/movies/${id}`, { method: "PATCH", body: JSON.stringify(patch) }), onSettled: ref("movies") });
  const deleteMovieMutation = useMutation({ mutationFn: (id: string) => fetchJson<void>(`${API_BASE}/movies/${id}`, { method: "DELETE" }), onSettled: ref("movies") });

  const addShowtimeMutation = useMutation({ mutationFn: (s: Omit<Showtime, "id">) => fetchJson<Showtime>(`${API_BASE}/showtimes`, { method: "POST", body: JSON.stringify(s) }), onSettled: ref("showtimes") });
  const updateShowtimeMutation = useMutation({ mutationFn: ({ id, ...patch }: { id: string } & Partial<Showtime>) => fetchJson<Showtime>(`${API_BASE}/showtimes/${id}`, { method: "PATCH", body: JSON.stringify(patch) }), onSettled: ref("showtimes") });
  const deleteShowtimeMutation = useMutation({ mutationFn: (id: string) => fetchJson<void>(`${API_BASE}/showtimes/${id}`, { method: "DELETE" }), onSettled: ref("showtimes") });

  const addEventMutation = useMutation({ mutationFn: (e: Omit<Event, "id">) => fetchJson<Event>(`${API_BASE}/events`, { method: "POST", body: JSON.stringify(e) }), onSettled: ref("events") });
  const updateEventMutation = useMutation({ mutationFn: ({ id, ...patch }: { id: string } & Partial<Event>) => fetchJson<Event>(`${API_BASE}/events/${id}`, { method: "PATCH", body: JSON.stringify(patch) }), onSettled: ref("events") });
  const deleteEventMutation = useMutation({ mutationFn: (id: string) => fetchJson<void>(`${API_BASE}/events/${id}`, { method: "DELETE" }), onSettled: ref("events") });

  const addGalleryItemMutation = useMutation({ mutationFn: (g: Omit<GalleryItem, "id">) => fetchJson<GalleryItem>(`${API_BASE}/gallery`, { method: "POST", body: JSON.stringify(g) }), onSettled: ref("gallery") });
  const updateGalleryItemMutation = useMutation({ mutationFn: ({ id, ...patch }: { id: string } & Partial<GalleryItem>) => fetchJson<GalleryItem>(`${API_BASE}/gallery/${id}`, { method: "PATCH", body: JSON.stringify(patch) }), onSettled: ref("gallery") });
  const deleteGalleryItemMutation = useMutation({ mutationFn: (id: string) => fetchJson<void>(`${API_BASE}/gallery/${id}`, { method: "DELETE" }), onSettled: ref("gallery") });

  const addAnnouncementMutation = useMutation({ mutationFn: (a: Omit<Announcement, "id">) => fetchJson<Announcement>(`${API_BASE}/announcements`, { method: "POST", body: JSON.stringify(a) }), onSettled: ref("announcements") });
  const updateAnnouncementMutation = useMutation({ mutationFn: ({ id, ...patch }: { id: string } & Partial<Announcement>) => fetchJson<Announcement>(`${API_BASE}/announcements/${id}`, { method: "PATCH", body: JSON.stringify(patch) }), onSettled: ref("announcements") });
  const deleteAnnouncementMutation = useMutation({ mutationFn: (id: string) => fetchJson<void>(`${API_BASE}/announcements/${id}`, { method: "DELETE" }), onSettled: ref("announcements") });

  const updateSettingsMutation = useMutation({ mutationFn: (s: Partial<CinemaSettings>) => fetchJson<CinemaSettings>(`${API_BASE}/settings`, { method: "PATCH", body: JSON.stringify(s) }), onSettled: ref("settings") });

  const value: AppContextType = {
    movies, showtimes, events, gallery, announcements, settings,
    addMovie: (m) => addMovieMutation.mutateAsync(m) as unknown as Promise<void>,
    updateMovie: (id, m) => updateMovieMutation.mutateAsync({ id, ...m }) as unknown as Promise<void>,
    deleteMovie: (id) => deleteMovieMutation.mutateAsync(id) as unknown as Promise<void>,
    addShowtime: (s) => addShowtimeMutation.mutateAsync(s) as unknown as Promise<void>,
    updateShowtime: (id, s) => updateShowtimeMutation.mutateAsync({ id, ...s }) as unknown as Promise<void>,
    deleteShowtime: (id) => deleteShowtimeMutation.mutateAsync(id) as unknown as Promise<void>,
    addEvent: (e) => addEventMutation.mutateAsync(e) as unknown as Promise<void>,
    updateEvent: (id, e) => updateEventMutation.mutateAsync({ id, ...e }) as unknown as Promise<void>,
    deleteEvent: (id) => deleteEventMutation.mutateAsync(id) as unknown as Promise<void>,
    addGalleryItem: (g) => addGalleryItemMutation.mutateAsync(g) as unknown as Promise<void>,
    updateGalleryItem: (id, g) => updateGalleryItemMutation.mutateAsync({ id, ...g }) as unknown as Promise<void>,
    deleteGalleryItem: (id) => deleteGalleryItemMutation.mutateAsync(id) as unknown as Promise<void>,
    addAnnouncement: (a) => addAnnouncementMutation.mutateAsync(a) as unknown as Promise<void>,
    updateAnnouncement: (id, a) => updateAnnouncementMutation.mutateAsync({ id, ...a }) as unknown as Promise<void>,
    deleteAnnouncement: (id) => deleteAnnouncementMutation.mutateAsync(id) as unknown as Promise<void>,
    updateSettings: (s) => updateSettingsMutation.mutateAsync(s) as unknown as Promise<void>,
    refresh: () => queryClient.invalidateQueries({ queryKey: ["movies"] }),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error("useAppStore must be used within an AppProvider");
  return context;
}
