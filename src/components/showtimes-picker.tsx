"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import type { Showtime } from "@/lib/store";

interface Props {
  showtimes: Showtime[];
  phone: string;
}

export function ShowtimesPicker({ showtimes, phone }: Props) {
  const grouped = showtimes.reduce((acc, st) => {
    if (!acc[st.date]) acc[st.date] = [];
    acc[st.date].push(st);
    return acc;
  }, {} as Record<string, Showtime[]>);

  const dates = Object.keys(grouped).sort();
  const [selectedDate, setSelectedDate] = useState(dates[0] || "");

  return (
    <>
      {/* Date selector */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
        {dates.map((date) => {
          const d = new Date(date);
          const isSelected = date === selectedDate;
          return (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`flex flex-col items-center min-w-20 p-3 rounded-xl border transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                  : "bg-card text-foreground hover:border-primary/50"
              }`}
            >
              <span className="text-xs uppercase font-semibold">
                {d.toLocaleDateString("en-US", { weekday: "short" })}
              </span>
              <span className="text-xl font-bold">{d.getDate()}</span>
              <span className="text-xs opacity-80">
                {d.toLocaleDateString("en-US", { month: "short" })}
              </span>
            </button>
          );
        })}
      </div>

      {/* Showtime slots */}
      <div className="space-y-4">
        {grouped[selectedDate]?.map((st) => (
          <div key={st.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl bg-card hover:border-primary/50 transition-colors gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-muted px-4 py-2 rounded-lg text-center">
                <span className="block text-xl font-bold font-mono">{st.time}</span>
              </div>
              <div>
                <div className="font-semibold text-lg">{st.screen}</div>
                <div className="text-sm text-muted-foreground">
                  {st.availableSeats > 0 ? "Availability at counter" : "Currently unavailable"}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(st.ticketPrices || [{ type: "General", price: st.price }]).map((ticket) => (
                    <span key={ticket.type} className="rounded-md border bg-background px-2 py-1 text-xs">
                      {ticket.type}: <span className="font-semibold text-foreground">Rs. {ticket.price}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <Button variant="outline" disabled={st.availableSeats === 0} asChild>
              <a href={`tel:${phone.replace(/\s/g, "")}`}>
                <Phone className="w-4 h-4 mr-2" />
                {st.availableSeats === 0 ? "Unavailable" : "Call to Confirm"}
              </a>
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}
