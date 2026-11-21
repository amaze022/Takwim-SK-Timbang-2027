import React, { useState } from 'react';
import { AktivitiTakwim, PenggunaGuru } from '../types/takwim';
import { generateICSContent, downloadICSFile } from '../utils/icalGenerator';
import {
  Smartphone,
  Calendar,
  Bell,
  Download,
  CheckCircle2,
  Share2,
  Copy,
  ExternalLink,
  X,
  Sparkles,
  HelpCircle,
  Apple,
} from 'lucide-react';

interface IntegrasiKalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  aktivitiList: AktivitiTakwim[];
  currentUser: PenggunaGuru;
}

export const IntegrasiKalendarModal: React.FC<IntegrasiKalendarModalProps> = ({
  isOpen,
  onClose,
  aktivitiList,
  currentUser,
}) => {
  const [pilihanSegerak, setPilihanSegerak] = useState<'semua' | 'saya' | 'unit'>('semua');
  const [termasukCutiSabah, setTermasukCutiSabah] = useState(true);
  const [berjayaDownload, setBerjayaDownload] = useState(false);
  const [pautanDisalin, setPautanDisalin] = useState(false);

  if (!isOpen) return null;

  // Kiraan aktiviti mengikut pilihan
  const aktivitiSaya = aktivitiList.filter(
    (a) =>
      a.dicatatOleh.toLowerCase().includes(currentUser.nama.toLowerCase()) ||
      a.guruBertanggungjawabId === currentUser.id
  );

  const handleDownload = () => {
    let guruNama: string | undefined = undefined;
    if (pilihanSegerak === 'saya') {
      guruNama = currentUser.nama;
    }

    const icsContent = generateICSContent(aktivitiList, termasukCutiSabah, guruNama);
    const namaFail =
      pilihanSegerak === 'saya'
        ? `Takwim_SK_Timbang_2027_${currentUser.nama.replace(/\s+/g, '_')}.ics`
        : 'Takwim_SK_Timbang_2027_Lengkap.ics';

    downloadICSFile(namaFail, icsContent);
    setBerjayaDownload(true);
    setTimeout(() => setBerjayaDownload(false), 5000);
  };

  const handleSalinPautan = () => {
    const url = window.location.origin;
    navigator.clipboard.writeText(url);
    setPautanDisalin(true);
    setTimeout(() => setPautanDisalin(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Header Modal */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-800/80 rounded-xl border border-emerald-700 text-emerald-300">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Segerak Kalendar Telefon & Peringatan Pintar
              </h2>
              <p className="text-xs text-emerald-200">
                Gabungkan Takwim SK Timbang 2027 terus ke Google Calendar, iPhone, atau Samsung Calendar.
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

        {/* Notifikasi Kejayaan */}
        {berjayaDownload && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 flex items-center gap-2 text-xs font-semibold text-emerald-800 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Fail kalendar (.ics) telah dimuat turun! Buka fail ini pada telefon anda untuk memasukkannya ke kalendar peranti.
          </div>
        )}

        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs text-slate-700">
          {/* Pilihan Data untuk Disegerak */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-700" />
              1. Pilih Aktiviti Yang Ingin Disegerakkan ke Telefon:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                onClick={() => setPilihanSegerak('semua')}
                className={`p-3 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${
                  pilihanSegerak === 'semua'
                    ? 'bg-emerald-50/80 border-emerald-500 ring-1 ring-emerald-500'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="pilihan"
                  checked={pilihanSegerak === 'semua'}
                  onChange={() => setPilihanSegerak('semua')}
                  className="mt-0.5 text-emerald-600"
                />
                <div>
                  <div className="font-bold text-slate-900">Semua Aktiviti Sekolah ({aktivitiList.length})</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Termasuk keseluruhan takwim akademik, HEM, kokurikulum dan pentadbiran 2027.
                  </div>
                </div>
              </label>

              <label
                onClick={() => setPilihanSegerak('saya')}
                className={`p-3 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${
                  pilihanSegerak === 'saya'
                    ? 'bg-emerald-50/80 border-emerald-500 ring-1 ring-emerald-500'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="pilihan"
                  checked={pilihanSegerak === 'saya'}
                  onChange={() => setPilihanSegerak('saya')}
                  className="mt-0.5 text-emerald-600"
                />
                <div>
                  <div className="font-bold text-slate-900">Aktiviti Di Bawah Saya Sahaja ({aktivitiSaya.length})</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Hanya program yang dicatat oleh <strong>{currentUser.nama}</strong> dan program umum sekolah.
                  </div>
                </div>
              </label>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={termasukCutiSabah}
                  onChange={(e) => setTermasukCutiSabah(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Sertakan Cuti Penggal KPM & Cuti Umum Negeri Sabah (Kaamatan, Good Friday, TYT dll)</span>
              </label>
            </div>
          </div>

          {/* Ciri Peringatan Automatik (Notification / Alarm) */}
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-xl text-amber-800 shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-amber-950 text-xs">Peringatan Automatik (*Built-In Alarms*):</h4>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Fail kalendar ini telah dikonfigurasi dengan kod piawai <code>VALARM</code>. Apabila dimasukkan ke
                dalam telefon:
              </p>
              <ul className="list-disc list-inside text-[11px] text-amber-900 mt-1 space-y-0.5 font-medium">
                <li>Telefon anda akan membunyikan notifikasi <strong>1 Hari Sebelum</strong> aktiviti bermula.</li>
                <li>Notifikasi kedua berbunyi <strong>1 Jam Sebelum</strong> program berlangsung.</li>
              </ul>
            </div>
          </div>

          {/* Butang Muat Turun Kalendar */}
          <div className="text-center pt-2">
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 mx-auto text-sm group"
            >
              <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Muat Turun & Segerak ke Kalendar Telefon (.ics)
            </button>
            <p className="text-[11px] text-slate-400 mt-2">
              Serasi 100% dengan telefon Android, Samsung, iPhone (iOS), iPad, dan Komputer (Outlook/Mac Calendar).
            </p>
          </div>

          {/* Panduan 3 Langkah Memasukkan ke Telefon */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3">
            <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wider">
              <HelpCircle className="w-4 h-4 text-emerald-700" />
              Cara Penggunaan Pada Telefon Guru:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px]">
              {/* Android */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-emerald-800 flex items-center gap-1">
                  <span>📱 Untuk Telefon Android / Samsung</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-600">
                  <li>Tekan butang muat turun fail <code>.ics</code> di atas.</li>
                  <li>Buka fail yang dimuat turun dari panel notifikasi telefon anda.</li>
                  <li>Pilih <strong>Google Calendar</strong> atau <strong>Samsung Calendar</strong>.</li>
                  <li>Tekan <strong>&ldquo;Tambah Semua&rdquo; (Add All)</strong>. Siap!</li>
                </ol>
              </div>

              {/* iPhone */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <span>🍎 Untuk Telefon iPhone (Apple iOS)</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-600">
                  <li>Tekan butang muat turun fail <code>.ics</code> di atas melalui Safari/Chrome.</li>
                  <li>iPhone akan terus memaparkan pratonton kalendar.</li>
                  <li>Tekan <strong>&ldquo;Add All&rdquo; (Tambah Semua)</strong> di bucu kanan atas.</li>
                  <li>Semua aktiviti dan cuti akan tersimpan dalam aplikasi Calendar iPhone.</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Panduan Pasang Aplikasi ke Handphone (Add to Home Screen) */}
          <div className="bg-emerald-950 text-white p-4 rounded-2xl border border-emerald-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-300" />
                Cara Pasang Aplikasi Ini di Skrin Utama Telefon (Tanpa Download Play Store)
              </span>
              <button
                onClick={handleSalinPautan}
                className="text-[10px] px-2.5 py-1 bg-emerald-800 hover:bg-emerald-700 rounded-lg text-emerald-200 flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                {pautanDisalin ? 'Pautan Disalin!' : 'Salin Pautan'}
              </button>
            </div>
            <p className="text-[11px] text-slate-300">
              Guru boleh memasang E-Takwim seperti aplikasi sebenar di telefon mereka:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-emerald-100">
              <div className="bg-emerald-900/60 p-2.5 rounded-lg border border-emerald-800">
                <strong>Android (Chrome):</strong> Tekan butang 3 titik (Menu) di bucu atas &gt; pilih <strong>&ldquo;Install app&rdquo;</strong> atau <strong>&ldquo;Add to Home screen&rdquo;</strong>.
              </div>
              <div className="bg-emerald-900/60 p-2.5 rounded-lg border border-emerald-800">
                <strong>iPhone (Safari):</strong> Tekan butang <strong>Kongsi (Share icon)</strong> di bawah &gt; pilih <strong>&ldquo;Add to Home Screen&rdquo;</strong>.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Format iCalendar piawai KPM & antarabangsa.</span>
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
