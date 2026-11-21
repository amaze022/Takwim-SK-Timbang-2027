import React, { useState } from 'react';
import { SENARAI_CUTI_2027, PENGGAL_PERSEKOLAHAN_2027 } from '../data/kalendarKPM2027';
import { CutiSekolah } from '../types/takwim';
import { Calendar, Bell, ChevronRight, MapPin, Sparkles } from 'lucide-react';

interface CutiBannerProps {
  onPilihCuti?: (cuti: CutiSekolah) => void;
}

export const CutiBanner: React.FC<CutiBannerProps> = ({ onPilihCuti }) => {
  const [filterJenis, setFilterJenis] = useState<string>('semua');
  const [bukaSenaraiCuti, setBukaSenaraiCuti] = useState(false);

  // Ambil cuti Sabah & cuti penggal penting
  const cutiSabahCount = SENARAI_CUTI_2027.filter((c) => c.isSabahHoliday).length;
  const cutiPenggalCount = SENARAI_CUTI_2027.filter((c) => c.jenis === 'Cuti Penggal KPM').length;
  const cutiPerayaanCount = SENARAI_CUTI_2027.filter((c) => c.jenis === 'Cuti Perayaan KPM').length;

  const cutiDitapis = SENARAI_CUTI_2027.filter((c) => {
    if (filterJenis === 'sabah') return c.isSabahHoliday;
    if (filterJenis === 'penggal') return c.jenis === 'Cuti Penggal KPM';
    if (filterJenis === 'perayaan') return c.jenis === 'Cuti Perayaan KPM';
    return true;
  });

  return (
    <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl shadow-lg border border-emerald-700/40 p-4 md:p-5 mb-6">
      {/* Baris Atas: Info Status Kalendar Akademik Kumpulan B (Sabah) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-emerald-800/60">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 rounded-xl border border-emerald-400/30 text-emerald-300">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-200 border border-emerald-400/40">
                KPM Kumpulan B • Sabah
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> SK Timbang Kota Belud
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white mt-1">
              Kalendar Akademik & Tarikh Penting Persekolahan 2027
            </h2>
          </div>
        </div>

        {/* Butang Pintas Ringkasan */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setFilterJenis('sabah');
              setBukaSenaraiCuti(true);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${
              filterJenis === 'sabah' && bukaSenaraiCuti
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                : 'bg-emerald-950/60 hover:bg-emerald-800/60 text-amber-200 border-amber-500/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Cuti Negeri Sabah ({cutiSabahCount})
          </button>

          <button
            onClick={() => {
              setFilterJenis('penggal');
              setBukaSenaraiCuti(true);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${
              filterJenis === 'penggal' && bukaSenaraiCuti
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                : 'bg-emerald-950/60 hover:bg-emerald-800/60 text-emerald-200 border-emerald-500/40'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Cuti Penggal ({cutiPenggalCount})
          </button>

          <button
            onClick={() => {
              setFilterJenis('perayaan');
              setBukaSenaraiCuti(true);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${
              filterJenis === 'perayaan' && bukaSenaraiCuti
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                : 'bg-emerald-950/60 hover:bg-emerald-800/60 text-pink-200 border-pink-500/40'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            Tambahan KPM ({cutiPerayaanCount})
          </button>

          <button
            onClick={() => setBukaSenaraiCuti(!bukaSenaraiCuti)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1 ml-auto"
          >
            {bukaSenaraiCuti ? 'Tutup Senarai' : 'Lihat Semua Cuti'}
            <ChevronRight className={`w-3.5 h-3.5 transform transition-transform ${bukaSenaraiCuti ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </div>

      {/* Ringkasan Pantas 4 Penggal & Cuti Utama */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-3">
        <div className="bg-slate-900/60 rounded-xl p-2.5 border border-emerald-800/50 hover:border-emerald-500/50 transition-all">
          <div className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wide">Penggal 1 (Bahagian 1)</div>
          <div className="text-xs text-slate-200 font-medium mt-0.5">04 Jan - 05 Mac 2027</div>
          <div className="text-[10px] text-amber-300 mt-1 flex items-center justify-between">
            <span>39 Hari Persekolahan</span>
            <span className="bg-emerald-950 px-1.5 py-0.2 rounded text-[9px] border border-emerald-700">9 Mggu</span>
          </div>
        </div>

        <div className="bg-amber-950/40 rounded-xl p-2.5 border border-amber-700/40 hover:border-amber-500/50 transition-all">
          <div className="text-[11px] font-semibold text-amber-300 uppercase tracking-wide">Cuti Penggal 1</div>
          <div className="text-xs text-white font-medium mt-0.5">06 Mac - 14 Mac 2027</div>
          <div className="text-[10px] text-amber-200 mt-1 flex items-center justify-between">
            <span>9 Hari (1 Minggu)</span>
            <span className="bg-amber-900/80 px-1.5 py-0.2 rounded text-[9px] text-amber-100">Aidilfitri</span>
          </div>
        </div>

        <div className="bg-orange-950/40 rounded-xl p-2.5 border border-orange-700/40 hover:border-orange-500/50 transition-all">
          <div className="text-[11px] font-semibold text-orange-300 uppercase tracking-wide">Cuti Pertengahan Tahun</div>
          <div className="text-xs text-white font-medium mt-0.5">22 Mei - 06 Jun 2027</div>
          <div className="text-[10px] text-orange-200 mt-1 flex items-center justify-between">
            <span>16 Hari (2 Minggu)</span>
            <span className="bg-orange-900/80 px-1.5 py-0.2 rounded text-[9px] text-yellow-200 font-semibold">Tadau Kaamatan</span>
          </div>
        </div>

        <div className="bg-rose-950/40 rounded-xl p-2.5 border border-rose-700/40 hover:border-rose-500/50 transition-all">
          <div className="text-[11px] font-semibold text-rose-300 uppercase tracking-wide">Cuti Akhir Persekolahan</div>
          <div className="text-xs text-white font-medium mt-0.5">04 Dis - 31 Dis 2027</div>
          <div className="text-[10px] text-rose-200 mt-1 flex items-center justify-between">
            <span>28 Hari (4 Minggu)</span>
            <span className="bg-rose-900/80 px-1.5 py-0.2 rounded text-[9px] text-rose-100">Krismas Sabah</span>
          </div>
        </div>
      </div>

      {/* Paparan Terperinci Dropdown Cuti Apabila Dibuka */}
      {bukaSenaraiCuti && (
        <div className="mt-4 pt-4 border-t border-emerald-800/60 animate-fadeIn">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              Jadual Tarikh Cuti Persekolahan & Cuti Sabah 2027 ({cutiDitapis.length} rekod)
            </h3>
            <div className="flex gap-1 text-[11px]">
              <button
                onClick={() => setFilterJenis('semua')}
                className={`px-2 py-0.5 rounded ${filterJenis === 'semua' ? 'bg-emerald-600 text-white' : 'bg-emerald-950/50 text-slate-300'}`}
              >
                Semua
              </button>
              <button
                onClick={() => setFilterJenis('sabah')}
                className={`px-2 py-0.5 rounded ${filterJenis === 'sabah' ? 'bg-emerald-600 text-white' : 'bg-emerald-950/50 text-slate-300'}`}
              >
                Khas Sabah
              </button>
              <button
                onClick={() => setFilterJenis('penggal')}
                className={`px-2 py-0.5 rounded ${filterJenis === 'penggal' ? 'bg-emerald-600 text-white' : 'bg-emerald-950/50 text-slate-300'}`}
              >
                Penggal KPM
              </button>
              <button
                onClick={() => setFilterJenis('perayaan')}
                className={`px-2 py-0.5 rounded ${filterJenis === 'perayaan' ? 'bg-emerald-600 text-white' : 'bg-emerald-950/50 text-slate-300'}`}
              >
                Cuti Tambahan KPM
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
            {cutiDitapis.map((cuti) => (
              <div
                key={cuti.id}
                onClick={() => onPilihCuti && onPilihCuti(cuti)}
                className="bg-slate-900/80 hover:bg-slate-800/90 rounded-lg p-2.5 border border-slate-700/60 hover:border-emerald-500/50 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-1.5">
                    <span className="text-xs font-bold text-white line-clamp-1">{cuti.nama}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-semibold whitespace-nowrap ${
                        cuti.isSabahHoliday ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' : 'bg-emerald-400/20 text-emerald-300'
                      }`}
                    >
                      {cuti.isSabahHoliday ? 'Cuti Sabah' : cuti.jenis}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">{cuti.penerangan}</p>
                </div>
                <div className="flex items-center justify-between text-[11px] text-emerald-300 font-medium mt-2 pt-1.5 border-t border-slate-800">
                  <span>
                    {cuti.tarikhMula === cuti.tarikhTamat ? cuti.tarikhMula : `${cuti.tarikhMula} hingga ${cuti.tarikhTamat}`}
                  </span>
                  <span className="bg-emerald-950 px-1.5 py-0.5 rounded text-[10px] text-white">
                    {cuti.bilHari} {cuti.bilHari > 1 ? 'Hari' : 'Hari'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
