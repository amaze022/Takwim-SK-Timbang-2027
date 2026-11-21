import React, { useState } from 'react';
import { PenggunaGuru, PerananPengguna } from '../types/takwim';
import {
  Shield,
  User,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Lock,
  Plus,
  Edit2,
  Trash2,
  Check,
  UserPlus,
} from 'lucide-react';

interface PengurusanPerananModalProps {
  isOpen: boolean;
  onClose: () => void;
  senaraiGuru: PenggunaGuru[];
  currentUser: PenggunaGuru;
  onKemasKiniPeranan: (guruId: string, perananBaru: PerananPengguna) => Promise<void>;
  onTambahGuru?: (guruData: Partial<PenggunaGuru>) => Promise<void>;
  onKemaskiniProfilGuru?: (guruId: string, guruData: Partial<PenggunaGuru>) => Promise<void>;
  onPadamGuru?: (guruId: string, namaGuru: string) => Promise<void>;
}

const PERANAN_LIST: { id: PerananPengguna; label: string; desc: string; color: string }[] = [
  {
    id: 'Pentadbir',
    label: 'Pentadbir Utama (GB / PK)',
    desc: 'Kuasa penuh: Urus peranan semua guru, tambah/padam mana-mana aktiviti, eksport/import & set semula takwim.',
    color: 'bg-rose-100 text-rose-800 border-rose-300',
  },
  {
    id: 'Setiausaha Takwim',
    label: 'Setiausaha Takwim & Kurikulum',
    desc: 'Kuasa menyeluruh bagi aktiviti takwim: Mengatur, menambah, menyunting semua aktiviti akademik dan sekolah.',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
  },
  {
    id: 'Penyelaras HEM',
    label: 'Penyelaras Hal Ehwal Murid (HEM)',
    desc: 'Kuasa mengurus & mengemaskini semua aktiviti di bawah unit Hal Ehwal Murid, kebajikan, dan disiplin.',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  {
    id: 'Penyelaras Kokurikulum',
    label: 'Penyelaras Kokurikulum',
    desc: 'Kuasa mengurus & mengemaskini aktiviti kokurikulum, sukan, 1M1S, kelab & persatuan, dan unit beruniform.',
    color: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  {
    id: 'Guru Panitia',
    label: 'Ketua / Guru Panitia',
    desc: 'Kuasa mencatat dan menyunting aktiviti unit kurikulum, peperiksaan/pentaksiran, dan aktiviti panitia masing-masing.',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  {
    id: 'Guru Biasa',
    label: 'Guru Biasa (Pengguna Aktif)',
    desc: 'Boleh mencatat aktiviti peribadi/kelas, mengemaskini rekod sendiri, dan melihat keseluruhan takwim 2027.',
    color: 'bg-slate-100 text-slate-800 border-slate-300',
  },
  {
    id: 'Pemerhati',
    label: 'Pemerhati / Pelawat',
    desc: 'Akses lihat sahaja (Read-Only) kepada keseluruhan takwim sekolah tanpa kebenaran menyunting.',
    color: 'bg-gray-100 text-gray-700 border-gray-300',
  },
];

export const PengurusanPerananModal: React.FC<PengurusanPerananModalProps> = ({
  isOpen,
  onClose,
  senaraiGuru,
  currentUser,
  onKemasKiniPeranan,
  onTambahGuru,
  onKemaskiniProfilGuru,
  onPadamGuru,
}) => {
  const [carian, setCarian] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [mesejBerjaya, setMesejBerjaya] = useState<string | null>(null);

  // Form Tambah / Sunting Guru
  const [bukaBorangGuru, setBukaBorangGuru] = useState(false);
  const [guruSedangDisunting, setGuruSedangDisunting] = useState<PenggunaGuru | null>(null);
  const [namaInput, setNamaInput] = useState('');
  const [jawatanInput, setJawatanInput] = useState('');
  const [gredInput, setGredInput] = useState('DG41');
  const [emelInput, setEmelInput] = useState('');
  const [perananInput, setPerananInput] = useState<PerananPengguna>('Guru Biasa');
  const [unitInput, setUnitInput] = useState<'Pentadbiran' | 'Kurikulum' | 'HEM' | 'Kokurikulum' | 'Prasekolah' | 'Pendidikan Khas'>('Kurikulum');
  const [telefonInput, setTelefonInput] = useState('');
  const [prosesBorang, setProsesBorang] = useState(false);

  if (!isOpen) return null;

  const isAdmin = currentUser.peranan === 'Pentadbir';

  const guruDitapis = senaraiGuru.filter(
    (g) =>
      g.nama.toLowerCase().includes(carian.toLowerCase()) ||
      g.jawatan.toLowerCase().includes(carian.toLowerCase()) ||
      g.emel.toLowerCase().includes(carian.toLowerCase())
  );

  const handleTukarPeranan = async (guruId: string, perananBaru: PerananPengguna) => {
    try {
      setLoadingId(guruId);
      await onKemasKiniPeranan(guruId, perananBaru);
      setMesejBerjaya('Peranan pengguna berjaya dikemaskini dalam pangkalan data secara masa nyata!');
      setTimeout(() => setMesejBerjaya(null), 3000);
    } finally {
      setLoadingId(null);
    }
  };

  const bukaBorangTambah = () => {
    setGuruSedangDisunting(null);
    setNamaInput('');
    setJawatanInput('Guru Akademik');
    setGredInput('DG41');
    setEmelInput(`guru${senaraiGuru.length + 1}@moe-dl.edu.my`);
    setPerananInput('Guru Biasa');
    setUnitInput('Kurikulum');
    setTelefonInput('');
    setBukaBorangGuru(true);
  };

  const bukaBorangSunting = (g: PenggunaGuru) => {
    setGuruSedangDisunting(g);
    setNamaInput(g.nama);
    setJawatanInput(g.jawatan);
    setGredInput(g.gred);
    setEmelInput(g.emel);
    setPerananInput(g.peranan);
    setUnitInput(g.unit);
    setTelefonInput(g.noTelefon || '');
    setBukaBorangGuru(true);
  };

  const simpanBorangGuru = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaInput.trim() || !emelInput.trim()) {
      alert('Sila isi nama dan emel guru.');
      return;
    }

    try {
      setProsesBorang(true);
      if (guruSedangDisunting && onKemaskiniProfilGuru) {
        await onKemaskiniProfilGuru(guruSedangDisunting.id, {
          nama: namaInput.trim(),
          jawatan: jawatanInput.trim(),
          gred: gredInput.trim(),
          emel: emelInput.trim(),
          peranan: perananInput,
          unit: unitInput,
          noTelefon: telefonInput.trim(),
        });
        setMesejBerjaya(`Profil ${namaInput} berjaya dikemaskini.`);
      } else if (onTambahGuru) {
        await onTambahGuru({
          nama: namaInput.trim(),
          jawatan: jawatanInput.trim(),
          gred: gredInput.trim(),
          emel: emelInput.trim(),
          peranan: perananInput,
          unit: unitInput,
          noTelefon: telefonInput.trim(),
        });
        setMesejBerjaya(`Guru baharu ${namaInput} berjaya didaftarkan ke dalam sistem.`);
      }
      setBukaBorangGuru(false);
      setTimeout(() => setMesejBerjaya(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan profil guru.');
    } finally {
      setProsesBorang(false);
    }
  };

  const padamGuru = async (guru: PenggunaGuru) => {
    if (guru.id === currentUser.id) {
      alert('Anda tidak boleh memadam profil anda sendiri yang sedang aktif.');
      return;
    }
    if (!window.confirm(`Adakah anda pasti ingin memadamkan rekod guru "${guru.nama}" (${guru.jawatan})?`)) {
      return;
    }
    if (onPadamGuru) {
      await onPadamGuru(guru.id, guru.nama);
      setMesejBerjaya(`Rekod guru ${guru.nama} berjaya dipadam.`);
      setTimeout(() => setMesejBerjaya(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Header Modal */}
        <div className="px-6 py-4 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-800 rounded-xl border border-emerald-700 text-emerald-300">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Pengurusan Guru & Peranan Akses (RBAC)
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-700 text-emerald-200 font-normal">
                  {senaraiGuru.length} Guru SK Timbang
                </span>
              </h2>
              <p className="text-xs text-emerald-200">
                Ubah nama, jawatan, emel, tambah guru baharu atau tetapkan had akses takwim pada bila-bila masa.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-emerald-300 hover:text-white hover:bg-emerald-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifikasi Kejayaan / Amaran Akses */}
        {mesejBerjaya && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 flex items-center gap-2 text-xs font-semibold text-emerald-800 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {mesejBerjaya}
          </div>
        )}

        {!isAdmin && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center gap-2 text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Perhatian:</strong> Anda sedang melog masuk sebagai <strong>{currentUser.peranan}</strong>. Hanya
              pengguna berstatus <strong>Pentadbir</strong> dibenarkan menukar peranan atau mengurus rekod guru lain.
            </span>
          </div>
        )}

        {/* Borang Tambah / Sunting Guru (Inline Accordion) */}
        {bukaBorangGuru && (
          <form onSubmit={simpanBorangGuru} className="bg-emerald-50/70 border-b border-emerald-200 p-4 space-y-3 animate-fadeIn text-xs">
            <div className="flex items-center justify-between pb-1">
              <h3 className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-emerald-700" />
                {guruSedangDisunting ? `Sunting Maklumat: ${guruSedangDisunting.nama}` : 'Daftar Guru Baharu SK Timbang'}
              </h3>
              <button
                type="button"
                onClick={() => setBukaBorangGuru(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Penuh Guru *</label>
                <input
                  type="text"
                  required
                  value={namaInput}
                  onChange={(e) => setNamaInput(e.target.value)}
                  placeholder="cth: Ahmad bin Zulkifli"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-emerald-600 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Jawatan / Tugas Utama *</label>
                <input
                  type="text"
                  required
                  value={jawatanInput}
                  onChange={(e) => setJawatanInput(e.target.value)}
                  placeholder="cth: Ketua Panitia Sains / Guru Kelas"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Gred Jawatan</label>
                <input
                  type="text"
                  value={gredInput}
                  onChange={(e) => setGredInput(e.target.value)}
                  placeholder="DG41 / DG42 / DG44 / DG48"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Emel Rasmi KPM / ID Login *</label>
                <input
                  type="email"
                  required
                  value={emelInput}
                  onChange={(e) => setEmelInput(e.target.value)}
                  placeholder="g-XXXXXX@moe-dl.edu.my"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-emerald-600 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Peranan Akses</label>
                <select
                  value={perananInput}
                  onChange={(e) => setPerananInput(e.target.value as PerananPengguna)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-emerald-600 font-semibold"
                >
                  {PERANAN_LIST.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Unit Sekolah</label>
                <select
                  value={unitInput}
                  onChange={(e) => setUnitInput(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-emerald-600"
                >
                  <option value="Pentadbiran">Pentadbiran</option>
                  <option value="Kurikulum">Kurikulum</option>
                  <option value="HEM">Hal Ehwal Murid (HEM)</option>
                  <option value="Kokurikulum">Kokurikulum</option>
                  <option value="Prasekolah">Prasekolah</option>
                  <option value="Pendidikan Khas">Pendidikan Khas</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setBukaBorangGuru(false)}
                className="px-3 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-lg font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={prosesBorang}
                className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                {prosesBorang ? 'Menyimpan...' : guruSedangDisunting ? 'Simpan Perubahan' : 'Daftar Guru'}
              </button>
            </div>
          </form>
        )}

        {/* Bar Carian Guru & Butang Tambah Guru */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari guru mengikut nama, jawatan, atau emel MOE..."
              value={carian}
              onChange={(e) => setCarian(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-emerald-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
              {guruDitapis.length} guru
            </span>

            {isAdmin && !bukaBorangGuru && (
              <button
                onClick={bukaBorangTambah}
                className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                Tambah Guru Baharu
              </button>
            )}
          </div>
        </div>

        {/* Senarai Guru Table */}
        <div className="overflow-y-auto flex-1 p-4">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-3 py-2.5">Guru & Jawatan</th>
                <th className="px-3 py-2.5">Gred & Unit</th>
                <th className="px-3 py-2.5">Emel Rasmi KPM</th>
                <th className="px-3 py-2.5">Peranan Akses</th>
                <th className="px-3 py-2.5 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {guruDitapis.map((guru) => {
                const isCurrent = guru.id === currentUser.id;

                return (
                  <tr key={guru.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{guru.avatar}</span>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            {guru.nama}
                            {isCurrent && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                                Anda
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">{guru.jawatan}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-3">
                      <span className="font-semibold text-slate-700">{guru.gred}</span>
                      <div className="text-[10px] text-slate-400">{guru.unit}</div>
                    </td>

                    <td className="px-3 py-3 text-slate-600 font-mono text-[11px]">{guru.emel}</td>

                    <td className="px-3 py-3">
                      {isAdmin ? (
                        <select
                          disabled={loadingId === guru.id}
                          value={guru.peranan}
                          onChange={(e) => handleTukarPeranan(guru.id, e.target.value as PerananPengguna)}
                          className={`text-xs border rounded-lg px-2 py-1 font-bold focus:outline-emerald-600 disabled:opacity-50 ${
                            PERANAN_LIST.find((p) => p.id === guru.peranan)?.color || 'bg-slate-100'
                          }`}
                        >
                          {PERANAN_LIST.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            PERANAN_LIST.find((p) => p.id === guru.peranan)?.color || 'bg-slate-100'
                          }`}
                        >
                          {guru.peranan}
                        </span>
                      )}
                    </td>

                    <td className="px-3 py-3 text-right">
                      {isAdmin ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => bukaBorangSunting(guru)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Sunting nama, jawatan & maklumat guru"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {!isCurrent && (
                            <button
                              onClick={() => padamGuru(guru)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Padam / pindah guru"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Lihat sahaja</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Kemas kini data guru dan peranan akan berkuatkuasa secara langsung ke pangkalan data sekolah.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
