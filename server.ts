import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { SEED_AKTIVITI_2027 } from './src/data/seedAktiviti.ts';
import { SENARAI_30_GURU } from './src/data/guruData.ts';
import { AktivitiTakwim, AuditLogItem, PenggunaGuru } from './src/types/takwim.ts';
import { generateICSContent } from './src/utils/icalGenerator.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DB_FILE = path.resolve(__dirname, 'data/takwim_db.json');

// Ensure data folder exists
const dataDir = path.dirname(DB_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

interface DatabaseSchema {
  aktiviti: AktivitiTakwim[];
  guru: PenggunaGuru[];
  auditLog: AuditLogItem[];
}

function loadDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed.aktiviti && Array.isArray(parsed.aktiviti)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Ralat membaca pangkalan data, menggunakan nilai asal:', err);
  }

  // Initial seed
  const initialData: DatabaseSchema = {
    aktiviti: [...SEED_AKTIVITI_2027],
    guru: [...SENARAI_30_GURU],
    auditLog: [
      {
        id: 'LOG-001',
        aktivitiNama: 'Sistem Dimulakan',
        tindakan: 'TAMBAH',
        dilakukanOleh: 'Sistem SK Timbang',
        peranan: 'Pentadbir',
        timestamp: new Date().toISOString(),
        catatan: 'Pangkalan data awal Takwim 2027 berjaya dimuatkan.',
      },
    ],
  };
  saveDatabase(initialData);
  return initialData;
}

function saveDatabase(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Gagal menyimpan ke DB_FILE:', err);
  }
}

let db = loadDatabase();

// Keep connected SSE response objects
const sseClients = new Set<Response>();

