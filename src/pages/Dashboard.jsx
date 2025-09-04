import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { client } from "../lib/appwrite";
import {
  listNotes,
  createNote,
  updateNote,
  softDeleteNote,
} from "../services/notes";
import NoteCard from "../components/NoteCard";
import { useNavigate } from "react-router-dom";

const DB_ID = import.meta.env.VITE_APPWRITE_DB_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const nav = useNavigate();

  async function load() {
    setLoading(true);
    try {
      const res = await listNotes(user.$id, { search: q });
      setNotes(res.documents || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  // this is
  useEffect(() => {
    load();
  }, [q]);

  useEffect(() => {
    const sub = client.subscribe(
      `databases.${DB_ID}.tables.${TABLE_ID}.rows`,
      (response) => {
        const doc = response.payload;
        if (doc.ownerId !== user.$id) return;

        if (response.events.some((x) => x.endsWith(".create")))
          setNotes((prev) => [doc, ...prev]);
        if (response.events.some((x) => x.endsWith(".update")))
          setNotes((prev) => prev.map((n) => (n.$id === doc.$id ? doc : n)));
        if (response.events.some((x) => x.endsWith(".delete")))
          setNotes((prev) => prev.filter((n) => n.$id !== doc.$id));
      }
    );
    return () => sub();
  }, [user.$id]);

  async function addTextNote() {
    const doc = await createNote(user.$id, {
      type: "text",
      title: "Untitled",
      content: "",
      tags: "",
    });
    setNotes((prev) => [doc, ...prev]);
    setShowOptions(false);
    nav(`/app/note/${doc.$id}`);
  }

  async function addChecklistNote() {
    const doc = await createNote(user.$id, {
      type: "checklist",
      title: "Checklist",
      items: "[]",
      tags: "",
    });
    setNotes((prev) => [doc, ...prev]);
    setShowOptions(false);
    nav(`/app/note/${doc.$id}`);
  }

  const handlePin = async (note) => {
    await updateNote(note.$id, { pinned: !note.pinned });
  };
  const handleArchive = async (note) => {
    await updateNote(note.$id, { archived: !note.archived });
  };
  const handleTrash = async (note) => {
    await softDeleteNote(note.$id);
  };

  const filtered = notes
    .filter((n) => !n.archived && !n.trashed)
    .sort((a, b) => (b.pinned === a.pinned ? 0 : b.pinned ? 1 : -1));

  // return (
  //    <div className="max-w-6xl mx-auto p-4">
  //     <header className="flex items-center gap-3 mb-4">
  //       <img src="https://cdn-icons-png.flaticon.com/512/9227/9227549.png" alt="Logo" className="h-10 w-10 rounded" /> {/* <-- Add your image here */}
  //       <h1 className="text-3xl font-bold flex-1">Yaadrakho</h1>
  //       <h3 className="text-xl font-bold text-blue-800">{"hii " + user?.name}</h3>
  //       <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search…" className="input w-64" />
  //       <div className="relative">
  //         <button onClick={() => setShowOptions(!showOptions)} className="px-4 py-2 rounded-xl bg-black text-white">+ Add</button>
  //         {showOptions && (
  //           <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-xl overflow-hidden border z-20">
  //             <button onClick={addTextNote} className="block w-full px-4 py-2 hover:bg-slate-100 text-left">📝 Text Note</button>
  //             <button onClick={addChecklistNote} className="block w-full px-4 py-2 hover:bg-slate-100 text-left">✅ Checklist</button>
  //           </div>
  //         )}
  //       </div>
  //       <button onClick={logout} className="px-3 py-2 rounded-xl bg-white border">Logout</button>
  //     </header>

  //     {loading ? <p>Loading…</p> : (
  //       filtered.length === 0 ? <p>No notes yet. Click <strong>+ Add</strong> to create one.</p> : (
  //         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
  //           {filtered.map(n => (
  //             <NoteCard key={n.$id} note={n} onPin={handlePin} onArchive={handleArchive} onTrash={handleTrash} />
  //           ))}
  //         </div>
  //       )
  //     )}
  //   </div>
  // )
  // ...existing code...
  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-4">
      <header className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="flex items-center gap-3 flex-1">
          <img
            src="https://cdn-icons-png.flaticon.com/512/9227/9227549.png"
            alt="Logo"
            className="h-10 w-10 rounded"
          />
          <h1 className="text-2xl sm:text-3xl font-bold">Yaadrakho</h1>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-blue-800 whitespace-nowrap">
          {"hii " + user?.name}
        </h3>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search…"
          className="input w-full sm:w-64 mt-2 sm:mt-0"
        />
        <div className="relative mt-2 sm:mt-0">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-black text-white"
          >
            + Add
          </button>
          {showOptions && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-xl overflow-hidden border z-20">
              <button
                onClick={addTextNote}
                className="block w-full px-4 py-2 hover:bg-slate-100 text-left"
              >
                📝 Text Note
              </button>
              <button
                onClick={addChecklistNote}
                className="block w-full px-4 py-2 hover:bg-slate-100 text-left"
              >
                ✅ Checklist
              </button>
            </div>
          )}
        </div>
        <button
          onClick={logout}
          className="w-full sm:w-auto px-3 py-2 rounded-xl bg-white border mt-2 sm:mt-0"
        >
          Logout
        </button>
      </header>

      {loading ? (
        <p>Loading…</p>
      ) : filtered.length === 0 ? (
        <p>
          No notes yet. Click <strong>+ Add</strong> to create one.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((n) => (
            <NoteCard
              key={n.$id}
              note={n}
              onPin={handlePin}
              onArchive={handleArchive}
              onTrash={handleTrash}
            />
          ))}
        </div>
      )}
    </div>
  );
  // ...existing code...
};

export default Dashboard;
