import React, { useState, useEffect, useCallback } from 'react';
import { AktivitiTakwim, AuditLogItem, PenggunaGuru, PerananPengguna } from './types/takwim';
import { Header } from './components/Header';
import { CutiBanner } from './components/CutiBanner';
import { KalendarBulanView } from './components/KalendarBulanView';
import { SenaraiAktivitiView } from './components/SenaraiAktivitiView';
import { PenggalKPMView } from './components/PenggalKPMView';
import { PengurusanPerananModal } from './components/PengurusanPerananModal';
import { AktivitiFormModal } from './components/AktivitiFormModal';
import { AuditLogView } from './components/AuditLogView';
import { CetakTakwimModal } from './components/CetakTakwimModal';
import { CarianPantasModal } from './components/CarianPantasModal';
import { IntegrasiKalendarModal } from './components/IntegrasiKalendarModal';
import { SENARAI_30_GURU } from './data/guruData';
import { SEED_AKTIVITI_2027 } from './data/seedAktiviti';
import { Sparkles, Bell, CheckCircle2, ShieldAlert, Wifi } from 'lucide-react';

export default function App() {
  const [aktivitiList, setAktivitiList] = useState<AktivitiTakwim[]>(SEED_AKTIVITI_2027);
  const [senaraiGuru, setSenaraiGuru] = useState<PenggunaGuru[]>(SENARAI_30_GURU);
  const [currentUser, setCurrentUser] = useState<PenggunaGuru>(SENARAI_30_GURU[0]); // En Madin bin Gunting (Guru Besar / Pentadbir)
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [tabAktif, setTabAktif] = useState<'kalendar' | 'senarai' | 'penggal' | 'peranan' | 'audit'>('kalendar');

  // Modal States
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedAktivitiForEdit, setSelectedAktivitiForEdit] = useState<AktivitiTakwim | null>(null);
  const [tarikhAwalTambah, setTarikhAwalTambah] = useState<string | undefined>('2027-01-04');
  const [perananModalOpen, setPerananModalOpen] = useState(false);
  const [cetakModalOpen, setCetakModalOpen] = useState(false);
  const [carianModalOpen, setCarianModalOpen] = useState(false);
  const [integrasiModalOpen, setIntegrasiModalOpen] = useState(false);

  // Real-time SSE State
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const [activeClientsCount, setActiveClientsCount] = useState(1);
  const [notifikasiMasaNyata, setNotifikasiMasaNyata] = useState<{
    id: string;
    tajuk: string;
    keterangan: string;
  } | null>(null);

  // Fetch initial data
  const muatTurunData = useCallback(async () => {
    try {
      const [resAkt, resGuru, resAudit] = await Promise.all([
        fetch('/api/aktiviti').then((r) => r.json()),
        fetch('/api/guru').then((r) => r.json()),
        fetch('/api/audit').then((r) => r.json()),
      ]);

      if (resAkt.success && Array.isArray(resAkt.data)) {
        setAktivitiList(resAkt.data);
      }
      if (resGuru.success && Array.isArray(resGuru.data)) {
        setSenaraiGuru(resGuru.data);
        // Sync current user with updated role if exists
        setCurrentUser((prev) => resGuru.data.find((g: PenggunaGuru) => g.id === prev.id) || prev);
      }
      if (resAudit.success && Array.isArray(resAudit.data)) {
        setAuditLogs(resAudit.data);
      }
    } catch (err) {
      console.warn('Menggunakan data tempatan:', err);
    }
  }, []);

  useEffect(() => {
    muatTurunData();
  }, [muatTurunData]);

  // Connect to SSE for Real-Time Updates
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/takwim/stream');

      eventSource.onopen = () => {
        setIsRealtimeConnected(true);
      };

      eventSource.addEventListener('init', (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          if (data.activeClients) setActiveClientsCount(data.activeClients);
        } catch {}
      });

      eventSource.addEventListener('bilangan_guru_aktif', (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          if (data.count) setActiveClientsCount(data.count);
        } catch {}
      });

      eventSource.addEventListener('aktiviti_dicipta', (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          if (data.aktiviti) {
            setAktivitiList((prev) => {
              if (prev.some((a) => a.id === data.aktiviti.id)) return prev;
              return [data.aktiviti, ...prev];
            });
            if (data.audit) {
              setAuditLogs((prev) => [data.audit, ...prev]);
            }
            // Show toast notification
            setNotifikasiMasaNyata({
              id: String(Date.now()),
              tajuk: 'Aktiviti Ditambah (Masa Nyata)',
              keterangan: `"${data.aktiviti.nama}" ditambah oleh ${data.aktiviti.dicatatOleh}`,
            });
          }
        } catch (err) {
          console.error(err);
        }
      });

      eventSource.addEventListener('aktiviti_dikemaskini', (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          if (data.aktiviti) {
            setAktivitiList((prev) =>
              prev.map((a) => (a.id === data.aktiviti.id ? data.aktiviti : a))
            );
            if (data.audit) {
              setAuditLogs((prev) => [data.audit, ...prev]);
            }
            setNotifikasiMasaNyata({
              id: String(Date.now()),
              tajuk: 'Aktiviti Dikemaskini (Masa Nyata)',
              keterangan: `"${data.aktiviti.nama}" dikemaskini oleh ${data.aktiviti.updatedBy}`,
            });
          } else {
            // Full refresh
            muatTurunData();
          }
        } catch (err) {
          console.error(err);
        }
      });

      eventSource.addEventListener('aktiviti_dipadam', (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          if (data.id) {
            setAktivitiList((prev) => prev.filter((a) => a.id !== data.id));
            if (data.audit) {
              setAuditLogs((prev) => [data.audit, ...prev]);
            }
            setNotifikasiMasaNyata({
              id: String(Date.now()),
              tajuk: 'Aktiviti Dipadam (Masa Nyata)',
              keterangan: `Aktiviti "${data.nama}" telah dipadam oleh pentadbir.`,
            });
          }
        } catch (err) {
          console.error(err);
        }
      });

      eventSource.addEventListener('peranan_dikemaskini', (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          if (data.guru) {
            setSenaraiGuru((prev) =>
              prev.map((g) => (g.id === data.guru.id ? data.guru : g))
            );
            setCurrentUser((prev) => (prev.id === data.guru.id ? data.guru : prev));
            if (data.audit) {
              setAuditLogs((prev) => [data.audit, ...prev]);
            }
            setNotifikasiMasaNyata({
              id: String(Date.now()),
              tajuk: 'Peranan Guru Dikemaskini',
              keterangan: `Peranan ${data.guru.nama} ditukar kepada "${data.guru.peranan}"`,
            });
          }
        } catch (err) {
          console.error(err);
        }
      });

      eventSource.addEventListener('senarai_guru_dikemaskini', (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          if (data.guruList) {
            setSenaraiGuru(data.guruList);
            if (data.audit) {
              setAuditLogs((prev) => [data.audit, ...prev]);
            }
          }
        } catch (err) {
          console.error(err);
        }
      });

      eventSource.onerror = () => {
        setIsRealtimeConnected(false);
      };
    } catch {
      setIsRealtimeConnected(false);
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [muatTurunData]);

  // Clear toast notification after 5s
  useEffect(() => {
    if (notifikasiMasaNyata) {
      const timer = setTimeout(() => setNotifikasiMasaNyata(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notifikasiMasaNyata]);

  // Pintasan Papan Kekunci Ctrl+K / Cmd+K untuk Carian Pantas
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCarianModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle Form Submit
  const handleSimpanAktiviti = async (aktivitiData: Partial<AktivitiTakwim>) => {
    if (selectedAktivitiForEdit) {
      // Edit
      const res = await fetch(`/api/aktiviti/${selectedAktivitiForEdit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...aktivitiData,
          perananPengguna: currentUser.peranan,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setAktivitiList((prev) =>
        prev.map((a) => (a.id === selectedAktivitiForEdit.id ? json.data : a))
      );
    } else {
      // Create
      const res = await fetch('/api/aktiviti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...aktivitiData,
          guruBertanggungjawabId: currentUser.id,
          perananPengguna: currentUser.peranan,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setAktivitiList((prev) => [json.data, ...prev]);
    }
  };

  // Handle Delete
  const handlePadamAktiviti = async (id: string, nama: string) => {
    if (!window.confirm(`Adakah anda pasti ingin memadamkan aktiviti "${nama}" daripada takwim?`)) {
      return;
    }
    const res = await fetch(
      `/api/aktiviti/${id}?oleh=${encodeURIComponent(currentUser.nama)}&peranan=${encodeURIComponent(
        currentUser.peranan
      )}`,
      { method: 'DELETE' }
    );
    const json = await res.json();
    if (json.success) {
      setAktivitiList((prev) => prev.filter((a) => a.id !== id));
    } else {
      alert(json.message || 'Gagal memadam.');
    }
  };

  // Handle Role Change
  const handleKemasKiniPeranan = async (guruId: string, perananBaru: PerananPengguna) => {
    const res = await fetch(`/api/guru/${guruId}/peranan`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        peranan: perananBaru,
        diubahOleh: currentUser.nama,
      }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    setSenaraiGuru((prev) => prev.map((g) => (g.id === guruId ? json.data : g)));
    if (currentUser.id === guruId) {
      setCurrentUser(json.data);
    }
  };

  // Tambah Guru Baharu
  const handleTambahGuru = async (guruData: Partial<PenggunaGuru>) => {
    const res = await fetch('/api/guru', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...guruData,
        ditambahOleh: currentUser.nama,
      }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    setSenaraiGuru((prev) => [...prev, json.data]);
  };

  // Kemaskini Profil Penuh Guru
  const handleKemaskiniProfilGuru = async (guruId: string, guruData: Partial<PenggunaGuru>) => {
    const res = await fetch(`/api/guru/${guruId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...guruData,
        dikemaskiniOleh: currentUser.nama,
      }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    setSenaraiGuru((prev) => prev.map((g) => (g.id === guruId ? json.data : g)));
    if (currentUser.id === guruId) {
      setCurrentUser(json.data);
    }
  };

  // Padam / Pindahkan Guru
  const handlePadamGuru = async (guruId: string) => {
    const res = await fetch(`/api/guru/${guruId}?oleh=${encodeURIComponent(currentUser.nama)}`, {
      method: 'DELETE',
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    setSenaraiGuru((prev) => prev.filter((g) => g.id !== guruId));
  };

  // Export CSV
  const handleEksportCSV = () => {
    window.location.href = '/api/export/csv';
  };

  // Reset database
  const handleSetSemula = async () => {
    if (
      !window.confirm(
        'PERHATIAN PENTADBIR: Adakah anda pasti ingin menetapkan semula data takwim ke nilai permulaan 2027?'
      )
    ) {
      return;
    }
    const res = await fetch('/api/reset', { method: 'POST' });
    const json = await res.json();
    if (json.success) {
      muatTurunData();
      alert('Pangkalan data takwim telah diset semula.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 font-sans text-slate-800 antialiased selection:bg-emerald-500 selection:text-white pb-16">
      {/* Header Utama Sekolah */}
      <Header
        currentUser={currentUser}
        senaraiGuru={senaraiGuru}
        onTukarPengguna={setCurrentUser}
        tabAktif={tabAktif}
        setTabAktif={setTabAktif}
        isRealtimeConnected={isRealtimeConnected}
        activeClientsCount={activeClientsCount}
        onBukaPerananModal={() => setPerananModalOpen(true)}
        onSetSemulaData={handleSetSemula}
        onBukaCarianModal={() => setCarianModalOpen(true)}
        onBukaIntegrasiModal={() => setIntegrasiModalOpen(true)}
      />

      {/* Kandungan Halaman Utama */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Banner Kalendar KPM & Cuti Penting Sabah (Sentiasa Ada di Setiap Antaramuka) */}
        <CutiBanner
          onPilihCuti={(cuti) => {
            setTarikhAwalTambah(cuti.tarikhMula);
            setSelectedAktivitiForEdit(null);
            setFormModalOpen(true);
          }}
        />

        {/* Tab 1: Kalendar Bulanan 2027 */}
        {tabAktif === 'kalendar' && (
          <KalendarBulanView
            aktivitiList={aktivitiList}
            currentUser={currentUser}
            onTambahAktiviti={(tarikh) => {
              setTarikhAwalTambah(tarikh);
              setSelectedAktivitiForEdit(null);
              setFormModalOpen(true);
            }}
            onSuntingAktiviti={(akt) => {
              setSelectedAktivitiForEdit(akt);
              setFormModalOpen(true);
            }}
            onPadamAktiviti={handlePadamAktiviti}
          />
        )}

        {/* Tab 2: Senarai & Jadual Takwim */}
        {tabAktif === 'senarai' && (
          <SenaraiAktivitiView
            aktivitiList={aktivitiList}
            currentUser={currentUser}
            onTambahAktiviti={() => {
              setSelectedAktivitiForEdit(null);
              setFormModalOpen(true);
            }}
            onSuntingAktiviti={(akt) => {
              setSelectedAktivitiForEdit(akt);
              setFormModalOpen(true);
            }}
            onPadamAktiviti={handlePadamAktiviti}
            onEksportCSV={handleEksportCSV}
            onBukaIntegrasiModal={() => setIntegrasiModalOpen(true)}
          />
        )}

        {/* Tab 3: Penggal Persekolahan KPM 2027 & Cuti Sabah */}
        {tabAktif === 'penggal' && <PenggalKPMView />}

        {/* Tab 4: Pengurusan Peranan Guru (30 Orang Guru) */}
        {tabAktif === 'peranan' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Senarai & Had Akses 30 Orang Guru SK Timbang Kota Belud
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pengurus / Pentadbir boleh menetapkan peranan akses khusus (RBAC) bagi setiap pengguna.
                </p>
              </div>
              <button
                onClick={() => setPerananModalOpen(true)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                Ubah Peranan Akses
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {senaraiGuru.map((guru) => (
                <div
                  key={guru.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-emerald-300 transition-all flex items-start gap-3.5"
                >
                  <span className="text-2xl p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    {guru.avatar}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-bold text-xs text-slate-900 truncate">{guru.nama}</h3>
                      <span className="text-[10px] font-semibold text-slate-500">{guru.gred}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{guru.jawatan}</p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">{guru.emel}</p>
                    <div className="mt-2.5 flex items-center justify-between">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          guru.peranan === 'Pentadbir'
                            ? 'bg-rose-100 text-rose-800 border-rose-200'
                            : guru.peranan === 'Setiausaha Takwim'
                            ? 'bg-purple-100 text-purple-800 border-purple-200'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {guru.peranan}
                      </span>
                      <button
                        onClick={() => setCurrentUser(guru)}
                        className="text-[10px] text-emerald-700 font-semibold hover:underline"
                      >
                        Pilih Profil Ini
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Log Audit Masa Nyata */}
        {tabAktif === 'audit' && <AuditLogView logs={auditLogs} />}
      </main>

      {/* Modal Borang Tambah/Sunting Aktiviti */}
      <AktivitiFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleSimpanAktiviti}
        aktivitiAsal={selectedAktivitiForEdit}
        tarikhAwal={tarikhAwalTambah}
        currentUser={currentUser}
        senaraiGuru={senaraiGuru}
      />

      {/* Modal Pengurusan Peranan Guru */}
      <PengurusanPerananModal
        isOpen={perananModalOpen}
        onClose={() => setPerananModalOpen(false)}
        senaraiGuru={senaraiGuru}
        currentUser={currentUser}
        onKemasKiniPeranan={handleKemasKiniPeranan}
        onTambahGuru={handleTambahGuru}
        onKemaskiniProfilGuru={handleKemaskiniProfilGuru}
        onPadamGuru={handlePadamGuru}
      />

      {/* Modal Cetak Buku Takwim Sekolah */}
      <CetakTakwimModal
        isOpen={cetakModalOpen}
        onClose={() => setCetakModalOpen(false)}
        aktivitiList={aktivitiList}
        currentUser={currentUser}
      />

      {/* Modal Carian Pantas Global (Ctrl+K) */}
      <CarianPantasModal
        isOpen={carianModalOpen}
        onClose={() => setCarianModalOpen(false)}
        aktivitiList={aktivitiList}
        onPilihAktiviti={(akt) => {
          setSelectedAktivitiForEdit(akt);
          setFormModalOpen(true);
        }}
        onPilihTarikh={(tarikh) => {
          setTarikhAwalTambah(tarikh);
          setTabAktif('kalendar');
        }}
      />

      {/* Modal Integrasi Kalendar Telefon & Peringatan Pintar */}
      <IntegrasiKalendarModal
        isOpen={integrasiModalOpen}
        onClose={() => setIntegrasiModalOpen(false)}
        aktivitiList={aktivitiList}
        currentUser={currentUser}
      />

      {/* Toast Notifikasi Masa Nyata Apabila Guru Lain Mengemas Kini Takwim */}
      {notifikasiMasaNyata && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-start gap-3 max-w-sm animate-bounce-short">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
            <Wifi className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-300">{notifikasiMasaNyata.tajuk}</div>
            <div className="text-xs text-slate-200 mt-0.5">{notifikasiMasaNyata.keterangan}</div>
          </div>
        </div>
      )}
    </div>
  );
}