function broadcast(eventType: string, payload: any) {
  const message = `event: ${eventType}\ndata: ${JSON.stringify(payload)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(message);
    } catch {
      sseClients.delete(client);
    }
  }
}

app.use(express.json());

// API Routes
// 1. SSE Stream for Real-time Updates
app.get('/api/takwim/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  sseClients.add(res);

  // Send initial ping and active count
  res.write(`event: init\ndata: ${JSON.stringify({ activeClients: sseClients.size })}\n\n`);
  broadcast('bilangan_guru_aktif', { count: sseClients.size });

  // Heartbeat interval
  const heartbeat = setInterval(() => {
    try {
      res.write(':keepalive\n\n');
    } catch {
      clearInterval(heartbeat);
      sseClients.delete(res);
    }
  }, 25000);

  req.on('close', () => {
    clearInterval(heartbeat);
    sseClients.delete(res);
    broadcast('bilangan_guru_aktif', { count: sseClients.size });
  });
});

// 2. Senarai Aktiviti Takwim
app.get('/api/aktiviti', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: db.aktiviti,
    total: db.aktiviti.length,
  });
});

// 3. Tambah Aktiviti Baharu
app.post('/api/aktiviti', (req: Request, res: Response) => {
  const body = req.body;
  if (!body.nama || !body.tarikhMula || !body.kategori) {
    res.status(400).json({ success: false, message: 'Nama aktiviti, tarikh mula, dan kategori diperlukan.' });
    return;
  }

  const newId = `AKT-2027-${String(db.aktiviti.length + 1).padStart(3, '0')}-${Date.now().toString().slice(-4)}`;
  const now = new Date().toISOString();

  const aktivitiBaru: AktivitiTakwim = {
    id: newId,
    nama: body.nama.trim(),
    tarikhMula: body.tarikhMula,
    tarikhTamat: body.tarikhTamat || body.tarikhMula,
    masaMula: body.masaMula || '08:00',
    masaTamat: body.masaTamat || '13:00',
    kategori: body.kategori,
    tempat: body.tempat || 'Kawasan SK Timbang',
    penerangan: body.penerangan || '',
    dicatatOleh: body.dicatatOleh || 'Guru SK Timbang',
    guruBertanggungjawabId: body.guruBertanggungjawabId || '',
    sasaran: body.sasaran || 'Semua Warga Sekolah',
    status: body.status || 'Dirancang',
    keutamaan: body.keutamaan || 'Sederhana',
    createdAt: now,
    updatedAt: now,
    updatedBy: body.dicatatOleh || 'Guru SK Timbang',
  };

  db.aktiviti.unshift(aktivitiBaru);

  // Add audit log
  const auditItem: AuditLogItem = {
    id: `LOG-${Date.now()}`,
    aktivitiId: aktivitiBaru.id,
    aktivitiNama: aktivitiBaru.nama,
    tindakan: 'TAMBAH',
    dilakukanOleh: aktivitiBaru.dicatatOleh,
    peranan: body.perananPengguna || 'Guru',
    timestamp: now,
    catatan: `Menambah aktiviti "${aktivitiBaru.nama}" pada ${aktivitiBaru.tarikhMula}`,
  };
  db.auditLog.unshift(auditItem);
  if (db.auditLog.length > 100) db.auditLog.pop();

  saveDatabase(db);
  broadcast('aktiviti_dicipta', { aktiviti: aktivitiBaru, audit: auditItem });

  res.status(201).json({ success: true, data: aktivitiBaru });
});

// 4. Kemaskini Aktiviti
app.put('/api/aktiviti/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.aktiviti.findIndex((a) => a.id === id);
  if (index === -1) {
    res.status(404).json({ success: false, message: 'Aktiviti tidak dijumpai.' });
    return;
  }

  const body = req.body;
  const now = new Date().toISOString();
  const existing = db.aktiviti[index];

  const updated: AktivitiTakwim = {
    ...existing,
    ...body,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: now,
    updatedBy: body.updatedBy || body.dicatatOleh || existing.dicatatOleh,
  };

  db.aktiviti[index] = updated;

  const auditItem: AuditLogItem = {
    id: `LOG-${Date.now()}`,
    aktivitiId: updated.id,
    aktivitiNama: updated.nama,
    tindakan: 'KEMASKINI',
    dilakukanOleh: updated.updatedBy,
    peranan: body.perananPengguna || 'Guru',
    timestamp: now,
    catatan: `Mengemaskini "${updated.nama}" (Status: ${updated.status})`,
  };
  db.auditLog.unshift(auditItem);
  if (db.auditLog.length > 100) db.auditLog.pop();

  saveDatabase(db);
  broadcast('aktiviti_dikemaskini', { aktiviti: updated, audit: auditItem });

  res.json({ success: true, data: updated });
});

// 5. Padam Aktiviti
app.delete('/api/aktiviti/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.aktiviti.findIndex((a) => a.id === id);
  if (index === -1) {
    res.status(404).json({ success: false, message: 'Aktiviti tidak dijumpai.' });
    return;
  }

  const deleted = db.aktiviti[index];
  db.aktiviti.splice(index, 1);

  const now = new Date().toISOString();
  const pemadam = (req.query.oleh as string) || 'Pentadbir';

  const auditItem: AuditLogItem = {
    id: `LOG-${Date.now()}`,
    aktivitiId: deleted.id,
    aktivitiNama: deleted.nama,
    tindakan: 'PADAM',
    dilakukanOleh: pemadam,
    peranan: (req.query.peranan as string) || 'Pentadbir',
    timestamp: now,
    catatan: `Memadam aktiviti "${deleted.nama}"`,
  };
  db.auditLog.unshift(auditItem);
  if (db.auditLog.length > 100) db.auditLog.pop();

  saveDatabase(db);
  broadcast('aktiviti_dipadam', { id, nama: deleted.nama, audit: auditItem });

  res.json({ success: true, message: 'Aktiviti berjaya dipadam.' });
});

// 6. Senarai Guru & Pengurusan Akses Peranan
app.get('/api/guru', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: db.guru,
    total: db.guru.length,
  });
});

// 7. Kemaskini Peranan Guru (RBAC oleh Pengurus / Pentadbir)
app.put('/api/guru/:id/peranan', (req: Request, res: Response) => {
  const { id } = req.params;
  const { peranan, diubahOleh } = req.body;

  const guruIndex = db.guru.findIndex((g) => g.id === id);
  if (guruIndex === -1) {
    res.status(404).json({ success: false, message: 'Guru tidak dijumpai.' });
    return;
  }

  const guru = db.guru[guruIndex];
  const oldRole = guru.peranan;
  guru.peranan = peranan;
  db.guru[guruIndex] = guru;

  const now = new Date().toISOString();
  const auditItem: AuditLogItem = {
    id: `LOG-${Date.now()}`,
    aktivitiNama: `Peranan ${guru.nama}`,
    tindakan: 'TUKAR_PERANAN',
    dilakukanOleh: diubahOleh || 'Guru Besar',
    peranan: 'Pentadbir',
    timestamp: now,
    catatan: `Menukar peranan ${guru.nama} (${guru.jawatan}) dari "${oldRole}" kepada "${peranan}".`,
  };
  db.auditLog.unshift(auditItem);

  saveDatabase(db);
  broadcast('peranan_dikemaskini', { guru, audit: auditItem });

  res.json({ success: true, data: guru, message: `Peranan ${guru.nama} berjaya dikemaskini.` });
});

// 7a. Tambah Guru Baharu
app.post('/api/guru', (req: Request, res: Response) => {
  const { nama, jawatan, gred, emel, peranan, unit, noTelefon, ditambahOleh } = req.body;
  if (!nama || !emel) {
    res.status(400).json({ success: false, message: 'Nama dan emel guru diperlukan.' });
    return;
  }

  const newId = `GURU${String(db.guru.length + 1).padStart(2, '0')}`;
  const guruBaru: PenggunaGuru = {
    id: newId,
    nama: nama.trim(),
    jawatan: jawatan?.trim() || 'Guru Akademik',
    gred: gred?.trim() || 'DG41',
    emel: emel.trim(),
    peranan: peranan || 'Guru Biasa',
    unit: unit || 'Kurikulum',
    avatar: '👨‍🏫',
    noTelefon: noTelefon || '',
    terakhirAktif: 'Baru ditambah',
  };

  db.guru.push(guruBaru);

  const now = new Date().toISOString();
  const auditItem: AuditLogItem = {
    id: `LOG-${Date.now()}`,
    aktivitiNama: `Daftar Guru: ${guruBaru.nama}`,
    tindakan: 'TAMBAH',
    dilakukanOleh: ditambahOleh || 'Pentadbir',
    peranan: 'Pentadbir',
    timestamp: now,
    catatan: `Mendaftar guru baharu: ${guruBaru.nama} (${guruBaru.jawatan}, ${guruBaru.gred}).`,
  };
  db.auditLog.unshift(auditItem);

  saveDatabase(db);
  broadcast('senarai_guru_dikemaskini', { guruList: db.guru, audit: auditItem });

  res.status(201).json({ success: true, data: guruBaru, message: 'Guru baharu berjaya didaftarkan.' });
});

// 7b. Kemaskini Profil Penuh Guru (Nama, Jawatan, Emel dll)
app.put('/api/guru/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.guru.findIndex((g) => g.id === id);
  if (index === -1) {
    res.status(404).json({ success: false, message: 'Guru tidak dijumpai.' });
    return;
  }

  const body = req.body;
  const existing = db.guru[index];
  const updatedGuru: PenggunaGuru = {
    ...existing,
    ...body,
    id: existing.id,
  };

  db.guru[index] = updatedGuru;

  const now = new Date().toISOString();
  const auditItem: AuditLogItem = {
    id: `LOG-${Date.now()}`,
    aktivitiNama: `Kemaskini Profil: ${updatedGuru.nama}`,
    tindakan: 'KEMASKINI',
    dilakukanOleh: body.dikemaskiniOleh || 'Pentadbir',
    peranan: 'Pentadbir',
    timestamp: now,
    catatan: `Mengemaskini profil maklumat guru: ${updatedGuru.nama} (${updatedGuru.jawatan}).`,
  };
  db.auditLog.unshift(auditItem);

  saveDatabase(db);
  broadcast('senarai_guru_dikemaskini', { guruList: db.guru, audit: auditItem });

  res.json({ success: true, data: updatedGuru, message: 'Profil guru berjaya dikemaskini.' });
});

// 7c. Padam / Pindahkan Guru
app.delete('/api/guru/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = db.guru.findIndex((g) => g.id === id);
  if (index === -1) {
    res.status(404).json({ success: false, message: 'Guru tidak dijumpai.' });
    return;
  }

  const dipadam = db.guru[index];
  db.guru.splice(index, 1);

  const now = new Date().toISOString();
  const auditItem: AuditLogItem = {
    id: `LOG-${Date.now()}`,
    aktivitiNama: `Padam Guru: ${dipadam.nama}`,
    tindakan: 'PADAM',
    dilakukanOleh: (req.query.oleh as string) || 'Pentadbir',
    peranan: 'Pentadbir',
    timestamp: now,
    catatan: `Memadam / memindahkan rekod guru: ${dipadam.nama}.`,
  };
  db.auditLog.unshift(auditItem);

  saveDatabase(db);
  broadcast('senarai_guru_dikemaskini', { guruList: db.guru, audit: auditItem });

  res.json({ success: true, message: `Rekod ${dipadam.nama} berjaya dipadam.` });
});

// 8. Dapatkan Senarai Audit Log
app.get('/api/audit', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: db.auditLog.slice(0, 50),
  });
});

// 9. Eksport CSV mengikut fail template TAKWIM_SK_TIMBANG_2027
app.get('/api/export/csv', (_req: Request, res: Response) => {
  const headers = ['ID AKTIVITI', 'NAMA AKTIVITI', 'TARIKH MULA', 'TARIKH TAMAT', 'KATEGORI', 'TEMPAT', 'PENERANGAN', 'DICATAT OLEH'];
  const rows = db.aktiviti.map((item) => {
    return [
      `"${item.id}"`,
      `"${item.nama.replace(/"/g, '""')}"`,
      `"${item.tarikhMula}"`,
      `"${item.tarikhTamat}"`,
      `"${item.kategori}"`,
      `"${(item.tempat || '').replace(/"/g, '""')}"`,
      `"${(item.penerangan || '').replace(/"/g, '""')}"`,
      `"${(item.dicatatOleh || '').replace(/"/g, '""')}"`,
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="TAKWIM_SK_TIMBANG_2027.csv"');
  res.status(200).send(csvContent);
});

