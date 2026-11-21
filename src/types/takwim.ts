export type KategoriAktiviti =
  | 'Kurikulum'
  | 'Hal Ehwal Murid (HEM)'
  | 'Kokurikulum'
  | 'Pentadbiran & Guru'
  | 'Peperiksaan & Pentaksiran'
  | 'Sambutan / Khas'
  | 'LDP / PLC';

export type StatusAktiviti = 'Dirancang' | 'Sedang Berlangsung' | 'Selesai' | 'Ditunda';
export type KeutamaanAktiviti = 'Tinggi' | 'Sederhana' | 'Biasa';

export type PerananPengguna =
  | 'Pentadbir'
  | 'Setiausaha Takwim'
  | 'Penyelaras HEM'
  | 'Penyelaras Kokurikulum'
  | 'Guru Panitia'
  | 'Guru Biasa'
  | 'Pemerhati';

export interface AktivitiTakwim {
  id: string;
  nama: string;
  tarikhMula: string; // YYYY-MM-DD
  tarikhTamat: string; // YYYY-MM-DD
  masaMula?: string; // HH:mm
  masaTamat?: string; // HH:mm
  kategori: KategoriAktiviti;
  tempat: string;
  penerangan: string;
  dicatatOleh: string;
  guruBertanggungjawabId?: string;
  sasaran: string; // cth: Semua Murid, Tahun 6, Prasekolah, Guru & AKP
  status: StatusAktiviti;
  keutamaan: KeutamaanAktiviti;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
}

export interface CutiSekolah {
  id: string;
  nama: string;
  jenis: 'Cuti Penggal KPM' | 'Cuti Umum Sabah' | 'Cuti Perayaan KPM' | 'Cuti Peristiwa / Khas';
  tarikhMula: string;
  tarikhTamat: string;
  bilHari: number;
  penerangan: string;
  isSabahHoliday?: boolean;
  badgeColor: string;
}

export interface PenggalPersekolahan {
  penggal: number;
  nama: string;
  tarikhMula: string;
  tarikhTamat: string;
  jumlahMinggu: number;
  jumlahHari: number;
  cutiBerikutnya: string;
  tarikhCutiMula: string;
  tarikhCutiTamat: string;
  bilHariCuti: number;
}

export interface PenggunaGuru {
  id: string;
  nama: string;
  jawatan: string;
  gred: string;
  emel: string;
  peranan: PerananPengguna;
  unit: 'Pentadbiran' | 'Kurikulum' | 'HEM' | 'Kokurikulum' | 'Prasekolah' | 'Pendidikan Khas';
  avatar: string;
  noTelefon?: string;
  terakhirAktif?: string;
}

export interface AuditLogItem {
  id: string;
  aktivitiId?: string;
  aktivitiNama?: string;
  tindakan: 'TAMBAH' | 'KEMASKINI' | 'PADAM' | 'TUKAR_PERANAN' | 'IMPORT_DATA';
  dilakukanOleh: string;
  peranan: string;
  timestamp: string;
  catatan: string;
}
