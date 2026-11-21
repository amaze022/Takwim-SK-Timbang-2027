import React, { useState, useMemo, useEffect, useRef } from 'react';
import { AktivitiTakwim, CutiSekolah } from '../types/takwim';
import { SENARAI_CUTI_2027 } from '../data/kalendarKPM2027';
import { Search, Calendar, MapPin, Tag, UserCheck, X, Sparkles, ArrowRight, Clock } from 'lucide-react';

interface CarianPantasModalProps {
  isOpen: boolean;
  onClose: () => void;
  aktivitiList: AktivitiTakwim[];
  onPilihAktiviti: (aktiviti: AktivitiTakwim) => void;
  onPilihTarikh: (tarikh: string) => void;
}

const BULAN_NAMES = [
  'Januari',
  'Februari',
  'Mac',
  'April',
  'Mei',
  'Jun',
  'Julai',
  'Ogos',
  'September',
  'Oktober',
  'November',
  'Disember',
];

export const CarianPantasModal: React.FC<CarianPantasModalProps> = ({
  isOpen,
  onClose,
  aktivitiList,
  onPilihAktiviti,
  onPilihTarikh,
}) => {
  const [kataKunci, setKataKunci] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState('Semua');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setKataKunci('');
      setKategoriFilter('Semua');
    }
  }, [isOpen]);

  // Carian aktiviti merentasi seluruh tahun 2027
  const hasilAktiviti = useMemo(() => {
    const q = kataKunci.trim().toLowerCase();
    return aktivitiList.filter((akt) => {
      const matchText =
        !q ||
        akt.nama.toLowerCase().includes(q) ||
        akt.tempat.toLowerCase().includes(q) ||
        akt.dicatatOleh.toLowerCase().includes(q) ||
        akt.penerangan.toLowerCase().includes(q) ||
        akt.sasaran.toLowerCase().includes(q) ||
        akt.tarikhMula.includes(q);

      const matchKategori = kategoriFilter === 'Semua' || akt.kategori === kategoriFilter;

      return matchText && matchKategori;
    });
  }, [aktivitiList, kataKunci, kategoriFilter]);

  // Carian cuti sekolah & cuti Sabah
  const hasilCuti = useMemo(() => {
    const q = kataKunci.trim().toLowerCase();
    if (!q) return [];
    return SENARAI_CUTI_2027.filter((c) => {
      return (
        c.nama.toLowerCase().includes(q) ||
        c.penerangan.toLowerCase().includes(q) ||
        c.jenis.toLowerCase().includes(q) ||
        c.tarikhMula.includes(q)
      );
    });
  }, [kataKunci]);

  if (!isOpen) return null;

  const cadanganKataKunci = [
    'Sukan',
    'Peperiksaan',
    'Kaamatan',
    'Mesyuarat',
    'LDP',
    'Hari Raya',
    'Bahasa',
    'Merentas Desa',
    'Penggal',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 backdrop-blur-xs p-4 pt-16 sm:pt-20 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh] animate-scaleUp">
        {/* Input Bar Carian Pantas */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-emerald-700 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={kataKunci}
            onChange={(e) => setKataKunci(e.target.value)}
            placeholder="Cari aktiviti takwim 2027 (cth: Sukan, Peperiksaan, Kaamatan, Mesyuarat)..."
            className="w-full bg-transparent border-none text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden font-medium"
          />
          {kataKunci && (
            <button
              onClick={() => setKataKunci('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2.5 py-1 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-700 transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Butang Pintas Cadangan Carian */}
        <div className="px-4 py-2.5 bg-white border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Carian Popular:
          </span>
          {cadanganKataKunci.map((kata) => (
            <button
              key={kata}
              onClick={() => setKataKunci(kata)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 transition-colors ${
                kataKunci.toLowerCase() === kata.toLowerCase()
                  ? 'bg-emerald-700 text-white font-bold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {kata}
            </button>
          ))}
        </div>

        {/* Hasil Carian */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Seksyen Cuti Jika Sepadan */}
          {hasilCuti.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Cuti Persekolahan & Sabah Ditemui ({hasilCuti.length})
              </div>
              <div className="grid grid-cols-1 gap-2">
                {hasilCuti.map((cuti) => (
                  <div
                    key={cuti.id}
                    onClick={() => {
                      onPilihTarikh(cuti.tarikhMula);
                      onClose();
                    }}
                    className="p-3 rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100/70 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-950">{cuti.nama}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 font-semibold">
                          {cuti.isSabahHoliday ? 'Cuti Sabah' : cuti.jenis}
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-800 mt-0.5">{cuti.penerangan}</p>
                      <div className="text-[10px] text-amber-700 mt-1 font-semibold">
                        Tarikh: {cuti.tarikhMula} hingga {cuti.tarikhTamat} ({cuti.bilHari} Hari)
                      </div>
                    </div>
                    <div className="text-xs font-bold text-amber-800 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Lihat Tarikh</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Seksyen Aktiviti Sekolah */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <span>Aktiviti Sekolah Ditemui ({hasilAktiviti.length})</span>
              {hasilAktiviti.length > 0 && <span>Klik untuk lompat ke aktiviti</span>}
            </div>

            {hasilAktiviti.length === 0 && hasilCuti.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl">
                <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">Tiada aktiviti ditemui bagi &ldquo;{kataKunci}&rdquo;</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Cuba cari dengan perkataan lain seperti &ldquo;Sukan&rdquo;, &ldquo;Peperiksaan&rdquo;, atau &ldquo;Mesyuarat&rdquo;.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {hasilAktiviti.map((akt) => {
                  const bulanNum = parseInt(akt.tarikhMula.split('-')[1], 10);
                  const namaBulan = BULAN_NAMES[bulanNum - 1] || '';

                  return (
                    <div
                      key={akt.id}
                      onClick={() => {
                        onPilihAktiviti(akt);
                        onClose();
                      }}
                      className="p-3 bg-white hover:bg-emerald-50/50 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 group shadow-2xs"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                            {akt.nama}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {akt.kategori}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                          <span className="flex items-center gap-1 font-semibold text-slate-700">
                            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                            {akt.tarikhMula} ({namaBulan})
                          </span>
                          {akt.tempat && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {akt.tempat}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <UserCheck className="w-3 h-3 text-slate-400" />
                            {akt.dicatatOleh}
                          </span>
                        </div>

                        {akt.penerangan && (
                          <p className="text-[11px] text-slate-600 line-clamp-1">{akt.penerangan}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 shrink-0 self-end sm:self-center opacity-90 group-hover:translate-x-0.5 transition-all">
                        <span>Buka</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500 flex items-center justify-between px-4">
          <span>Menunjukkan aktiviti dari Januari hingga Disember 2027</span>
          <span className="font-mono text-[10px] bg-slate-200 px-1.5 py-0.5 rounded">SK Timbang XBA5232</span>
        </div>
      </div>
    </div>
  );
};
