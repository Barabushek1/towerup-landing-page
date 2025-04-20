
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistance } from 'date-fns';
import { useAdmin } from '@/contexts/AdminContext';

const AdminAuditLogs: React.FC = () => {
  const { admin } = useAdmin();

  const { data: auditLogs = [], isLoading, error } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_audit_logs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data;
    },
    enabled: !!admin // Only fetch if admin is logged in
  });

  if (isLoading) {
    return <div className="p-6">Загрузка...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Ошибка загрузки логов: {error.message}</div>;
  }

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700">
      <h1 className="text-3xl font-bold text-white p-6">Журнал действий администратора</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Тип действия</TableHead>
            <TableHead>Email администратора</TableHead>
            <TableHead>IP-адрес</TableHead>
            <TableHead>Время</TableHead>
            <TableHead>Детали</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {auditLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{log.action_type}</TableCell>
              <TableCell>{log.admin_email}</TableCell>
              <TableCell>{log.ip_address}</TableCell>
              <TableCell>
                {formatDistance(new Date(log.created_at), new Date(), { addSuffix: true })}
              </TableCell>
              <TableCell>
                <pre className="text-xs overflow-hidden text-ellipsis max-w-[200px]">
                  {log.details ? JSON.stringify(JSON.parse(log.details), null, 2) : 'Нет деталей'}
                </pre>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminAuditLogs;
