import { Client, Account, Databases, Storage, ID, Permission, Role, Query, TablesDB } from "appwrite";

export const client = new Client()
.setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
.setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const table = new TablesDB(client);

export { ID, Permission, Role, Query };