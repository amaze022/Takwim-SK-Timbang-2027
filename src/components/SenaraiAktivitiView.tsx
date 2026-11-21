import React, { useState, useMemo } from 'react';
import { AktivitiTakwim, KategoriAktiviti, PenggunaGuru, StatusAktiviti } from '../types/takwim';
import {
  Search,
  Filter,
  Download,
  Printer,
  Edit2,
  Trash2,
  Calendar,
  MapPin,
  Clock,
  User,
  Plus,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Smartphone,
} from 'lucide-react';

interface SenaraiAktivitiViewProps {
  aktivitiList: AktivitiTakwim[];
  currentUser: PenggunaGuru;
  onTambahAktiviti: () => void;
  onSuntingAktiviti: (aktiviti: AktivitiTakwim) => void;
  onPadamAktiviti: (id: string, nama: string) => void;
  onEksportCSV: () => void;
  onBukaIntegrasiModal?: () => void;
}

const KATEGORI_OPTIONS: Array<KategoriAktiviti | 'Semua'> = [
  'Semua',
  'Kurikulum',
  'Hal Ehwal Murid (HEM)',
  'Kokurikulum',
  'Pentadbiran & Guru',
  'Peperiksaan & Pentaksiran',
  'Sambutan / Khas',
  'LDP / PLC',
];

const BULAN_OPTIONS = [
  { label: 'Semua Bulan', val: '' },
  { label: 'Januari', val: '01' },
  { label: 'Februari', val: '02' },
  { label: 'Mac', val: '03' },
  { label: 'April', val: '04' },
  { label: 'Mei', val: '05' },
  { label: 'Jun', val: '06' },
  { label: 'Julai', val: '07' },
  { label: 'Ogos', val: '08' },
  { label: 'September', val: '09' },
  { label: 'Oktober', val: '10' },
  { label: 'November', val: '11' },
  { label: 'Disember', val: '12' },
];

