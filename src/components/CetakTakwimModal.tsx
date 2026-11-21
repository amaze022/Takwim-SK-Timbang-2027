import React, { useState } from 'react';
import { AktivitiTakwim, PenggunaGuru } from '../types/takwim';
import { SENARAI_CUTI_2027, PENGGAL_PERSEKOLAHAN_2027 } from '../data/kalendarKPM2027';
import { Printer, X, Download, School } from 'lucide-react';

interface CetakTakwimModalProps {
  isOpen: boolean;
  onClose: () => void;
  aktivitiList: AktivitiTakwim[];
  currentUser: PenggunaGuru;
}

export const CetakTakwimModal: React.FC<CetakTakwimModalProps> = ({
  isOpen,
  onClose,
  aktivitiList,
  currentUser,
}) => {
  const [bulanPilihan, setBulanPilihan] = useState<string>('semua');

  if (!isOpen) return null;

  const handleCetak = () => {
    window.print();
  };

  const aktivitiSorted = [...aktivitiList].sort((a, b) => a.tarikhMula.localeCompare(b.tarikhMula));
  const aktivitiFiltered =
    bulanPilihan === 'semua'
      ? aktivitiSorted
      : aktivitiSorted.filter((a) => a.tarikhMula.startsWith(`2027-${bulanPilihan}`));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Modal Controls Bar */}
        <div className="px-6 py-4 bg-emerald-950 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <Printer className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-sm font-bold text-white">Pratonton & Cetak Buku Takwim Rasmi 2027</h2>
              <p className="text-[11px] text-emerald-300">Format rasmi SK Timbang Kota Belud untuk dokumentasi fail sekolah.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={bulanPilihan}
              onChange={(e) => setBulanPilihan(e.target.value)}
              className="text-xs bg-emerald-900 text-white border border-emerald-700 rounded-lg px-3 py-1.5 focus:outline-emerald-500"
            >
              <option value="semua">Semua Sepanjang Tahun 2027</option>
              <option value="01">Januari 2027</option>
              <option value="02">Februari 2027</option>
              <option value="03">Mac 2027</option>
              <option value="04">April 2027</option>
              <option value="05">Mei 2027</option>
              <option value="06">Jun 2027</option>
              <option value="07">Julai 2027</option>
              <option value="08">Ogos 2027</option>
              <option value="09">September 2027</option>
              <option value="10">Oktober 2027</option>
              <option value="11">November 2027</option>
              <option value="12">Disember 2027</option>
            </select>

            <button
              onClick={handleCetak}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" /> Cetak Sekarang
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Sheet */}
        <div className="p-8 overflow-y-auto flex-1 bg-white text-slate-900 print:p-0">
          {/* Kepala Surat Rasmi Sekolah */}
          <div className="flex items-center justify-between pb-4 border-b-2 border-slate-900 mb-6">
            <img
              src="/public/assets/aistudio/logo_sk_timbang_3d_85d10bb0.jpeg"
              alt="Logo SK Timbang"
              className="w-20 h-20 object-contain"
            />
            <div className="text-center flex-1 px-4">
              <h1 className="text-lg font-black tracking-wide text-slate-900 uppercase">
                SEKOLAH KEBANGSAAN TIMBANG
              </h1>
              <h2 className="text-xs font-bold text-slate-700 uppercase">
                PETI SURAT 143, 89158 KOTA BELUD, SABAH
              </h2>
              <p className="text-[10px] text-slate-500 mt-0.5">
                KOD SEKOLAH: XBA5232 | EMEL: XBA5232@moe.edu.my | MOTTO: &ldquo;DEDIKASI TERAS KEJAYAAN&rdquo;
              </p>
              <div className="mt-2 inline-block px-3 py-1 bg-slate-900 text-white text-xs font-extrabold uppercase tracking-wider rounded">
                BUKU TAKWIM & AKTIVITI PERSEKOLAHAN TAHUN 2027 (KUMPULAN B)
              </div>
            </div>
            <div className="w-20 text-right text-[10px] text-slate-500 font-mono">
              <div>Sesi 2027</div>
              <div>30 Guru</div>
              <div>Sabah</div>
            </div>
          </div>

          {/* Maklumat Ringkasan Penggal KPM */}
          <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <h3 className="font-bold text-slate-900 uppercase mb-2">Jadual Ringkasan Penggal Persekolahan 2027</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
              <div>
                <span className="font-semibold text-slate-700">Penggal 1:</span>
                <p className="text-slate-600">04 Jan - 21 Mei 2027</p>
              </div>
              <div>
                <span className="font-semibold text-slate-700">Cuti Pertengahan Tahun:</span>
                <p className="text-slate-600">22 Mei - 06 Jun 2027</p>
              </div>
              <div>
                <span className="font-semibold text-slate-700">Penggal 2:</span>
                <p className="text-slate-600">07 Jun - 03 Dis 2027</p>
              </div>
              <div>
                <span className="font-semibold text-slate-700">Cuti Akhir Tahun:</span>
                <p className="text-slate-600">04 Dis - 31 Dis 2027</p>
              </div>
            </div>
          </div>

          {/* Jadual Aktiviti */}
          <table className="w-full text-xs text-left border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold uppercase text-[10px]">
                <th className="border border-slate-300 px-3 py-2 text-center w-12">Bil</th>
                <th className="border border-slate-300 px-3 py-2 w-28">Tarikh</th>
                <th className="border border-slate-300 px-3 py-2">Nama Aktiviti / Program</th>
                <th className="border border-slate-300 px-3 py-2 w-28">Kategori</th>
                <th className="border border-slate-300 px-3 py-2 w-32">Tempat</th>
                <th className="border border-slate-300 px-3 py-2 w-36">Tindakan / Dicatat Oleh</th>
              </tr>
            </thead>
            <tbody>
              {aktivitiFiltered.map((akt, index) => (
                <tr key={akt.id} className="border-b border-slate-200">
                  <td className="border border-slate-300 px-3 py-2 text-center font-semibold">{index + 1}</td>
                  <td className="border border-slate-300 px-3 py-2 font-mono font-medium">
                    {akt.tarikhMula}
                    {akt.tarikhTamat !== akt.tarikhMula && (
                      <div className="text-[10px] text-slate-500">hingga {akt.tarikhTamat}</div>
                    )}
                  </td>
                  <td className="border border-slate-300 px-3 py-2 font-bold text-slate-900">
                    {akt.nama}
                    {akt.penerangan && (
                      <p className="text-[10px] font-normal text-slate-600 mt-0.5">{akt.penerangan}</p>
                    )}
                  </td>
                  <td className="border border-slate-300 px-3 py-2 font-medium">{akt.kategori}</td>
                  <td className="border border-slate-300 px-3 py-2 text-slate-700">{akt.tempat}</td>
                  <td className="border border-slate-300 px-3 py-2 text-slate-700">{akt.dicatatOleh}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pengesahan Tanda Tangan Pentadbir */}
          <div className="mt-12 pt-8 grid grid-cols-2 gap-12 text-xs border-t border-slate-300 print:mt-8">
            <div>
              <p className="text-slate-600">Disediakan oleh:</p>
              <div className="h-16"></div>
              <p className="font-bold text-slate-900 uppercase">Pn. Norazlin binti Roslan</p>
              <p className="text-slate-500 text-[11px]">Setiausaha Takwim & Kurikulum SK Timbang</p>
            </div>

            <div className="text-right">
              <p className="text-slate-600">Disahkan & Diluluskan oleh:</p>
              <div className="h-16"></div>
              <p className="font-bold text-slate-900 uppercase">En. Madin bin Gunting</p>
              <p className="text-slate-500 text-[11px]">Guru Besar, SK Timbang Kota Belud, Sabah</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
