import axios from "axios";

export async function uploadFile(file) {
  const form = new FormData();
  form.append("file", file);
  const res = await axios.post("/api/upload", form, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  // returns { url, public_id }
  return res.data;
}
