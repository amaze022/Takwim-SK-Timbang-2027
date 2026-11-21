import React from 'react';
import { PENGGAL_PERSEKOLAHAN_2027, SENARAI_CUTI_2027 } from '../data/kalendarKPM2027';
import { Calendar, CheckCircle2, MapPin, Sparkles, AlertCircle, FileText } from 'lucide-react';

export const PenggalKPMView: React.FC = () => {
  const cutiSabah = SENARAI_CUTI_2027.filter((c) => c.isSabahHoliday);
  const cutiTambahanKPM = SENARAI_CUTI_2027.filter((c) => c.jenis === 'Cuti Perayaan KPM');

  return (
    <div className="space-y-6">
      {/* Pengenalan Header Rasmi Kumpulan B */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
              <Calendar className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Lampiran B & C Rasmi KPM
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" /> Negeri Sabah (Kumpulan B)
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                Kalendar Akademik & Takwim Penggal Persekolahan Tahun 2027
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Rujukan rasmi Kementerian Pendidikan Malaysia bagi sekolah-sekolah di Sabah termasuk SK Timbang Kota Belud.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-700">Jumlah Hari Persekolahan:</div>
              <div className="text-base font-extrabold text-emerald-700">203 Hari (44 Minggu)</div>
            </div>
            <div className="h-8 w-px bg-slate-300"></div>
            <div className="text-right">
              <div className="text-xs font-bold text-slate-700">Jumlah Hari Cuti Penggal:</div>
              <div className="text-base font-extrabold text-amber-600">62 Hari</div>
            </div>
          </div>
        </div>

        {/* Struktur Jadual Penggal 1 & Penggal 2 (Berdasarkan Lampiran B KPM) */}
        <div className="mt-6 space-y-6">
          {/* PENGGAL 1 */}
          <div className="border border-emerald-200 rounded-xl overflow-hidden shadow-xs">
            <div className="bg-emerald-800 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-emerald-700 flex items-center justify-center text-xs">1</span>
                <span>PENGGAL 1 TAHUN 2027 (04.01.2027 - 21.05.2027)</span>
              </div>
              <span className="text-xs font-semibold bg-emerald-900/80 px-2.5 py-1 rounded-lg">
                Jumlah: 84 Hari Persekolahan (19 Minggu)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5">Sesi / Fasa</th>
                    <th className="px-4 py-2.5">Mula Persekolahan</th>
                    <th className="px-4 py-2.5">Akhir Persekolahan</th>
                    <th className="px-4 py-2.5 text-center">Jumlah Hari</th>
                    <th className="px-4 py-2.5 text-center">Jumlah Minggu</th>
                    <th className="px-4 py-2.5">Catatan Peristiwa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900">Persekolahan Penggal 1 (Bahagian 1)</td>
                    <td className="px-4 py-3">04.01.2027</td>
                    <td className="px-4 py-3">05.03.2027</td>
                    <td className="px-4 py-3 text-center font-bold text-emerald-700">39 Hari</td>
                    <td className="px-4 py-3 text-center font-bold">9 Minggu</td>
                    <td className="px-4 py-3 text-slate-500">Tahun Baharu Cina (06-07 Feb) & Cuti Tambahan KPM 5 Hari</td>
                  </tr>
                  <tr className="bg-amber-50/80 font-semibold text-amber-950">
                    <td className="px-4 py-3 flex items-center gap-1.5 text-amber-900">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" /> CUTI PENGGAL 1, TAHUN 2027
                    </td>
                    <td className="px-4 py-3">06.03.2027</td>
                    <td className="px-4 py-3">14.03.2027</td>
                    <td className="px-4 py-3 text-center font-bold text-amber-800">9 Hari</td>
                    <td className="px-4 py-3 text-center font-bold text-amber-800">1 Minggu</td>
                    <td className="px-4 py-3 text-amber-800">Termasuk Hari Raya Puasa / Aidilfitri (10 & 11 Mac)</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900">Persekolahan Penggal 1 (Bahagian 2)</td>
                    <td className="px-4 py-3">15.03.2027</td>
                    <td className="px-4 py-3">21.05.2027</td>
                    <td className="px-4 py-3 text-center font-bold text-emerald-700">45 Hari</td>
                    <td className="px-4 py-3 text-center font-bold">10 Minggu</td>
                    <td className="px-4 py-3 text-slate-500">Good Friday Sabah (26 Mac), Hari Raya Korban, Hari Wesak</td>
                  </tr>
                  <tr className="bg-orange-50/80 font-semibold text-orange-950">
                    <td className="px-4 py-3 flex items-center gap-1.5 text-orange-900">
                      <Sparkles className="w-3.5 h-3.5 text-orange-600" /> CUTI PERTENGAHAN TAHUN 2027
                    </td>
                    <td className="px-4 py-3">22.05.2027</td>
                    <td className="px-4 py-3">06.06.2027</td>
                    <td className="px-4 py-3 text-center font-bold text-orange-800">16 Hari</td>
                    <td className="px-4 py-3 text-center font-bold text-orange-800">2 Minggu</td>
                    <td className="px-4 py-3 text-orange-900 font-bold">
                      🌾 Pesta Kaamatan Sabah (30 & 31 Mei) & Gawai Dayak
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* PENGGAL 2 */}
          <div className="border border-blue-200 rounded-xl overflow-hidden shadow-xs">
            <div className="bg-blue-900 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-blue-700 flex items-center justify-center text-xs">2</span>
                <span>PENGGAL 2 TAHUN 2027 (07.06.2027 - 03.12.2027)</span>
              </div>
              <span className="text-xs font-semibold bg-blue-950/80 px-2.5 py-1 rounded-lg">
                Jumlah: 119 Hari Persekolahan (25 Minggu)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5">Sesi / Fasa</th>
                    <th className="px-4 py-2.5">Mula Persekolahan</th>
                    <th className="px-4 py-2.5">Akhir Persekolahan</th>
                    <th className="px-4 py-2.5 text-center">Jumlah Hari</th>
                    <th className="px-4 py-2.5 text-center">Jumlah Minggu</th>
                    <th className="px-4 py-2.5">Catatan Peristiwa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900">Persekolahan Penggal 2 (Bahagian 1)</td>
                    <td className="px-4 py-3">07.06.2027</td>
                    <td className="px-4 py-3">27.08.2027</td>
                    <td className="px-4 py-3 text-center font-bold text-blue-700">58 Hari</td>
                    <td className="px-4 py-3 text-center font-bold">12 Minggu</td>
                    <td className="px-4 py-3 text-slate-500">Hari Keputeraan Agong (07 Jun), Sukan Tahunan SK Timbang</td>
                  </tr>
                  <tr className="bg-amber-50/80 font-semibold text-amber-950">
                    <td className="px-4 py-3 flex items-center gap-1.5 text-amber-900">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" /> CUTI PENGGAL 2, TAHUN 2027
                    </td>
                    <td className="px-4 py-3">28.08.2027</td>
                    <td className="px-4 py-3">05.09.2027</td>
                    <td className="px-4 py-3 text-center font-bold text-amber-800">9 Hari</td>
                    <td className="px-4 py-3 text-center font-bold text-amber-800">1 Minggu</td>
                    <td className="px-4 py-3 text-amber-800">Termasuk Hari Kebangsaan (31 Ogos)</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900">Persekolahan Penggal 2 (Bahagian 2)</td>
                    <td className="px-4 py-3">06.09.2027</td>
                    <td className="px-4 py-3">03.12.2027</td>
                    <td className="px-4 py-3 text-center font-bold text-blue-700">61 Hari</td>
                    <td className="px-4 py-3 text-center font-bold">13 Minggu</td>
                    <td className="px-4 py-3 text-slate-500">
                      Hari Malaysia (16 Sept), TYT Sabah (02 Okt), Deepavali (28 Okt), UASA 2027
                    </td>
                  </tr>
                  <tr className="bg-rose-50/80 font-semibold text-rose-950">
                    <td className="px-4 py-3 flex items-center gap-1.5 text-rose-900">
                      <Sparkles className="w-3.5 h-3.5 text-rose-600" /> CUTI AKHIR PERSEKOLAHAN TAHUN 2027
                    </td>
                    <td className="px-4 py-3">04.12.2027</td>
                    <td className="px-4 py-3">31.12.2027</td>
                    <td className="px-4 py-3 text-center font-bold text-rose-800">28 Hari</td>
                    <td className="px-4 py-3 text-center font-bold text-rose-800">4 Minggu</td>
                    <td className="px-4 py-3 text-rose-900 font-bold">
                      🎄 Hari Sebelum Krismas Sabah (24 Dis) & Krismas (25 Dis)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Cuti Khas Sabah & Cuti Tambahan Perayaan KPM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kolum 1: Cuti Umum Khas Negeri Sabah 2027 */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <span className="p-2 bg-amber-100 rounded-lg text-amber-800">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Cuti Umum Khas Negeri Sabah 2027</h3>
              <p className="text-[11px] text-slate-500">Termasuk cuti khusus Sabah yang diwartakan oleh Kerajaan Negeri</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {cutiSabah.map((cuti) => (
              <div
                key={cuti.id}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-emerald-50/50 hover:border-emerald-200 transition-all flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800">{cuti.nama}</span>
                    <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-amber-200 text-amber-900">
                      Sabah
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{cuti.penerangan}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-emerald-800">{cuti.tarikhMula}</div>
                  <div className="text-[10px] text-slate-400">{cuti.bilHari} Hari</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kolum 2: Tambahan Cuti Perayaan KPM Kumpulan B */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <span className="p-2 bg-pink-100 rounded-lg text-pink-800">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Tambahan Cuti Perayaan KPM 2027 (Kumpulan B)</h3>
              <p className="text-[11px] text-slate-500">Peruntukan Lampiran C Kementerian Pendidikan Malaysia</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {cutiTambahanKPM.map((cuti) => (
              <div
                key={cuti.id}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-pink-50/50 hover:border-pink-200 transition-all flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800">{cuti.nama}</span>
                    <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-pink-100 text-pink-800">
                      KPM B
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{cuti.penerangan}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-pink-700">{cuti.tarikhMula}</div>
                  <div className="text-[10px] text-slate-400">{cuti.bilHari} Hari Peruntukan</div>
                </div>
              </div>
            ))}

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700" /> Catatan Tambahan KPM:
              </div>
              <p className="text-[11px] text-amber-800">
                • Perayaan Hari Raya Puasa jatuh dalam Cuti Penggal 1, Tahun 2027.<br />
                • Pesta Kaamatan (30 & 31 Mei) dan Hari Gawai Dayak (01 & 02 Jun) jatuh dalam Cuti Pertengahan Tahun 2027.<br />
                • Hari Krismas (25 Disember) jatuh dalam Cuti Akhir Persekolahan Tahun 2027.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
