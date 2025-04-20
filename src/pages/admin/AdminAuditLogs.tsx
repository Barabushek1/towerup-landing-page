
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistance } from 'date-fns';
import { useAdmin } from '@/contexts/AdminContext';
import { Loader2 } from 'lucide-react';

interface AuditLog {
  id: string;
  action_type: string;
  admin_email: string;
  ip_address: string;
  user_agent: string;
  details: any;
  created_at: string;
}

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
      
      return data as AuditLog[];
    },
    enabled: !!admin // Only fetch if admin is logged in
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

  // Helper function to safely format JSON details
  const formatDetails = (details: any): string => {
    if (!details) return 'Нет деталей';
    
    try {
      // If details is already a string, parse it; otherwise, stringify it first
      const detailsObj = typeof details === 'string' ? JSON.parse(details) : details;
      return JSON.stringify(detailsObj, null, 2);
    } catch (e) {
      return 'Неверный формат данных';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Журнал действий администратора</h1>
      </div>
      
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
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
            {auditLogs.length > 0 ? (
              auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.action_type}</TableCell>
                  <TableCell>{log.admin_email || 'Неизвестно'}</TableCell>
                  <TableCell>{log.ip_address || 'Неизвестно'}</TableCell>
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
                <TableCell colSpan={5} className="text-center py-8">
                  Журнал действий пуст
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminAuditLogs;