export const SenaraiAktivitiView: React.FC<SenaraiAktivitiViewProps> = ({
  aktivitiList,
  currentUser,
  onTambahAktiviti,
  onSuntingAktiviti,
  onPadamAktiviti,
  onEksportCSV,
  onBukaIntegrasiModal,
}) => {
  const [carian, setCarian] = useState('');
  const [kategoriTerpilih, setKategoriTerpilih] = useState<string>('Semua');
  const [bulanTerpilih, setBulanTerpilih] = useState<string>('');
  const [statusTerpilih, setStatusTerpilih] = useState<string>('Semua');
  const [susunan, setSusunan] = useState<'tarikh_asc' | 'tarikh_desc' | 'nama'>('tarikh_asc');

  // Filter aktiviti
  const aktivitiDitapis = useMemo(() => {
    return aktivitiList
      .filter((akt) => {
        // Carian teks
        const query = carian.toLowerCase();
        const matchCarian =
          !query ||
          akt.nama.toLowerCase().includes(query) ||
          akt.tempat.toLowerCase().includes(query) ||
          akt.dicatatOleh.toLowerCase().includes(query) ||
          akt.penerangan.toLowerCase().includes(query);

        // Kategori
        const matchKategori = kategoriTerpilih === 'Semua' || akt.kategori === kategoriTerpilih;

        // Bulan
        const matchBulan = !bulanTerpilih || akt.tarikhMula.startsWith(`2027-${bulanTerpilih}`);

        // Status
        const matchStatus = statusTerpilih === 'Semua' || akt.status === statusTerpilih;

        return matchCarian && matchKategori && matchBulan && matchStatus;
      })
      .sort((a, b) => {
        if (susunan === 'tarikh_asc') return a.tarikhMula.localeCompare(b.tarikhMula);
        if (susunan === 'tarikh_desc') return b.tarikhMula.localeCompare(a.tarikhMula);
        return a.nama.localeCompare(b.nama);
      });
  }, [aktivitiList, carian, kategoriTerpilih, bulanTerpilih, statusTerpilih, susunan]);

  // Semakan kebenaran sunting mengikut peranan
  const canEditActivity = (akt: AktivitiTakwim) => {
    if (['Pentadbir', 'Setiausaha Takwim'].includes(currentUser.peranan)) return true;
    if (currentUser.peranan === 'Penyelaras HEM' && akt.kategori === 'Hal Ehwal Murid (HEM)') return true;
    if (currentUser.peranan === 'Penyelaras Kokurikulum' && akt.kategori === 'Kokurikulum') return true;
    if (currentUser.peranan === 'Guru Panitia' && ['Kurikulum', 'Peperiksaan & Pentaksiran'].includes(akt.kategori)) return true;
    if (akt.dicatatOleh === currentUser.nama || akt.guruBertanggungjawabId === currentUser.id) return true;
    return false;
  };

  const getKategoriBadge = (kategori: string) => {
    switch (kategori) {
      case 'Kurikulum':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Hal Ehwal Murid (HEM)':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Kokurikulum':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Pentadbiran & Guru':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Peperiksaan & Pentaksiran':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Sambutan / Khas':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'LDP / PLC':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusBadge = (status: StatusAktiviti) => {
    switch (status) {
      case 'Selesai':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Sedang Berlangsung':
        return 'bg-amber-100 text-amber-800 border-amber-200 animate-pulse';
      case 'Ditunda':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const cetakHalaman = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Bar Carian & Penapis */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Kotak Carian */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari aktiviti, tempat, atau pegawai pencatat..."
              value={carian}
              onChange={(e) => setCarian(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all text-slate-800"
            />
          </div>

          {/* Butang Tindakan: Tambah & Eksport */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onTambahAktiviti}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              Catat Aktiviti Baharu
            </button>

            <button
              onClick={onEksportCSV}
              className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
              title="Muat turun format TAKWIM_SK_TIMBANG_2027.csv"
            >
              <Download className="w-4 h-4 text-emerald-700" />
              Eksport CSV
            </button>

            {onBukaIntegrasiModal && (
              <button
                onClick={onBukaIntegrasiModal}
                className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
                title="Masukkan aktiviti dan penggera ke kalendar telefon anda"
              >
                <Smartphone className="w-4 h-4 text-emerald-700" />
                Segerak Telefon (.ics)
              </button>
            )}

            <button
              onClick={cetakHalaman}
              className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
              title="Cetak Takwim Sekolah 2027"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              Cetak Takwim
            </button>
          </div>
        </div>

        {/* Baris Filter Dropdown */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5" /> Penapis:
          </div>

          {/* Filter Kategori */}
          <select
            value={kategoriTerpilih}
            onChange={(e) => setKategoriTerpilih(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium text-xs focus:outline-emerald-600"
          >
            {KATEGORI_OPTIONS.map((kat) => (
              <option key={kat} value={kat}>
                Kategori: {kat}
              </option>
            ))}
          </select>

          {/* Filter Bulan */}
          <select
            value={bulanTerpilih}
            onChange={(e) => setBulanTerpilih(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium text-xs focus:outline-emerald-600"
          >
            {BULAN_OPTIONS.map((b) => (
              <option key={b.val} value={b.val}>
                Bulan: {b.label}
              </option>
            ))}
          </select>

          {/* Filter Status */}
          <select
            value={statusTerpilih}
            onChange={(e) => setStatusTerpilih(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium text-xs focus:outline-emerald-600"
          >
            <option value="Semua">Semua Status</option>
            <option value="Dirancang">Dirancang</option>
            <option value="Sedang Berlangsung">Sedang Berlangsung</option>
            <option value="Selesai">Selesai</option>
            <option value="Ditunda">Ditunda</option>
          </select>

          {/* Susunan */}
          <select
            value={susunan}
            onChange={(e) => setSusunan(e.target.value as any)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium text-xs ml-auto focus:outline-emerald-600"
          >
            <option value="tarikh_asc">Susun: Tarikh Terawal</option>
            <option value="tarikh_desc">Susun: Tarikh Terakhir</option>
            <option value="nama">Susun: Nama Aktiviti</option>
          </select>
        </div>
      </div>

      {/* Ringkasan Bilangan Aktiviti */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Menunjukkan <strong className="text-slate-800">{aktivitiDitapis.length}</strong> daripada {aktivitiList.length}{' '}
          aktiviti akademik SK Timbang 2027
        </span>
        {(carian || kategoriTerpilih !== 'Semua' || bulanTerpilih || statusTerpilih !== 'Semua') && (
          <button
            onClick={() => {
              setCarian('');
              setKategoriTerpilih('Semua');
              setBulanTerpilih('');
              setStatusTerpilih('Semua');
            }}
            className="text-emerald-700 hover:underline font-semibold"
          >
            Set Semula Penapis
          </button>
        )}
      </div>

      {/* Jadual Aktiviti / Senarai Interaktif */}
      {aktivitiDitapis.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800 mb-1">Tiada Aktiviti Dijumpai</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Cuba tukar kata kunci carian atau tetapkan semula penapis untuk melihat rekod takwim yang lain.
          </p>
          <button
            onClick={onTambahAktiviti}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Tambah Aktiviti Sekarang
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Tarikh & Masa</th>
                  <th className="px-4 py-3">Nama Aktiviti</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Tempat & Sasaran</th>
                  <th className="px-4 py-3">Dicatat Oleh</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {aktivitiDitapis.map((akt) => {
                  const editable = canEditActivity(akt);

                  return (
                    <tr key={akt.id} className="hover:bg-slate-50/80 transition-colors group">
                      {/* Tarikh & Masa */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>{akt.tarikhMula}</span>
                          {akt.tarikhTamat !== akt.tarikhMula && (
                            <span className="text-slate-400 font-normal">→ {akt.tarikhTamat}</span>
                          )}
                        </div>
                        {akt.masaMula && (
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 ml-5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>
                              {akt.masaMula} - {akt.masaTamat || 'Selesai'}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Nama Aktiviti & Penerangan */}
                      <td className="px-4 py-3.5 max-w-xs">
                        <div className="font-bold text-slate-900 text-xs">{akt.nama}</div>
                        {akt.penerangan && (
                          <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{akt.penerangan}</div>
                        )}
                        <div className="text-[9px] text-slate-400 mt-1 font-mono">{akt.id}</div>
                      </td>

                      {/* Kategori */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getKategoriBadge(akt.kategori)}`}>
                          {akt.kategori}
                        </span>
                      </td>

                      {/* Tempat & Sasaran */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1 text-slate-800 font-medium">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{akt.tempat || 'SK Timbang'}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">Sasaran: {akt.sasaran}</div>
                      </td>

                      {/* Dicatat Oleh */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{akt.dicatatOleh}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {akt.updatedAt ? new Date(akt.updatedAt).toLocaleDateString('ms-MY') : ''}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(akt.status)}`}>
                          {akt.status}
                        </span>
                      </td>

                      {/* Tindakan */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {editable ? (
                            <>
                              <button
                                onClick={() => onSuntingAktiviti(akt)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Sunting Aktiviti"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              {['Pentadbir', 'Setiausaha Takwim'].includes(currentUser.peranan) && (
                                <button
                                  onClick={() => onPadamAktiviti(akt.id, akt.nama)}
                                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                  title="Padam Aktiviti"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">Lihat</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
