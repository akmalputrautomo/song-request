import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export const Request = () => {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [comments, setComments] = useState({});
  const [activeComment, setActiveComment] = useState({});
  const [openCommentId, setOpenCommentId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await fetch(`https://backend-v-project-production.up.railway.app/request`);
      const reqData = await res.json();
      setRequests(reqData);

      const commentPromises = reqData.map(async (r) => {
        const resC = await fetch(`https://backend-v-project-production.up.railway.app/comment/${r.id}`);
        const cData = await resC.json();
        return { id: r.id, data: Array.isArray(cData) ? cData : [] };
      });

      const all = await Promise.all(commentPromises);
      const mapped = {};
      all.forEach((i) => (mapped[i.id] = i.data));
      setComments(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus request ini?")) return;
    await fetch(`https://backend-v-project-production.up.railway.app/request/${id}`, { method: "DELETE" });
    fetchData();
  };

  const handleSendComment = async (id) => {
    if (!activeComment[id]) return;

    await fetch(`https://backend-v-project-production.up.railway.app/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        request_id: id,
        commenter_name: "User",
        message: activeComment[id],
      }),
    });

    setActiveComment((p) => ({ ...p, [id]: "" }));
    fetchData();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 bg-black/80 backdrop-blur border-b border-white/10">
        <div className="max-w-xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate("/")}>←</button>
          <h1 className="text-sm font-bold tracking-widest">DAFTAR REQUEST</h1>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-6 space-y-6">
        {/* {loading && <p className="text-center text-gray-500">Memuat...</p>} */}

        {!loading && requests.length === 0 && <p className="text-center text-gray-500">Belum ada request lagu 🎵</p>}

        {requests.map((r) => (
          <div key={r.id} className="bg-zinc-900/60 p-5 rounded-2xl border border-white/10">
            <button onClick={() => handleDelete(r.id)} className="float-right text-red-500">
              🗑️
            </button>

            <h2 className="text-xl font-bold text-purple-200">{r.song_title}</h2>
            <p className="text-sm text-gray-400">{r.artist_name}</p>

            <span className="text-xs text-purple-400">BY {r.requester_name}</span>

            <button onClick={() => setOpenCommentId(openCommentId === r.id ? null : r.id)} className="mt-4 w-full bg-white/10 py-2 rounded-xl">
              💬 {comments[r.id]?.length || 0} Komentar
            </button>

            {openCommentId === r.id && (
              <div className="mt-3 space-y-2">
                {comments[r.id]?.map((c) => (
                  <div key={c.id} className="bg-white/5 p-2 rounded-lg">
                    <p className="text-xs text-purple-400">@{c.commenter_name}</p>
                    <p className="text-sm">{c.message}</p>
                  </div>
                ))}

                <div className="flex gap-2 mt-2">
                  <input
                    value={activeComment[r.id] || ""}
                    onChange={(e) =>
                      setActiveComment((p) => ({
                        ...p,
                        [r.id]: e.target.value,
                      }))
                    }
                    className="flex-1 bg-black border border-white/10 px-3 py-2 rounded-full"
                    placeholder="Tulis komentar..."
                  />
                  <button onClick={() => handleSendComment(r.id)} className="bg-purple-600 px-4 rounded-full">
                    ➤
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  );
};
