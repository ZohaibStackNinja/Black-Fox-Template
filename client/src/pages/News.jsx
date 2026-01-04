import React, { useEffect, useState } from "react";
import axios from "axios";
import NewsItem from "../components/news/NewsItem";

export default function News() {
  const [data, setData] = useState({ posts: [], page:1, pages:1, total:0 });
  const [page, setPage] = useState(1);
  const limit = 8;

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get(`/api/news?page=${page}&limit=${limit}`);
      setData({ posts: res.data.posts, page: res.data.page, pages: res.data.pages, total: res.data.total });
    };
    fetchPosts();
  }, [page]);

  return (
    <section className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">News</h1>

      <div>
        {data.posts.map(p => <NewsItem key={p._id} post={p} />)}
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button onClick={()=>setPage(p=>Math.max(1, p-1))} disabled={data.page<=1} className="px-4 py-2 bg-white/5 rounded">Prev</button>
        <span className="px-3 py-2">Page {data.page} of {data.pages}</span>
        <button onClick={()=>setPage(p=>Math.min(data.pages, p+1))} disabled={data.page>=data.pages} className="px-4 py-2 bg-white/5 rounded">Next</button>
      </div>
    </section>
  );
}
