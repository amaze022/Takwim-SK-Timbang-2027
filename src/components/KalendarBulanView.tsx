import React, { useState } from 'react';
import { AktivitiTakwim, CutiSekolah, PenggunaGuru } from '../types/takwim';
import { SENARAI_CUTI_2027 } from '../data/kalendarKPM2027';
import { ChevronLeft, ChevronRight, Plus, MapPin, Clock, Tag, UserCheck, ShieldAlert, Sparkles, Search, X } from 'lucide-react';

interface KalendarBulanViewProps {
  aktivitiList: AktivitiTakwim[];
  currentUser: PenggunaGuru;
  onTambahAktiviti: (tarikhAwal?: string) => void;
  onSuntingAktiviti: (aktiviti: AktivitiTakwim) => void;
  onPadamAktiviti: (id: string, nama: string) => void;
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

const HARI_NAMES = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'];

export const KalendarBulanView: React.FC<KalendarBulanViewProps> = ({
  aktivitiList,
  currentUser,
  onTambahAktiviti,
  onSuntingAktiviti,
  onPadamAktiviti,
}) => {
  // Tahun tetap 2027 seperti yang diminta oleh pengguna
  const [bulanIndex, setBulanIndex] = useState<number>(0); // 0 = Jan, 11 = Dis
  const [tarikhTerpilih, setTarikhTerpilih] = useState<string>('2027-01-04');

  const tahun = 2027;

  // Kiraan hari dalam bulan
  const daysInMonth = new Date(tahun, bulanIndex + 1, 0).getDate();
  const firstDayOfWeek = new Date(tahun, bulanIndex, 1).getDay(); // 0 = Ahad

  // Format tarikh YYYY-MM-DD
  const formatTarikhStr = (dayNum: number) => {
    const m = String(bulanIndex + 1).padStart(2, '0');
    const d = String(dayNum).padStart(2, '0');
    return `${tahun}-${m}-${d}`;
  };

  // Semak jika sesuatu tarikh adalah cuti
  const getCutiForDate = (dateStr: string): CutiSekolah[] => {
    return SENARAI_CUTI_2027.filter((c) => {
      return dateStr >= c.tarikhMula && dateStr <= c.tarikhTamat;
    });
  };

  // Semak aktiviti pada sesuatu tarikh
  const getAktivitiForDate = (dateStr: string): AktivitiTakwim[] => {
    return aktivitiList.filter((a) => {
      return dateStr >= a.tarikhMula && dateStr <= a.tarikhTamat;
    });
  };

  // Dapatkan aktiviti & cuti untuk tarikh yang sedang dipilih
  const cutiHariTerpilih = getCutiForDate(tarikhTerpilih);
  const aktivitiHariTerpilih = getAktivitiForDate(tarikhTerpilih);

  // Semak kebenaran mengedit aktiviti
  const canEditActivity = (akt: AktivitiTakwim) => {
    if (['Pentadbir', 'Setiausaha Takwim'].includes(currentUser.peranan)) return true;
    if (currentUser.peranan === 'Penyelaras HEM' && akt.kategori === 'Hal Ehwal Murid (HEM)') return true;
    if (currentUser.peranan === 'Penyelaras Kokurikulum' && akt.kategori === 'Kokurikulum') return true;
    if (currentUser.peranan === 'Guru Panitia' && ['Kurikulum', 'Peperiksaan & Pentaksiran'].includes(akt.kategori)) return true;
    if (akt.dicatatOleh === currentUser.nama || akt.guruBertanggungjawabId === currentUser.id) return true;
    return false;
  };

  const getKategoriColor = (kat: string) => {
    switch (kat) {
      case 'Kurikulum':
        return 'bg-blue-600 text-white';
      case 'Hal Ehwal Murid (HEM)':
        return 'bg-emerald-600 text-white';
      case 'Kokurikulum':
        return 'bg-amber-600 text-white';
      case 'Pentadbiran & Guru':
        return 'bg-purple-600 text-white';
      case 'Peperiksaan & Pentaksiran':
        return 'bg-rose-600 text-white';
      case 'Sambutan / Khas':
        return 'bg-indigo-600 text-white';
      case 'LDP / PLC':
        return 'bg-teal-600 text-white';
      default:
        return 'bg-slate-600 text-white';
    }
  };

  // Carian Pantas Dalam Kalendar
  const [carianKalendar, setCarianKalendar] = useState('');
  const [bukaHasilCarian, setBukaHasilCarian] = useState(false);

  // Hasil Carian merentas semua bulan
  const hasilCarianKalendar = aktivitiList.filter((a) => {
    if (!carianKalendar.trim()) return false;
    const q = carianKalendar.toLowerCase();
    return (
      a.nama.toLowerCase().includes(q) ||
      a.tempat.toLowerCase().includes(q) ||
      a.kategori.toLowerCase().includes(q) ||
      a.dicatatOleh.toLowerCase().includes(q) ||
      a.penerangan.toLowerCase().includes(q)
    );
  });

  const lompatKeTarikh = (tarikhStr: string) => {
    const bulan = parseInt(tarikhStr.split('-')[1], 10) - 1;
    setBulanIndex(bulan);
    setTarikhTerpilih(tarikhStr);
    setCarianKalendar('');
    setBukaHasilCarian(false);
  };

  return (
    <div className="space-y-4">
      {/* Bar Carian Pantas Kalendar & Navigasi */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Kotak Input Carian Pantas Tanpa Perlu Scroll */}
          <div className="relative flex-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-700" />
              <input
                type="text"
                placeholder="Cari aktiviti takwim terus ke tarikhnya (cth: Sukan, Peperiksaan, Kaamatan, Mesyuarat)..."
                value={carianKalendar}
                onChange={(e) => {
                  setCarianKalendar(e.target.value);
                  setBukaHasilCarian(true);
                }}
                onFocus={() => {
                  if (carianKalendar.trim()) setBukaHasilCarian(true);
                }}
                className="w-full pl-10 pr-9 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-emerald-600 focus:ring-1 focus:ring-emerald-600 font-medium text-slate-800"
              />
              {carianKalendar && (
                <button
                  onClick={() => {
                    setCarianKalendar('');
                    setBukaHasilCarian(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Dropdown Hasil Carian Segera */}
            {bukaHasilCarian && carianKalendar.trim() && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-30 max-h-72 overflow-y-auto animate-fadeIn">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-100">
                  <span>Ditemui {hasilCarianKalendar.length} aktiviti sepadan:</span>
                  <span className="text-[10px] text-emerald-700">Klik untuk lompat terus ke kalendar</span>
                </div>

                {hasilCarianKalendar.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">
                    Tiada aktiviti ditemui bagi &ldquo;{carianKalendar}&rdquo;
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {hasilCarianKalendar.map((akt) => {
                      const blnNum = parseInt(akt.tarikhMula.split('-')[1], 10);
                      const namaBln = BULAN_NAMES[blnNum - 1];

                      return (
                        <div
                          key={akt.id}
                          onClick={() => lompatKeTarikh(akt.tarikhMula)}
                          className="p-2.5 hover:bg-emerald-50/70 rounded-xl cursor-pointer flex items-center justify-between gap-3 transition-colors"
                        >
                          <div>
                            <div className="font-bold text-xs text-slate-900">{akt.nama}</div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                              <span className="font-semibold text-emerald-800">
                                {akt.tarikhMula} ({namaBln})
                              </span>
                              <span>•</span>
                              <span>{akt.tempat}</span>
                              <span>•</span>
                              <span className="text-slate-400">{akt.kategori}</span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg shrink-0">
                            Lompat ke Tarikh ➔
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pengemudian Bulan & Butang Tindakan */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
              <button
                onClick={() => setBulanIndex((prev) => (prev > 0 ? prev - 1 : 11))}
                className="p-1.5 hover:bg-white rounded-lg transition-colors text-slate-700 hover:shadow-xs"
                title="Bulan sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="w-32 text-center font-bold text-slate-800 text-xs sm:text-sm">
                {BULAN_NAMES[bulanIndex]} 2027
              </span>
              <button
                onClick={() => setBulanIndex((prev) => (prev < 11 ? prev + 1 : 0))}
                className="p-1.5 hover:bg-white rounded-lg transition-colors text-slate-700 hover:shadow-xs"
                title="Bulan seterusnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Pemilih Pantas Bulan */}
            <select
              value={bulanIndex}
              onChange={(e) => setBulanIndex(Number(e.target.value))}
              className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-slate-700 focus:outline-emerald-600"
            >
              {BULAN_NAMES.map((nama, idx) => (
                <option key={nama} value={idx}>
                  {nama} 2027
                </option>
              ))}
            </select>

            <button
              onClick={() => onTambahAktiviti(tarikhTerpilih)}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Tambah Aktiviti
            </button>
          </div>
        </div>

        {/* Tag Carian Pantas (Satu Klik ke Program Penting) */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-2 border-t border-slate-100 text-[11px]">
          <span className="text-slate-400 font-bold uppercase tracking-wider shrink-0 mr-1">Lompat Pantas:</span>
          {[
            { label: 'Sukan Tahunan', query: 'Sukan' },
            { label: 'Peperiksaan UASA', query: 'UASA' },
            { label: 'Pesta Kaamatan', query: 'Kaamatan' },
            { label: 'Mesyuarat Guru / PIBG', query: 'Mesyuarat' },
            { label: 'LDP / PLC Guru', query: 'LDP' },
            { label: 'Bulan Bahasa & HIP', query: 'Bahasa' },
            { label: 'Hari Orientasi', query: 'Orientasi' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setCarianKalendar(item.query);
                setBukaHasilCarian(true);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 border border-slate-200 transition-colors whitespace-nowrap font-medium"
            >
              🔍 {item.label}
            </button>
          ))}
        </div>

        {/* Petunjuk Warna */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Cuti Penggal KPM
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Cuti Sabah
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Aktiviti Sekolah
            </span>
          </div>
          <span className="text-[10px] text-slate-400">Klik mana-mana hari untuk melihat atau menambah aktiviti</span>
        </div>
      </div>

      {/* Grid Kalendar Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Kolum Kiri (3/4): Kotak Kalendar */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header Hari */}
          <div className="grid grid-cols-7 bg-slate-100/80 border-b border-slate-200 text-center font-bold text-xs text-slate-700 py-2.5">
            {HARI_NAMES.map((hari, i) => (
              <div key={hari} className={i === 0 || i === 6 ? 'text-rose-600' : 'text-slate-700'}>
                {hari}
              </div>
            ))}
          </div>

          {/* Grid Hari */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100">
            {/* Hari kosong sebelum hari pertama */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[105px] bg-slate-50/50 p-1.5 opacity-40"></div>
            ))}

            {/* Hari-hari dalam bulan */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = formatTarikhStr(dayNum);
              const isSelected = dateStr === tarikhTerpilih;
              const cutiList = getCutiForDate(dateStr);
              const dayAktiviti = getAktivitiForDate(dateStr);
              const dayOfWeek = (firstDayOfWeek + i) % 7;
              const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

              const hasCutiSabah = cutiList.some((c) => c.isSabahHoliday);
              const hasCutiPenggal = cutiList.some((c) => c.jenis === 'Cuti Penggal KPM');

              return (
                <div
                  key={dateStr}
                  onClick={() => setTarikhTerpilih(dateStr)}
                  className={`min-h-[105px] p-1.5 transition-all cursor-pointer flex flex-col justify-between relative group ${
                    isSelected ? 'ring-2 ring-emerald-600 bg-emerald-50/40 z-10' : 'hover:bg-slate-50'
                  } ${hasCutiPenggal ? 'bg-amber-50/60' : hasCutiSabah ? 'bg-emerald-50/40' : isWeekend ? 'bg-slate-50/30' : 'bg-white'}`}
                >
                  {/* Bahagian Atas Hari: Nombor & Indikator Cuti */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        isSelected
                          ? 'bg-emerald-700 text-white'
                          : isWeekend
                          ? 'text-rose-600'
                          : 'text-slate-800'
                      }`}
                    >
                      {dayNum}
                    </span>

                    {/* Penanda Cuti Khas Sabah */}
                    {hasCutiSabah && (
                      <span className="text-[9px] font-bold px-1 rounded bg-emerald-600 text-white shadow-xs" title="Cuti Negeri Sabah">
                        Sabah
                      </span>
                    )}
                    {hasCutiPenggal && !hasCutiSabah && (
                      <span className="text-[9px] font-bold px-1 rounded bg-amber-500 text-slate-950" title="Cuti Penggal KPM">
                        Penggal
                      </span>
                    )}
                  </div>

                  {/* Penunjuk Cuti (Jika Ada) */}
                  {cutiList.length > 0 && (
                    <div className="my-1">
                      {cutiList.slice(0, 1).map((c) => (
                        <div
                          key={c.id}
                          className={`text-[9px] font-semibold px-1 py-0.5 rounded truncate border ${
                            c.isSabahHoliday
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : 'bg-amber-100 text-amber-900 border-amber-300'
                          }`}
                          title={`${c.nama} - ${c.penerangan}`}
                        >
                          🎉 {c.nama}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Senarai Aktiviti Sekolah */}
                  <div className="space-y-1 mt-auto">
                    {dayAktiviti.slice(0, 2).map((akt) => (
                      <div
                        key={akt.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setTarikhTerpilih(dateStr);
                          onSuntingAktiviti(akt);
                        }}
                        className={`text-[9px] font-medium px-1 py-0.5 rounded truncate shadow-xs flex items-center gap-1 ${getKategoriColor(
                          akt.kategori
                        )} hover:opacity-90`}
                        title={`${akt.nama} (${akt.kategori}) - ${akt.tempat}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0"></span>
                        <span className="truncate">{akt.nama}</span>
                      </div>
                    ))}

                    {dayAktiviti.length > 2 && (
                      <div className="text-[9px] text-slate-500 font-semibold text-center bg-slate-100 rounded py-0.2">
                        +{dayAktiviti.length - 2} lagi aktiviti
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Kolum Kanan (1/4): Perincian Tarikh Terpilih */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Perincian Tarikh</span>
                <h3 className="text-base font-bold text-slate-900">
                  {new Date(tarikhTerpilih).toLocaleDateString('ms-MY', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </h3>
              </div>
              <button
                onClick={() => onTambahAktiviti(tarikhTerpilih)}
                className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors"
                title="Tambah aktiviti pada tarikh ini"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Maklumat Cuti Pada Tarikh Ini */}
            <div className="mt-3 space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Cuti / Perayaan
              </h4>
              {cutiHariTerpilih.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Hari persekolahan biasa (Tiada cuti rasmi).</p>
              ) : (
                cutiHariTerpilih.map((cuti) => (
                  <div
                    key={cuti.id}
                    className={`p-2.5 rounded-xl border text-xs ${
                      cuti.isSabahHoliday
                        ? 'bg-amber-50 border-amber-300 text-amber-900'
                        : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>{cuti.nama}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white shadow-xs">
                        {cuti.isSabahHoliday ? 'Cuti Sabah' : 'KPM'}
                      </span>
                    </div>
                    <p className="text-[11px] mt-1 text-slate-600">{cuti.penerangan}</p>
                    <div className="text-[10px] font-semibold mt-1.5 text-slate-500">
                      Tempoh: {cuti.tarikhMula} hingga {cuti.tarikhTamat} ({cuti.bilHari} hari)
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Senarai Aktiviti Pada Tarikh Ini */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Aktiviti Dijadualkan ({aktivitiHariTerpilih.length})
                </h4>
              </div>

              {aktivitiHariTerpilih.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl">
                  <p className="text-xs text-slate-400 mb-2">Tiada aktiviti dijadualkan.</p>
                  <button
                    onClick={() => onTambahAktiviti(tarikhTerpilih)}
                    className="text-xs text-emerald-700 font-semibold hover:underline"
                  >
                    + Catat Aktiviti Baharu
                  </button>
                </div>
              ) : (
                aktivitiHariTerpilih.map((akt) => (
                  <div
                    key={akt.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-emerald-400 transition-all space-y-2 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900">{akt.nama}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${getKategoriColor(akt.kategori)}`}>
                        {akt.kategori}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{akt.tempat}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          {akt.masaMula} - {akt.masaTamat}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">Oleh: {akt.dicatatOleh}</span>
                      </div>
                    </div>

                    {akt.penerangan && (
                      <p className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-100">
                        {akt.penerangan}
                      </p>
                    )}

                    {/* Butang Tindakan Jika Mempunyai Akses */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                      <span className="text-[10px] text-slate-400 font-medium">Status: {akt.status}</span>
                      <div className="flex items-center gap-2">
                        {canEditActivity(akt) ? (
                          <>
                            <button
                              onClick={() => onSuntingAktiviti(akt)}
                              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                            >
                              Sunting
                            </button>
                            {['Pentadbir', 'Setiausaha Takwim'].includes(currentUser.peranan) && (
                              <button
                                onClick={() => onPadamAktiviti(akt.id, akt.nama)}
                                className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
                              >
                                Padam
                              </button>
                            )}
                          </>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Lihat sahaja</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
