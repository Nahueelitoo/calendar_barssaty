import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '../firebase';


export default function DayModal({ date, onClose }){
const [pedidos, setPedidos] = useState([]);
const [form, setForm] = useState({cliente:'', producto:'', cantidad:1, notas:''});

function formatDate(isoDate){
  const [year, month, day] = isoDate.split('-');
  return `${day}-${month}-${year}`;
}

useEffect(()=>{
const q = collection(db,'pedidos');
const unsub = onSnapshot(q, snapshot=>{
const arr = [];
snapshot.forEach(doc=>{
const data = doc.data();
if(data.date === date) arr.push({id:doc.id, ...data});
});
setPedidos(arr);
});
return ()=>unsub();
},[date]);


const submit = async (e)=>{
e.preventDefault();
await addDoc(collection(db,'pedidos'), {...form, date});
setForm({cliente:'', producto:'', cantidad:1, notas:''});
};


return (
<div className="modal">
<div className="modal-content">
<button className="close" onClick={onClose}>Cerrar</button>
<h2>Pedidos para {formatDate(date)}</h2>
<ul>
{pedidos.map(p=> (
<li key={p.id}>{p.cliente} - {p.producto} x{p.cantidad}</li>
))}
</ul>
<form onSubmit={submit} className="form">
<input placeholder="Cliente" value={form.cliente} onChange={e=>setForm({...form,cliente:e.target.value})} required />
<input placeholder="Producto" value={form.producto} onChange={e=>setForm({...form,producto:e.target.value})} required />
<input type="number" min="1" value={form.cantidad} onChange={e=>setForm({...form,cantidad:Number(e.target.value)})} />
<textarea placeholder="Notas" value={form.notas} onChange={e=>setForm({...form,notas:e.target.value})} />
<button type="submit">Agregar pedido</button>
</form>
</div>
</div>
);
}