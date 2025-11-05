// src/components/Calendar.jsx
import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

function buildMonthDays(year, month) {
  const last = new Date(year, month + 1, 0);
  const days = [];
  for (let d = 1; d <= last.getDate(); d++) {
    const iso = new Date(year, month, d).toISOString().slice(0, 10);
    days.push({ day: d, iso });
  }
  return days;
}

export default function Calendar({ onSelectDate, month, year }) {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    // Escuchamos toda la colección 'pedidos' en tiempo real
    const q = collection(db, "pedidos");
    const unsub = onSnapshot(q, (snapshot) => {
      const c = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        const d = data.date; // asumimos el campo se llama 'date' en ISO YYYY-MM-DD
        if (!d) return;
        // contamos por fecha
        c[d] = (c[d] || 0) + (data.cantidad || 1);
      });
      setCounts(c);
    }, (err) => {
      console.error("onSnapshot error:", err);
    });

    return () => unsub();
  }, []);

  const days = buildMonthDays(year, month);

  return (
    <div className="calendar" role="grid" aria-label="Calendario">
      {days.map((d) => (
        <div
          key={d.iso}
          className={`day ${counts[d.iso] ? "crossed" : ""}`}
          onClick={() => onSelectDate(d.iso)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') onSelectDate(d.iso); }}
        >
          <div className="label">{d.day}</div>
          {counts[d.iso] && <div className="badge">{counts[d.iso]}</div>}
        </div>
      ))}
    </div>
  );
}
