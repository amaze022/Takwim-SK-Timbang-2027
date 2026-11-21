import React, { useState, useEffect } from 'react';
import { AktivitiTakwim, KategoriAktiviti, KeutamaanAktiviti, PenggunaGuru, StatusAktiviti } from '../types/takwim';
import { SENARAI_CUTI_2027 } from '../data/kalendarKPM2027';
import { X, Calendar, Clock, MapPin, Tag, User, AlertTriangle, Sparkles, Check } from 'lucide-react';

interface AktivitiFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (aktivitiData: Partial<AktivitiTakwim>) => Promise<void>;
  aktivitiAsal?: AktivitiTakwim | null;
  tarikhAwal?: string;
  currentUser: PenggunaGuru;
  senaraiGuru: PenggunaGuru[];
}

const TEMPAT_PILIHAN = [
  'Dewan Terbuka SK Timbang',
  'Bilik Gerakan Wawasan SK Timbang',
  'Tapak Perhimpunan SK Timbang',
  'Padang Sekolah SK Timbang',
  'Pusat Sumber Sekolah (PSS)',
  'Makmal Komputer SK Timbang',
  'Bilik Guru SK Timbang',
  'Bilik Sains SK Timbang',
  'Bilik RBT SK Timbang',
  'Bilik Pemulihan Khas',
  'Bilik J-QAF / Surau Sekolah',
  'Kelas Masing-masing',
  'Pantai Usukan / Luar Kawasan',
];

const SASARAN_PILIHAN = [
  'Semua Warga Sekolah',
  'Semua Murid (Tahun 1 - 6)',
  'Murid Tahap 1 (Tahun 1, 2, 3)',
  'Murid Tahap 2 (Tahun 4, 5, 6)',
  'Murid Tahun 6',
  'Murid Prasekolah',
  'Semua 30 Orang Guru & AKP',
  'Ibu Bapa / PIBG & Komuniti',
];

