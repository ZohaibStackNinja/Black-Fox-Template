import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/admin/auth/login", form);
      localStorage.setItem("adminToken", data.token);
      navigate("/admin");
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="container mx-auto py-12">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white/5 p-6 rounded">
        <input name="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} placeholder="Email" className="w-full p-3 mb-3" />
        <input type="password" name="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} placeholder="Password" className="w-full p-3 mb-3" />
        <button className="bg-deepBlue px-4 py-2 rounded">Login</button>
      </form>
    </div>
  );
}
