import React from 'react';
import { AuditLogItem } from '../types/takwim';
import { Clock, PlusCircle, Edit3, Trash2, Shield, FileSpreadsheet, UserCheck } from 'lucide-react';

interface AuditLogViewProps {
  logs: AuditLogItem[];
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ logs }) => {
  const getActionBadge = (tindakan: string) => {
    switch (tindakan) {
      case 'TAMBAH':
        return {
          icon: <PlusCircle className="w-4 h-4 text-emerald-600" />,
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        };
      case 'KEMASKINI':
        return {
          icon: <Edit3 className="w-4 h-4 text-blue-600" />,
          badge: 'bg-blue-100 text-blue-800 border-blue-200',
        };
      case 'PADAM':
        return {
          icon: <Trash2 className="w-4 h-4 text-rose-600" />,
          badge: 'bg-rose-100 text-rose-800 border-rose-200',
        };
      case 'TUKAR_PERANAN':
        return {
          icon: <Shield className="w-4 h-4 text-purple-600" />,
          badge: 'bg-purple-100 text-purple-800 border-purple-200',
        };
      case 'IMPORT_DATA':
        return {
          icon: <FileSpreadsheet className="w-4 h-4 text-amber-600" />,
          badge: 'bg-amber-100 text-amber-800 border-amber-200',
        };
      default:
        return {
          icon: <Clock className="w-4 h-4 text-slate-600" />,
          badge: 'bg-slate-100 text-slate-800 border-slate-200',
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <Clock className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">Log Audit & Jejak Kemaskini Masa Nyata</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Merekod setiap tindakan penambahan, pengemaskinian, pemadaman aktiviti dan pertukaran peranan 30 orang guru secara telus.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          Jejak Masa Nyata Aktif ({logs.length} rekod)
        </div>
      </div>

      <div className="space-y-3">
        {logs.map((log) => {
          const actionStyle = getActionBadge(log.tindakan);
          const dateObj = new Date(log.timestamp);
          const formattedDate = dateObj.toLocaleDateString('ms-MY', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });

          return (
            <div
              key={log.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs mt-0.5">
                  {actionStyle.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${actionStyle.badge}`}>
                      {log.tindakan}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{log.aktivitiNama || 'Takwim Sekolah'}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{log.catatan}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1.5">
                    <span className="flex items-center gap-1 font-medium text-slate-600">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      {log.dilakukanOleh} ({log.peranan})
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0 text-slate-400 text-[11px] font-mono sm:self-center">
                {formattedDate}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
