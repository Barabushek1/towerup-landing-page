
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistance } from 'date-fns';
import { useAdmin } from '@/contexts/AdminContext';
import { Loader2, Shield } from 'lucide-react';

interface DetailedAuditLog {
  id: string;
  action_type: string;
  admin_email: string | null;
  browser: string | null;
  os: string | null;
  screen_resolution: string | null;
  timezone: string | null;
  language: string | null;
  platform: string | null;
  memory: string | null;
  cpu_cores: number | null;
  device_type: string | null;
  network_type: string | null;
  details: any;
  created_at: string;
}

const AdminDetailedAuditLogs: React.FC = () => {
  const { admin } = useAdmin();
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { 
    data: auditLogs = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['detailed-audit-logs', page],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);
      
      if (error) {
        throw error;
      }
      
      return data as DetailedAuditLog[];
    },
    enabled: !!admin
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500">Ошибка загрузки логов: {error.message}</div>;
  }

  // Safely format details
  const formatDetails = (details: any): string => {
    if (!details) return 'Нет деталей';
    
    try {
      const detailsObj = typeof details === 'string' ? JSON.parse(details) : details;
      return JSON.stringify(detailsObj, null, 2);
    } catch (e) {
      return 'Неверный формат данных';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" />
          Системный журнал
        </h1>
      </div>
      
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Тип</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Браузер</TableHead>
              <TableHead>ОС</TableHead>
              <TableHead>Устройство</TableHead>
              <TableHead>Платформа</TableHead>
              <TableHead>Время</TableHead>
              <TableHead>Детали</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLogs.length > 0 ? (
              auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.action_type}</TableCell>
                  <TableCell>{log.admin_email || 'Неизвестно'}</TableCell>
                  <TableCell>{log.browser || 'Неизвестно'}</TableCell>
                  <TableCell>{log.os || 'Неизвестно'}</TableCell>
                  <TableCell>{log.device_type || 'Неизвестно'}</TableCell>
                  <TableCell>{log.platform || 'Неизвестно'}</TableCell>
                  <TableCell>
                    {formatDistance(new Date(log.created_at), new Date(), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="max-w-[250px]">
                    <pre className="text-xs overflow-hidden text-ellipsis whitespace-pre-wrap">
                      {formatDetails(log.details)}
                    </pre>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Журнал пуст
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex justify-between p-4">
          <button 
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-slate-700 text-white rounded disabled:opacity-50"
          >
            Назад
          </button>
          <button 
            onClick={() => setPage(page + 1)}
            disabled={auditLogs.length < pageSize}
            className="px-4 py-2 bg-slate-700 text-white rounded disabled:opacity-50"
          >
            Вперед
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDetailedAuditLogs;
