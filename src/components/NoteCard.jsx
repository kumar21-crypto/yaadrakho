import React from 'react'
import { Link } from 'react-router-dom'

const NoteCard = ({ note, onPin, onArchive, onTrash }) => {
  return (
    <article className="glass p-4">
      <Link to={`/app/note/${note.$id}`} className="block">
        <h3 className="font-semibold mb-2">{note.title || (note.type === "checklist" ? "Checklist" : "Untitled")}</h3>
        {note.type === "text" ? (
          <p className="text-sm line-clamp-3 whitespace-pre-wrap">{note.content}</p>
        ) : (
          <ul className="text-sm list-disc ml-4">
            {note.items?.slice(0,4).map((it, i) => (
              <li key={i} className={it.done ? "line-through text-slate-400" : ""}>{it.text || "—"}</li>
            ))}
          </ul>
        )}
      </Link>

      <div className="mt-3 flex items-center gap-2">
        <button onClick={() => onPin(note)} className="text-xs px-2 py-1 rounded bg-white border">{note.pinned ? "Unpin" : "Pin"}</button>
        <button onClick={() => onArchive(note)} className="text-xs px-2 py-1 rounded bg-white border">{note.archived ? "Unarchive" : "Archive"}</button>
        <button onClick={() => onTrash(note)} className="text-xs px-2 py-1 rounded bg-red-600 text-white ml-auto">Trash</button>
      </div>
    </article>
  )
}

export default NoteCard
