import { AktivitiTakwim } from '../types/takwim';
import { SENARAI_CUTI_2027 } from '../data/kalendarKPM2027';

/**
 * Jana fail piawai iCalendar (.ics) yang disokong secara asli oleh:
 * - Google Calendar (Android / Web)
 * - Apple Calendar (iPhone / iPad / Mac)
 * - Microsoft Outlook / Samsung Calendar
 *
 * Mengandungi VALARM supaya telefon pengguna membunyikan peringatan (notifikasi).
 */

function formatICSDate(dateStr: string, timeStr?: string): string {
  // dateStr: YYYY-MM-DD, timeStr: HH:mm
  const cleanDate = dateStr.replace(/-/g, '');
  if (!timeStr) {
    return cleanDate; // All-day format: YYYYMMDD
  }
  const cleanTime = timeStr.replace(/:/g, '') + '00';
  return `${cleanDate}T${cleanTime}`;
}

export function generateICSContent(
  aktivitiList: AktivitiTakwim[],
  termasukCuti: boolean = true,
  guruFilterNama?: string
): string {
  const events: string[] = [];

  const senaraiDitapis = guruFilterNama
    ? aktivitiList.filter(
        (a) =>
          a.dicatatOleh.toLowerCase().includes(guruFilterNama.toLowerCase()) ||
          a.sasaran.toLowerCase().includes('semua') ||
          a.kategori === 'Pentadbiran & Guru'
      )
    : aktivitiList;

  // 1. Masukkan Aktiviti Persekolahan SK Timbang
  for (const akt of senaraiDitapis) {
    const dtStart = formatICSDate(akt.tarikhMula, akt.masaMula);
    // Jika ada masa tamat, gunakan, atau tambah 1 jam
    const dtEnd = formatICSDate(akt.tarikhTamat, akt.masaTamat || (akt.masaMula ? '14:00' : undefined));
    const nowStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const desc = `${akt.penerangan || akt.nama}\n\nKategori: ${akt.kategori}\nSasaran: ${akt.sasaran}\nDicatat Oleh: ${akt.dicatatOleh}\nSekolah: SK Timbang Kota Belud (XBA5232)`.replace(/\n/g, '\\n');

    events.push(`BEGIN:VEVENT
UID:${akt.id}@sktimbang.edu.my
DTSTAMP:${nowStamp}
SUMMARY:[SK Timbang] ${akt.nama}
DESCRIPTION:${desc}
LOCATION:${akt.tempat || 'SK Timbang Kota Belud'}
DTSTART${akt.masaMula ? '' : ';VALUE=DATE'}:${dtStart}
DTEND${akt.masaMula ? '' : ';VALUE=DATE'}:${dtEnd}
STATUS:CONFIRMED
CATEGORIES:${akt.kategori}
BEGIN:VALARM
TRIGGER:-P1D
ACTION:DISPLAY
DESCRIPTION:Peringatan Takwim SK Timbang: ${akt.nama} esok!
END:VALARM
BEGIN:VALARM
TRIGGER:-PT1H
ACTION:DISPLAY
DESCRIPTION:Peringatan Takwim SK Timbang: ${akt.nama} dalam masa 1 jam!
END:VALARM
END:VEVENT`);
  }

  // 2. Masukkan Cuti Sekolah & Cuti Sabah jika dipilih
  if (termasukCuti) {
    for (const cuti of SENARAI_CUTI_2027) {
      const dtStart = formatICSDate(cuti.tarikhMula);
      // Untuk all-day event dalam iCal, tarikh tamat adalah hari berikutnya atau tarikh tamat
      const dtEnd = formatICSDate(cuti.tarikhTamat);
      const nowStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

      events.push(`BEGIN:VEVENT
UID:${cuti.id}@sktimbang.edu.my
DTSTAMP:${nowStamp}
SUMMARY:🎉 [CUTI] ${cuti.nama}
DESCRIPTION:${cuti.penerangan}\\nJenis: ${cuti.jenis}
LOCATION:Sabah / Malaysia
DTSTART;VALUE=DATE:${dtStart}
DTEND;VALUE=DATE:${dtEnd}
STATUS:CONFIRMED
CATEGORIES:Cuti
BEGIN:VALARM
TRIGGER:-P1D
ACTION:DISPLAY
DESCRIPTION:Peringatan Cuti: ${cuti.nama} bermula esok!
END:VALARM
END:VEVENT`);
    }
  }

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SK Timbang Kota Belud//E-Takwim Persekolahan 2027//MS
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Takwim SK Timbang 2027
X-WR-CALDESC:Takwim Persekolahan & Kalendar Akademik KPM Kumpulan B Sabah Sesi 2027
X-WR-TIMEZONE:Asia/Kuala_Lumpur
${events.join('\n')}
END:VCALENDAR`;
}

/**
 * Muat turun fail .ics ke peranti pengguna
 */
export function downloadICSFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Cipta pautan langsung "Add to Google Calendar" untuk satu aktiviti
 */
export function getGoogleCalendarLink(akt: AktivitiTakwim): string {
  const title = encodeURIComponent(`[SK Timbang] ${akt.nama}`);
  const details = encodeURIComponent(
    `${akt.penerangan || ''}\n\nKategori: ${akt.kategori}\nSasaran: ${akt.sasaran}\nDicatat Oleh: ${akt.dicatatOleh}\nSK Timbang Kota Belud (XBA5232)`
  );
  const location = encodeURIComponent(akt.tempat || 'SK Timbang Kota Belud');

  // Format dates: YYYYMMDDTHHmmssZ or YYYYMMDD
  const start = akt.masaMula
    ? `${akt.tarikhMula.replace(/-/g, '')}T${akt.masaMula.replace(/:/g, '')}00`
    : akt.tarikhMula.replace(/-/g, '');

  const end = akt.masaTamat
    ? `${akt.tarikhTamat.replace(/-/g, '')}T${akt.masaTamat.replace(/:/g, '')}00`
    : akt.tarikhTamat.replace(/-/g, '');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
}
