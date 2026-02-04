import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const [judul, setJudul] = useState("");
  const [artis, setArtis] = useState("");
  const [nama, setNama] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!judul || !artis || !nama) {
      alert("Lengkapi semua field dulu ya 🙏");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`https://backend-v-project-production.up.railway.app/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          song_title: judul,
          artist_name: artis,
          requester_name: nama,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal mengirim request");
      }

      navigate("/Qris");

      setJudul("");
      setArtis("");
      setNama("");
    } catch (error) {
      alert("Request gagal dikirim 😢");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative">
      <div className="absolute inset-0 bg-black/80"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-white">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-widest text-center">
          SONG <br /> REQUEST
        </h1>

        <p className="mt-2 text-lg font-bold text-purple-400">PAK ARIF BAND</p>

        <p className="mt-2 text-sm text-gray-300 text-center">Request lagu favorit kamu untuk diputar</p>

        <div className="mt-10 w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <div className="mb-4">
            <label className="text-xs tracking-widest text-gray-300">JUDUL LAGU</label>
            <input value={judul} onChange={(e) => setJudul(e.target.value)} className="mt-2 w-full rounded-lg bg-black/40 border border-white/20 px-4 py-3 text-sm" placeholder="Masukkan judul lagu..." />
          </div>

          <div className="mb-4">
            <label className="text-xs tracking-widest text-gray-300">NAMA ARTIS</label>
            <input value={artis} onChange={(e) => setArtis(e.target.value)} className="mt-2 w-full rounded-lg bg-black/40 border border-white/20 px-4 py-3 text-sm" placeholder="Masukkan nama artis..." />
          </div>

          <div className="mb-6">
            <label className="text-xs tracking-widest text-gray-300">NAMA KAMU</label>
            <input value={nama} onChange={(e) => setNama(e.target.value)} className="mt-2 w-full rounded-lg bg-black/40 border border-white/20 px-4 py-3 text-sm" placeholder="Masukkan nama kamu..." />
          </div>

          <div className="flex flex-col gap-3">
            <button onClick={handleSubmit} disabled={loading} className="w-full py-3 rounded-xl font-bold tracking-widest bg-gradient-to-r from-purple-500 to-blue-500 disabled:opacity-50">
              {loading ? "MENGIRIM..." : "KIRIM REQUEST"}
            </button>

            <button onClick={() => navigate("/Request")} className="w-full py-3 rounded-xl font-bold tracking-widest border border-white/30">
              LIHAT DAFTAR REQUEST
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
