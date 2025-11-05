// src/App.jsx
import React, { useState } from "react";
import Calendar from "./components/Calendar";
import DayModal from "./components/DayModal";

export default function App() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <div className="app">
      <header style={{display:'flex',alignItems:'center',justifyContent:'space-between', maxWidth:900, margin:'0 auto'}}>
        <button onClick={prevMonth}>◀</button>
        <h1 style={{textAlign:'center'}}>{new Date(year, month).toLocaleString('es-ES',{month:'long', year:'numeric'})}</h1>
        <button onClick={nextMonth}>▶</button>
      </header>

      <Calendar
        onSelectDate={(isoDate) => setSelectedDate(isoDate)}
        month={month}
        year={year}
      />

      {selectedDate && (
        <DayModal date={selectedDate} onClose={() => setSelectedDate(null)} />
      )}
    </div>
  );
}