export const AktivitiFormModal: React.FC<AktivitiFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  aktivitiAsal,
  tarikhAwal,
  currentUser,
  senaraiGuru,
}) => {
  const [nama, setNama] = useState('');
  const [tarikhMula, setTarikhMula] = useState('2027-01-04');
  const [tarikhTamat, setTarikhTamat] = useState('2027-01-04');
  const [masaMula, setMasaMula] = useState('08:00');
  const [masaTamat, setMasaTamat] = useState('13:00');
  const [kategori, setKategori] = useState<KategoriAktiviti>('Kurikulum');
  const [tempat, setTempat] = useState('Dewan Terbuka SK Timbang');
  const [sasaran, setSasaran] = useState('Semua Warga Sekolah');
  const [status, setStatus] = useState<StatusAktiviti>('Dirancang');
  const [keutamaan, setKeutamaan] = useState<KeutamaanAktiviti>('Sederhana');
  const [dicatatOleh, setDicatatOleh] = useState(currentUser.nama);
  const [penerangan, setPenerangan] = useState('');
  const [sedangMenghantar, setSedangMenghantar] = useState(false);
  const [ralat, setRalat] = useState<string | null>(null);

  useEffect(() => {
    if (aktivitiAsal) {
      setNama(aktivitiAsal.nama);
      setTarikhMula(aktivitiAsal.tarikhMula);
      setTarikhTamat(aktivitiAsal.tarikhTamat);
      setMasaMula(aktivitiAsal.masaMula || '08:00');
      setMasaTamat(aktivitiAsal.masaTamat || '13:00');
      setKategori(aktivitiAsal.kategori);
      setTempat(aktivitiAsal.tempat);
      setSasaran(aktivitiAsal.sasaran);
      setStatus(aktivitiAsal.status);
      setKeutamaan(aktivitiAsal.keutamaan);
      setDicatatOleh(aktivitiAsal.dicatatOleh);
      setPenerangan(aktivitiAsal.penerangan);
    } else {
      const defaultDate = tarikhAwal || '2027-01-04';
      setNama('');
      setTarikhMula(defaultDate);
      setTarikhTamat(defaultDate);
      setMasaMula('08:00');
      setMasaTamat('13:00');
      setKategori(
        currentUser.unit === 'HEM'
          ? 'Hal Ehwal Murid (HEM)'
          : currentUser.unit === 'Kokurikulum'
          ? 'Kokurikulum'
          : 'Kurikulum'
      );
      setTempat('Dewan Terbuka SK Timbang');
      setSasaran('Semua Warga Sekolah');
      setStatus('Dirancang');
      setKeutamaan('Sederhana');
      setDicatatOleh(currentUser.nama);
      setPenerangan('');
    }
    setRalat(null);
  }, [aktivitiAsal, tarikhAwal, currentUser, isOpen]);

  if (!isOpen) return null;

  // Semak jika tarikh aktiviti bertindih dengan cuti
  const cutiBertindih = SENARAI_CUTI_2027.filter((c) => {
    return (
      (tarikhMula >= c.tarikhMula && tarikhMula <= c.tarikhTamat) ||
      (tarikhTamat >= c.tarikhMula && tarikhTamat <= c.tarikhTamat) ||
      (c.tarikhMula >= tarikhMula && c.tarikhTamat <= tarikhTamat)
    );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      setRalat('Sila masukkan nama aktiviti.');
      return;
    }
    if (tarikhTamat < tarikhMula) {
      setRalat('Tarikh tamat tidak boleh sebelum tarikh mula.');
      return;
    }

    try {
      setSedangMenghantar(true);
      setRalat(null);
      await onSubmit({
        nama: nama.trim(),
        tarikhMula,
        tarikhTamat,
        masaMula,
        masaTamat,
        kategori,
        tempat,
        sasaran,
        status,
        keutamaan,
        dicatatOleh,
        penerangan: penerangan.trim(),
        updatedBy: currentUser.nama,
      });
      onClose();
    } catch (err: any) {
      setRalat(err.message || 'Gagal menyimpan rekod aktiviti.');
    } finally {
      setSedangMenghantar(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Header Modal */}
        <div className="px-6 py-4 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-800 rounded-xl border border-emerald-700 text-emerald-300">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {aktivitiAsal ? 'Sunting Aktiviti Takwim 2027' : 'Catat Aktiviti Baharu Takwim 2027'}
              </h2>
              <p className="text-xs text-emerald-200">
                Data akan disimpan dan disegerakkan secara langsung kepada seluruh 30 orang guru.
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

        {/* Notifikasi Cuti Bertindih */}
        {cutiBertindih.length > 0 && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-start gap-2.5 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Peringatan Kalendar KPM / Cuti Sabah:</span>
              <p className="mt-0.5 text-amber-800">
                Tarikh ini jatuh dalam cuti rasmi:{' '}
                {cutiBertindih.map((c) => `${c.nama} (${c.tarikhMula} - ${c.tarikhTamat})`).join(', ')}. Sila pastikan
                aktiviti ini sememangnya dirancang pada waktu cuti tersebut.
              </p>
            </div>
          </div>
        )}

        {/* Ralat */}
        {ralat && (
          <div className="bg-rose-50 border-b border-rose-200 px-6 py-2.5 text-xs font-semibold text-rose-800">
            {ralat}
          </div>
        )}

        {/* Borang Input */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Nama Aktiviti */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Nama Aktiviti / Program <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="cth: Mesyuarat Kurikulum Bil. 1/2027 / Minggu Bahasa Melayu"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-medium focus:bg-white focus:outline-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          {/* Tarikh Mula & Tarikh Tamat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Tarikh Mula <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                min="2027-01-01"
                max="2027-12-31"
                value={tarikhMula}
                onChange={(e) => {
                  setTarikhMula(e.target.value);
                  if (tarikhTamat < e.target.value) setTarikhTamat(e.target.value);
                }}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Tarikh Tamat <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                min={tarikhMula}
                max="2027-12-31"
                value={tarikhTamat}
                onChange={(e) => setTarikhTamat(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:outline-emerald-600"
              />
            </div>
          </div>

          {/* Masa Mula & Tamat */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Masa Mula</label>
              <input
                type="time"
                value={masaMula}
                onChange={(e) => setMasaMula(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1">Masa Tamat</label>
              <input
                type="time"
                value={masaTamat}
                onChange={(e) => setMasaTamat(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:outline-emerald-600"
              />
            </div>
          </div>

          {/* Kategori & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Kategori Aktiviti</label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value as KategoriAktiviti)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-medium focus:bg-white focus:outline-emerald-600"
              >
                <option value="Kurikulum">Kurikulum</option>
                <option value="Hal Ehwal Murid (HEM)">Hal Ehwal Murid (HEM)</option>
                <option value="Kokurikulum">Kokurikulum</option>
                <option value="Pentadbiran & Guru">Pentadbiran & Guru</option>
                <option value="Peperiksaan & Pentaksiran">Peperiksaan & Pentaksiran</option>
                <option value="Sambutan / Khas">Sambutan / Khas</option>
                <option value="LDP / PLC">LDP / PLC</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Status Aktiviti</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusAktiviti)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-medium focus:bg-white focus:outline-emerald-600"
              >
                <option value="Dirancang">Dirancang</option>
                <option value="Sedang Berlangsung">Sedang Berlangsung</option>
                <option value="Selesai">Selesai</option>
                <option value="Ditunda">Ditunda</option>
              </select>
            </div>
          </div>

          {/* Tempat Aktiviti */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">Tempat / Lokasi</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tempat}
                onChange={(e) => setTempat(e.target.value)}
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:outline-emerald-600"
              />
              <select
                onChange={(e) => {
                  if (e.target.value) setTempat(e.target.value);
                }}
                className="px-2.5 py-2 bg-slate-100 border border-slate-300 rounded-xl text-slate-700 text-xs focus:outline-emerald-600"
                defaultValue=""
              >
                <option value="" disabled>
                  Pilihan Lazim...
                </option>
                {TEMPAT_PILIHAN.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sasaran Murid & Pegawai Bertanggungjawab */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Kumpulan Sasaran</label>
              <select
                value={sasaran}
                onChange={(e) => setSasaran(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:outline-emerald-600"
              >
                {SASARAN_PILIHAN.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Dicatat Oleh / Bertanggungjawab</label>
              <select
                value={dicatatOleh}
                onChange={(e) => setDicatatOleh(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-medium focus:bg-white focus:outline-emerald-600"
              >
                {senaraiGuru.map((g) => (
                  <option key={g.id} value={g.nama}>
                    {g.nama} ({g.jawatan})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Penerangan / Maklumat Lanjut */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">Penerangan & Objektif Aktiviti</label>
            <textarea
              rows={3}
              value={penerangan}
              onChange={(e) => setPenerangan(e.target.value)}
              placeholder="Sertakan maklumat terperinci seperti penglibatan murid, guru bertugas, dan keperluan program..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:outline-emerald-600"
            />
          </div>

          {/* Butang Tindakan */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={sedangMenghantar}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded-xl text-slate-700 font-semibold transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={sedangMenghantar}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {sedangMenghantar ? 'Menyimpan...' : aktivitiAsal ? 'Kemaskini Aktiviti' : 'Simpan Aktiviti'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
