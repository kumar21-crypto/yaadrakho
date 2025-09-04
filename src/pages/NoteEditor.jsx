import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getNote, updateNote, hardDeleteNote } from "../services/notes";

export default function NoteEditor() {
  const { id } = useParams();
  const nav = useNavigate();
  const [note, setNote] = useState(null);
  const [saving, setSaving] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    let mounted = true;
    getNote(id).then(doc => { if (mounted) setNote(doc); }).catch(console.error);
    return () => mounted = false;
  }, [id]);

  function scheduleSave(patch) {
    setNote(n => ({ ...n, ...patch }));
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setSaving(true);
      try { await updateNote(id, { ...patch }); }
      catch (e) { console.error(e); }
      setSaving(false);
    }, 500); // debounce autosave
  }

  if (!note) return <div className="p-4">Loading…</div>;

  async function handleDelete() {
    await destroyNote(id);
    nav("/app");
  }

  // Checklist helpers
  function updateChecklistItem(idx, patch) {
    const newItems = [...(note.items || [])];
    newItems[idx] = { ...newItems[idx], ...patch };
    scheduleSave({ items: newItems });
  }

  function addChecklistItem() {
    const newItems = [...(note.items || []), { text: "", done: false }];
    scheduleSave({ items: newItems });
  }

  function removeChecklistItem(idx) {
    const newItems = [...(note.items || [])];
    newItems.splice(idx,1);
    scheduleSave({ items: newItems });
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center gap-3 mb-3">
        <input
          className="text-2xl font-semibold w-full outline-none bg-transparent"
          value={note.title || ""}
          onChange={e=>scheduleSave({ title: e.target.value })}
          placeholder="Title"
        />
        <button className="px-3 py-2 rounded-xl bg-red-600 text-white" onClick={handleDelete}>Delete</button>
      </div>

      {note.type === "text" && (
        <textarea
          className="w-full min-h-[60vh] p-4 rounded-xl bg-white border"
          value={note.content || ""}
          onChange={e=>scheduleSave({ content: e.target.value })}
          placeholder="Start typing…"
        />
      )}

      {note.type === "checklist" && (
        <div className="space-y-2">
          {(note.items || []).map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!item.done}
                onChange={e=>updateChecklistItem(idx,{done:e.target.checked})}
              />
              <input
                type="text"
                value={item.text}
                onChange={e=>updateChecklistItem(idx,{text:e.target.value})}
                className="flex-1 border rounded px-2 py-1"
                placeholder="Checklist item..."
              />
              <button onClick={()=>removeChecklistItem(idx)} className="px-2 py-1 rounded bg-red-100 text-red-600">Remove</button>
            </div>
          ))}
          <button onClick={addChecklistItem} className="text-sm text-blue-600 mt-2">+ Add item</button>
        </div>
      )}

      <div className="mt-2 text-sm">{saving ? "Saving…" : "Saved"}</div>
    </div>
  );
}
