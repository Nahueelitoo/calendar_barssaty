import React, { useState } from 'react';
import Calendar from './components/Calendar';
import DayModal from './components/DayModal';


export default function App(){
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const nextMonth = () => {
    if(currentMonth === 11){
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  }

  const prevMonth = () => {
    if(currentMonth === 0){
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }

  return (
    <div className="app">
      <h1>Calendario de Pedidos</h1>
      <div className="month-nav">
        <button onClick={prevMonth}>⬅</button>
        <span>{currentMonth+1} / {currentYear}</span>
        <button onClick={nextMonth}>➡</button>
      </div>
      <Calendar 
        onSelectDate={(d)=>setSelectedDate(d)}
        month={currentMonth}
        year={currentYear}
      />
      {selectedDate && (
        <DayModal date={selectedDate} onClose={()=>setSelectedDate(null)} />
      )}
    </div>
  );
}