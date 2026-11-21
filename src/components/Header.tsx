import React, { useState } from 'react';
import { PenggunaGuru } from '../types/takwim';
import {
  Calendar,
  ListFilter,
  Shield,
  Clock,
  Radio,
  User,
  ChevronDown,
  RotateCcw,
  Sparkles,
  School,
  FileSpreadsheet,
  Search,
  Smartphone,
} from 'lucide-react';

interface HeaderProps {
  currentUser: PenggunaGuru;
  senaraiGuru: PenggunaGuru[];
  onTukarPengguna: (guru: PenggunaGuru) => void;
  tabAktif: 'kalendar' | 'senarai' | 'penggal' | 'peranan' | 'audit';
  setTabAktif: (tab: 'kalendar' | 'senarai' | 'penggal' | 'peranan' | 'audit') => void;
  isRealtimeConnected: boolean;
  activeClientsCount: number;
  onBukaPerananModal: () => void;
  onSetSemulaData: () => void;
  onBukaCarianModal: () => void;
  onBukaIntegrasiModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  senaraiGuru,
  onTukarPengguna,
  tabAktif,
  setTabAktif,
  isRealtimeConnected,
  activeClientsCount,
  onBukaPerananModal,
  onSetSemulaData,
  onBukaCarianModal,
  onBukaIntegrasiModal,
}) => {
  const [bukaUserMenu, setBukaUserMenu] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Bahagian Atas: Identiti Sekolah, Logo & Status Masa Nyata */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 py-3 border-b border-slate-100">
          {/* Logo & Nama Sekolah */}
          <div className="flex items-center gap-3">
            <img
              src="/public/assets/aistudio/logo_sk_timbang_3d_85d10bb0.jpeg"
              alt="Logo SK Timbang Kota Belud"
              className="w-12 h-12 object-contain drop-shadow-md rounded-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  KOD SEKOLAH: XBA5232
                </span>
                <span className="text-[10px] font-semibold text-slate-500 italic">
                  &ldquo;DEDIKASI TERAS KEJAYAAN&rdquo;
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                SEK. KEB. TIMBANG KOTA BELUD, SABAH
              </h1>
              <p className="text-[11px] font-semibold text-emerald-700">
                Sistem E-Takwim Persekolahan & Aktiviti Akademik Sesi 2027
              </p>
            </div>
          </div>

          {/* Indikator Masa Nyata (SSE), Butang Carian Pantas, Integrasi Telefon & Pemilih Guru */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            {/* Butang Carian Pantas Takwim (Tanpa Scroll) */}
            <button
              onClick={onBukaCarianModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-emerald-800 transition-all shadow-2xs group"
              title="Carian pantas aktiviti merentasi seluruh 2027"
            >
              <Search className="w-3.5 h-3.5 text-emerald-700 group-hover:scale-110 transition-transform" />
              <span>Cari</span>
              <kbd className="hidden sm:inline text-[9px] font-mono bg-white px-1.5 py-0.2 rounded border border-slate-300 text-slate-400">
                Ctrl+K
              </kbd>
            </button>

            {/* Butang Segerak Kalendar Telefon */}
            <button
              onClick={onBukaIntegrasiModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white border border-emerald-700 text-xs font-bold transition-all shadow-2xs hover:shadow-xs group"
              title="Masukkan aktiviti dan penggera peringatan ke kalendar telefon anda"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-300 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Kalendar Telefon</span>
              <span className="sm:hidden">Kalendar</span>
            </button>

            {/* Status Masa Nyata */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                isRealtimeConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
              title="Sambungan Server-Sent Events masa nyata untuk 30 orang guru"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isRealtimeConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              ></span>
              <span className="hidden sm:inline">
                {isRealtimeConnected ? 'Masa Nyata Aktif' : 'Menyambung...'}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-white text-slate-600 border border-slate-200 font-mono">
                {activeClientsCount} Guru Aktif
              </span>
            </div>

            {/* Menu Tukar Guru / Peranan (Simulasi Login 30 Guru) */}
            <div className="relative">
              <button
                onClick={() => setBukaUserMenu(!bukaUserMenu)}
                className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-800 transition-all shadow-xs"
              >
                <span className="text-lg">{currentUser.avatar}</span>
                <div className="text-left hidden sm:block">
                  <div className="font-bold text-slate-900 leading-tight">{currentUser.nama}</div>
                  <div className="text-[10px] text-emerald-700 font-semibold">{currentUser.peranan}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </button>

              {/* Dropdown Menu Senarai 30 Guru */}
              {bukaUserMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn max-h-96 overflow-y-auto">
                  <div className="px-4 py-2 border-b border-slate-100 bg-slate-50">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Log Masuk Sebagai (30 Guru):</div>
                    <div className="text-xs font-bold text-slate-800 mt-0.5">
                      Pilih mana-mana guru untuk menguji had akses dan peranan
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {senaraiGuru.map((guru) => (
                      <button
                        key={guru.id}
                        onClick={() => {
                          onTukarPengguna(guru);
                          setBukaUserMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center justify-between text-xs transition-colors ${
                          guru.id === currentUser.id ? 'bg-emerald-50/70 font-bold' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{guru.avatar}</span>
                          <div>
                            <div className="text-slate-900 font-semibold">{guru.nama}</div>
                            <div className="text-[10px] text-slate-500">{guru.jawatan}</div>
                          </div>
                        </div>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                            guru.peranan === 'Pentadbir'
                              ? 'bg-rose-100 text-rose-800'
                              : guru.peranan === 'Setiausaha Takwim'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {guru.peranan}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="p-2 border-t border-slate-100 bg-slate-50">
                    <button
                      onClick={() => {
                        setBukaUserMenu(false);
                        onBukaPerananModal();
                      }}
                      className="w-full py-1.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold text-center block transition-colors"
                    >
                      Buka Pengurusan Peranan Penuh
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Butang Set Semula Data (Untuk Pentadbir) */}
            {currentUser.peranan === 'Pentadbir' && (
              <button
                onClick={onSetSemulaData}
                title="Set semula takwim ke data asal"
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Bahagian Bawah: Navigasi Tab */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 scrollbar-none">
          <button
            onClick={() => setTabAktif('kalendar')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              tabAktif === 'kalendar'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Kalendar Bulanan 2027
          </button>

          <button
            onClick={() => setTabAktif('senarai')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              tabAktif === 'senarai'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            Senarai & Jadual Takwim
          </button>

          <button
            onClick={() => setTabAktif('penggal')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              tabAktif === 'penggal'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <School className="w-4 h-4" />
            Penggal KPM & Cuti Sabah
          </button>

          <button
            onClick={() => setTabAktif('peranan')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              tabAktif === 'peranan'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            Akses Guru (30 Orang)
          </button>

          <button
            onClick={() => setTabAktif('audit')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              tabAktif === 'audit'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            Log Aktiviti Masa Nyata
          </button>
        </nav>
      </div>
    </header>
  );
};
