import React, { useState, useContext } from "react";
import { SettingsContext } from "../../contexts/SettingsContext";
import axios from "axios";


function WebsiteSettings() {

  const { settings, setSettings } = useContext(SettingsContext);
  const [form, setForm] = useState(settings);

  const update = () => {
    axios.put("/api/settings", form).then(res => {
      setSettings(res.data);
      alert("Settings updated!");
    });
  };

  return (
    <div>
      <input value={form.siteTitle} onChange={e => setForm({ ...form, siteTitle: e.target.value })} />
      <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
      <textarea value={form.aboutUs} onChange={e => setForm({ ...form, aboutUs: e.target.value })} />

      <button onClick={update}>Save Settings</button>
    </div>
  );
}
export default WebsiteSettings;