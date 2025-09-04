import { databases, ID, Query, Permission, Role, table } from "../lib/appwrite";

const DB_ID = import.meta.env.VITE_APPWRITE_DB_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;

export async function createNote(userId, data = {}) {
   const payload = {
    title: "",
    content: "",
    tags: [],
    color: "yellow",
    pinned: false,
    archived: false,
    trashed: false,
    ownerId: userId,
    type: "text",   // "text" or "checklist"
    items: "",      // checklist items: [{text, done}]
    ...data,
}
  return await table.createRow({
    databaseId: DB_ID,
    tableId: TABLE_ID,
    rowId: ID.unique(),
    data: payload
  });

}

// export async function listNotes(userId, filters = {}) {
//     const q = [Query.equal("ownerId", userId), Query.equal("trashed", false)]

//     if(filters.pinned !== undefined){
//         q.push(Query.equal("pinned", filters.pinned));
//     }
//     if(filters.archived !== undefined){
//         q.push(Query.equal("archived", filters.archived));
//     }
//     if(filters.tags && filters.tags.length > 0){
//         q.push(Query.in("tags", filters.tags));
//     }
//     if(filters.search){
//         q.push(Query.search("title", filters.search));
//         q.push(Query.search("content", filters.search));
//     }

//     return await table.listRows({
//         databaseId: DB_ID,
//         tableId: TABLE_ID,
//         queries: q,
//         orderAttributes: ["pinned", "updatedAt"],
//         orderTypes: ["DESC", "DESC"]
//     });
// }

export async function listNotes(userId, { search }) {
  return await databases.listDocuments(DB_ID, TABLE_ID, [
    Query.equal("ownerId", userId),
    ...(search ? [Query.search("title", search)] : [])
  ]);
}

export const getNote = (id) =>  table.getRow({
    databaseId: DB_ID,
    tableId: TABLE_ID,
    rowId: id
})

export const updateNote = (id, data) => table.updateRow({
    databaseId: DB_ID,
    tableId: TABLE_ID,
    rowId: id,
    data
})

export const softDeleteNote = (id) => updateNote(id, {trashed: true, archived: false, pinned: false});

export const hardDeleteNote = (id) => table.deleteRow({
    databaseId: DB_ID,
    tableId: TABLE_ID,
    rowId: id
})

export const restoreNote = (id) => updateNote(id, {trashed: false});

