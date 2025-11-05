// src/components/DayModal.jsx
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "../firebase";

function formatDate(iso) {
  const [y, m, d] = iso.split("-");
  return `${d}-${m}-${y}`;
}

export default function DayModal({ date, onClose }) {
  const [pedidos, setPedidos] = useState([]);
  const [form, setForm] = useState({ cliente: "", producto: "", cantidad: 1, notas: "" });

  useEffect(() => {
    // Solo escuchamos pedidos con field 'date' igual a la fecha seleccionada
    const q = query(collection(db, "pedidos"), where("date", "==", date));
    const unsub = onSnapshot(q, (snap) => {
      const arr = [];
      snap.forEach((docu) => arr.push({ id: docu.id, ...docu.data() }));
      setPedidos(arr);
    }, (err) => console.error("snapshot day error:", err));
    return () => unsub();
  }, [date]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.cliente || !form.producto) return alert("Completar Cliente y Producto");
    await addDoc(collection(db, "pedidos"), { ...form, date });
    setForm({ cliente: "", producto: "", cantidad: 1, notas: "" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Eliminar este pedido?")) return;
    try {
      await deleteDoc(doc(db, "pedidos", id));
    } catch (err) {
      console.error("delete error:", err);
      alert("Error al eliminar");
    }
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose}>Cerrar</button>
        <h2>Pedidos para {formatDate(date)}</h2>

        <ul>
          {pedidos.length === 0 && <li>No hay pedidos</li>}
          {pedidos.map((p) => (
            <li key={p.id} className="pedido-item">
              <div>
                <strong>{p.cliente}</strong> — {p.producto} x{p.cantidad}
                {p.notas && <div style={{fontSize:12, color:'#555'}}>{p.notas}</div>}
              </div>
              <div>
                <button className="btn-delete" onClick={() => handleDelete(p.id)}>Eliminar</button>
              </div>
            </li>
          ))}
        </ul>

        <form onSubmit={submit} className="form">
          <input placeholder="Cliente" value={form.cliente} onChange={(e)=>setForm({...form, cliente:e.target.value})} required />
          <input placeholder="Producto" value={form.producto} onChange={(e)=>setForm({...form, producto:e.target.value})} required />
          <input type="number" min="1" value={form.cantidad} onChange={(e)=>setForm({...form, cantidad: Number(e.target.value)})} />
          <textarea placeholder="Notas" value={form.notas} onChange={(e)=>setForm({...form, notas:e.target.value})} />
          <button type="submit">Agregar pedido</button>
        </form>
      </div>
    </div>
  );
}
