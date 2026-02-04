import React from "react";
import { useNavigate } from "react-router-dom";

export const Qris = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      {/* Card */}
      <div className="w-full max-w-md rounded-3xl bg-gradient-to-b from-white/5 to-black border border-white/10 shadow-[0_0_80px_rgba(168,85,247,0.15)] p-6 text-white">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-green-500 flex items-center justify-center shadow-lg">❤️</div>
        </div>

        {/* Title */}
        <h1 className="text-center text-2xl font-extrabold tracking-widest">PAK ARIF BAND</h1>

        <p className="mt-2 text-center text-sm text-gray-400">Scan QRIS atau screenshot untuk memberikan apresiasi</p>

        <p className="mt-1 text-center text-[11px] tracking-widest text-gray-500">NOMINAL BEBAS SESUAI KEINGINAN</p>

        {/* QR Card */}
        <div className="mt-6 rounded-2xl bg-white p-3 shadow-[0_0_40px_rgba(236,72,153,0.35)]">
          <img src="/qris.png" alt="QRIS" className="w-full rounded-xl" />
        </div>

        {/* Button */}
        <button onClick={() => navigate("/request")} className="mt-8 w-full py-4 rounded-full font-bold tracking-widest bg-gradient-to-r from-purple-500 to-green-500 hover:opacity-90 transition">
          ☰ LIHAT DAFTAR REQUEST
        </button>
      </div>
    </div>
  );
};
