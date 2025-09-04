import React from "react";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Dashboard from "./pages/Dashboard";
import NoteEditor from "./pages/NoteEditor";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
        <Routes>
          <Route path="/" element={<Navigate to="/app" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<Dashboard />} />
            <Route path="/app/note/:id" element={<NoteEditor />} />
          </Route>
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;
