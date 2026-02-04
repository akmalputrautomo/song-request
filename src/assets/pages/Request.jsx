import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast"; // 1. Import toast

export const Request = () => {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [comments, setComments] = useState({});
  const [activeComment, setActiveComment] = useState({});
  const [openCommentId, setOpenCommentId] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. Konfigurasi style toast gelap yang elegan
  const toastStyle = {
    style: {
      borderRadius: "10px",
      background: "#1a1a1a",
      color: "#fff",
      border: "1px solid rgba(255, 255, 255, 0.1)",
    },
    iconTheme: {
      primary: "#fff",
      secondary: "#000",
    },
  };

  const fetchData = async () => {
    try {
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

    try {
      await fetch(`https://backend-v-project-production.up.railway.app/request/${id}`, { method: "DELETE" });
      // 3. Toast Berhasil Hapus
      toast.success("Request berhasil dihapus", toastStyle);
      fetchData();
    } catch (error) {
      toast.error("Gagal menghapus request", toastStyle);
    }
  };

  const handleSendComment = async (id) => {
    if (!activeComment[id]) return;

    try {
      await fetch(`https://backend-v-project-production.up.railway.app/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request_id: id,
          commenter_name: "User",
          message: activeComment[id],
        }),
      });

      // 4. Toast Berhasil Komentar
      toast.success("Komentar terkirim", toastStyle);

      setActiveComment((p) => ({ ...p, [id]: "" }));
      fetchData();
    } catch (error) {
      toast.error("Gagal mengirim komentar", toastStyle);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 5. Wadah Toast */}
      <Toaster position="top-center" reverseOrder={false} />

      <header className="sticky top-0 bg-black/80 backdrop-blur border-b border-white/10 z-50">
        <div className="max-w-xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate("/")} className="text-xl">
            ←
          </button>
          <h1 className="text-sm font-bold tracking-widest">DAFTAR REQUEST</h1>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-6 space-y-6">
        {!loading && requests.length === 0 && <p className="text-center text-gray-500 mt-10">Belum ada request lagu 🎵</p>}

        {requests.map((r) => (
          <div key={r.id} className="bg-zinc-900/60 p-5 rounded-2xl border border-white/10 shadow-xl">
            <button onClick={() => handleDelete(r.id)} className="float-right text-red-500 hover:scale-110 transition-transform">
              🗑️
            </button>

            <h2 className="text-xl font-bold text-purple-200">{r.song_title}</h2>
            <p className="text-sm text-gray-400">{r.artist_name}</p>

            <div className="mt-1">
              <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full uppercase tracking-tighter">BY {r.requester_name}</span>
            </div>

            <button onClick={() => setOpenCommentId(openCommentId === r.id ? null : r.id)} className="mt-4 w-full bg-white/5 hover:bg-white/10 py-2 rounded-xl text-xs font-semibold transition-colors border border-white/5">
              💬 {comments[r.id]?.length || 0} Komentar
            </button>

            {openCommentId === r.id && (
              <div className="mt-3 space-y-2 animate-in fade-in slide-in-from-top-2">
                <div className="max-height-[200px] overflow-y-auto space-y-2 pr-1">
                  {comments[r.id]?.map((c) => (
                    <div key={c.id} className="bg-white/5 p-3 rounded-lg border border-white/5">
                      <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">@{c.commenter_name}</p>
                      <p className="text-sm text-gray-200">{c.message}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mt-4 pt-2 border-t border-white/5">
                  <input
                    value={activeComment[r.id] || ""}
                    onChange={(e) =>
                      setActiveComment((p) => ({
                        ...p,
                        [r.id]: e.target.value,
                      }))
                    }
                    className="flex-1 bg-black border border-white/10 px-4 py-2 rounded-full text-sm focus:outline-none focus:border-purple-500"
                    placeholder="Tulis komentar..."
                  />
                  <button onClick={() => handleSendComment(r.id)} className="bg-purple-600 hover:bg-purple-500 px-4 rounded-full transition-colors active:scale-90">
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