// 9b. Eksport iCalendar (.ics) untuk Integrasi Kalendar Telefon (Google/Apple Calendar)
app.get('/api/export/ics', (req: Request, res: Response) => {
  const guruNama = req.query.guru as string | undefined;
  const termasukCuti = req.query.cuti !== 'false';

  const icsContent = generateICSContent(db.aktiviti, termasukCuti, guruNama);

  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="takwim_sk_timbang_2027.ics"');
  res.status(200).send(icsContent);
});

// 10. Import CSV
app.post('/api/import/csv', (req: Request, res: Response) => {
  const { csvText, diimportOleh } = req.body;
  if (!csvText || typeof csvText !== 'string') {
    res.status(400).json({ success: false, message: 'Kandungan CSV tidak sah.' });
    return;
  }

  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) {
    res.status(400).json({ success: false, message: 'Tiada baris data ditemui dalam CSV.' });
    return;
  }

  // Parse lines
  let importedCount = 0;
  const now = new Date().toISOString();

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parser supporting quotes
    const values: string[] = [];
    let insideQuotes = false;
    let currentValue = '';

    for (let charIndex = 0; charIndex < line.length; charIndex++) {
      const char = line[charIndex];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim());

    if (values.length >= 2 && values[1]) {
      const nama = values[1].replace(/^"|"$/g, '').trim();
      const tarikhMula = values[2]?.replace(/^"|"$/g, '').trim() || '2027-01-04';
      const tarikhTamat = values[3]?.replace(/^"|"$/g, '').trim() || tarikhMula;
      const kategori = (values[4]?.replace(/^"|"$/g, '').trim() || 'Kurikulum') as any;
      const tempat = values[5]?.replace(/^"|"$/g, '').trim() || 'SK Timbang';
      const penerangan = values[6]?.replace(/^"|"$/g, '').trim() || '';
      const dicatatOleh = values[7]?.replace(/^"|"$/g, '').trim() || diimportOleh || 'Guru SK Timbang';

      const newId = `AKT-2027-${String(db.aktiviti.length + 1).padStart(3, '0')}-${Date.now().toString().slice(-4)}`;
      db.aktiviti.push({
        id: newId,
        nama,
        tarikhMula,
        tarikhTamat,
        masaMula: '08:00',
        masaTamat: '13:00',
        kategori,
        tempat,
        penerangan,
        dicatatOleh,
        sasaran: 'Semua Warga Sekolah',
        status: 'Dirancang',
        keutamaan: 'Sederhana',
        createdAt: now,
        updatedAt: now,
        updatedBy: diimportOleh || 'Guru SK Timbang',
      });
      importedCount++;
    }
  }

  const auditItem: AuditLogItem = {
    id: `LOG-${Date.now()}`,
    aktivitiNama: `Import CSV (${importedCount} rekod)`,
    tindakan: 'IMPORT_DATA',
    dilakukanOleh: diimportOleh || 'Pentadbir',
    peranan: 'Pentadbir',
    timestamp: now,
    catatan: `Mengimport ${importedCount} aktiviti baharu daripada fail CSV.`,
  };
  db.auditLog.unshift(auditItem);

  saveDatabase(db);
  broadcast('aktiviti_dikemaskini', { total: db.aktiviti.length, audit: auditItem });

  res.json({ success: true, count: importedCount, message: `Berjaya mengimport ${importedCount} aktiviti.` });
});

// 11. Set Semula ke Nilai Asal
app.post('/api/reset', (_req: Request, res: Response) => {
  db = {
    aktiviti: [...SEED_AKTIVITI_2027],
    guru: [...SENARAI_30_GURU],
    auditLog: [
      {
        id: `LOG-${Date.now()}`,
        aktivitiNama: 'Set Semula Pangkalan Data',
        tindakan: 'KEMASKINI',
        dilakukanOleh: 'Pentadbir Sistem',
        peranan: 'Pentadbir',
        timestamp: new Date().toISOString(),
        catatan: 'Data takwim disetkan semula kepada takwim piawai sesi 2027.',
      },
    ],
  };
  saveDatabase(db);
  broadcast('aktiviti_dikemaskini', { message: 'Reset data selesai' });
  res.json({ success: true, message: 'Data telah diset semula kepada nilai piawai.' });
});

// Serve frontend in production or mount Vite in dev
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Takwim SK Timbang 2027 beroperasi pada port ${PORT}`);
  });
}

startServer();
