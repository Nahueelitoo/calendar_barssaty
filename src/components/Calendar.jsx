// src/components/Calendar.jsx
import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import "../styles.css"; // asegura que tome estilos globales si hace falta

const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export default function Calendar({ onSelectDate, month, year }) {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const q = collection(db, "pedidos");
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const c = {};
        snapshot.forEach((doc) => {
          const data = doc.data();
          const d = data.date; // asumimos campo 'date' con ISO yyyy-mm-dd
          if (!d) return;
          c[d] = (c[d] || 0) + (data.cantidad || 1);
        });
        setCounts(c);
      },
      (err) => {
        console.error("onSnapshot error:", err);
      }
    );
    return () => unsub();
  }, []);

  // Construye array de días con offsets (celdas vacías antes del día 1)
  const buildDaysWithOffset = (year, month) => {
    // 1) cuántos días tiene el mes
    const lastDay = new Date(year, month + 1, 0).getDate();

    // 2) día de la semana del 1ro del mes (getDay: 0=Dom,1=Lun,...6=Sáb)
    const firstWeekDay = new Date(year, month, 1).getDay();

    // 3) convertimos a índice donde Lunes=0 ... Domingo=6
    //    si getDay() devuelve 1 (Lunes) => offset 0
    //    fórmula: (firstWeekDay + 6) % 7
    const offset = (firstWeekDay + 6) % 7;

    // 4) crear array: primero 'offset' celdas vacías, luego los días 1..lastDay
    const arr = [];

    for (let i = 0; i < offset; i++) {
      arr.push({ type: "blank", key: `b-${i}` });
    }

    for (let d = 1; d <= lastDay; d++) {
      const iso = new Date(year, month, d).toISOString().slice(0, 10); // YYYY-MM-DD
      arr.push({ type: "day", day: d, iso });
    }

    return arr;
  };

  const daysWithOffset = buildDaysWithOffset(year, month);

  return (
    <>
      {/* Header de días de la semana */}
      <div className="calendar-weekdays" aria-hidden="true">
        {weekDays.map((wd) => (
          <div key={wd} className="weekday">{wd}</div>
        ))}
      </div>

      <div className="calendar" role="grid" aria-label="Calendario">
        {daysWithOffset.map((cell, idx) => {
          if (cell.type === "blank") {
            return <div key={cell.key} className="day blank" aria-hidden="true" />;
          }

          // cell.type === 'day'
          return (
            <div
              key={cell.iso}
              className={`day ${counts[cell.iso] ? "crossed" : ""}`}
              onClick={() => onSelectDate(cell.iso)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter") onSelectDate(cell.iso); }}
            >
              <div className="label">{cell.day}</div>
              {counts[cell.iso] && <div className="badge">{counts[cell.iso]}</div>}
            </div>
          );
        })}
      </div>
    </>
  );
}
