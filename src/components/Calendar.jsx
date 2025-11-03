import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';



function buildMonthDays(year, month){
const first = new Date(year, month, 1);
const last = new Date(year, month+1, 0);
const days = [];
for(let d=1; d<=last.getDate(); d++){
const date = new Date(year, month, d);
const iso = date.toISOString().slice(0,10);
days.push({day:d, iso});
}
return days;
}



export default function Calendar({ onSelectDate, month, year }){
const [counts, setCounts] = useState({});
const days = buildMonthDays(year, month);


useEffect(()=>{
const q = collection(db,'pedidos');
const unsub = onSnapshot(q, snapshot=>{
const c = {};
snapshot.forEach(doc=>{
const data = doc.data();
const d = data.date;
if(d){
c[d] = (c[d]||0) + (data.cantidad || 1);
}
});
setCounts(c);
});
return ()=>unsub();
},[]);


return (
<div className="calendar">
{days.map(d=> (
<div key={d.iso} className="day" onClick={()=>onSelectDate(d.iso)}>
<div className="label">{d.day}</div>
{counts[d.iso] && <div className="badge">{counts[d.iso]}</div>}
</div>
))}
</div>
);
}