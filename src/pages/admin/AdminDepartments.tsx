
import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Pencil, Plus, Trash, Users } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Department, addDepartment, deleteDepartment, fetchDepartments, updateDepartment, fetchStaffByDepartment, StaffMember } from '@/utils/staff-helpers';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAdmin } from '@/contexts/AdminContext';
import { Badge } from '@/components/ui/badge';

const departmentFormSchema = z.object({
  name: z.string().min(1, { message: 'Название отдела обязательно' })
});

type DepartmentFormValues = z.infer<typeof departmentFormSchema>;

const AdminDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentStaff, setDepartmentStaff] = useState<Record<string, StaffMember[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const { toast } = useToast();
  const { admin } = useAdmin();

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: {
      name: ''
    }
  });

  useEffect(() => {
    if (editingDepartment) {
      form.reset({
        name: editingDepartment.name
      });
    } else {
      form.reset({
        name: ''
      });
    }
  }, [editingDepartment, form]);

  const fetchData = async () => {
    setIsLoading(true);
    
    const departmentsData = await fetchDepartments();
    setDepartments(departmentsData);
    
    // Fetch staff for each department
    const staffByDepartment: Record<string, StaffMember[]> = {};
    for (const dept of departmentsData) {
      const staff = await fetchStaffByDepartment(dept.id);
      staffByDepartment[dept.id] = staff;
    }
    
    setDepartmentStaff(staffByDepartment);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (data: DepartmentFormValues) => {
    try {
      if (editingDepartment) {
        // Update existing department
        const success = await updateDepartment(editingDepartment.id, data.name);
        
        if (success) {
          toast({
            title: "Отдел обновлен",
            description: `Отдел "${data.name}" успешно обновлен.`
          });
          
          setIsDialogOpen(false);
          fetchData();
        } else {
          toast({
            title: "Ошибка обновления",
            description: "Не удалось обновить отдел.",
            variant: "destructive"
          });
        }
      } else {
        // Add new department
        const newDepartment = await addDepartment(data.name);
        
        if (newDepartment) {
          toast({
            title: "Отдел добавлен",
            description: `Отдел "${newDepartment.name}" успешно добавлен.`
          });
          
          setIsDialogOpen(false);
          fetchData();
        } else {
          toast({
            title: "Ошибка добавления",
            description: "Не удалось добавить новый отдел.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при сохранении данных.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      // Check if department has staff
      const staff = departmentStaff[id] || [];
      if (staff.length > 0) {
        toast({
          title: "Невозможно удалить",
          description: `В отделе "${name}" есть сотрудники. Сначала удалите или переместите сотрудников.`,
          variant: "destructive"
        });
        return;
      }
      
      const success = await deleteDepartment(id);
      
      if (success) {
        toast({
          title: "Отдел удален",
          description: `Отдел "${name}" успешно удален.`
        });
        
        fetchData();
      } else {
        toast({
          title: "Ошибка удаления",
          description: "Не удалось удалить отдел.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error deleting department:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при удалении отдела.",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (department: Department) => {
    setEditingDepartment(department);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingDepartment(null);
    setIsDialogOpen(true);
  };

  if (!admin) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Управление отделами</h1>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить отдел
              </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingDepartment ? 'Изменить отдел' : 'Добавить отдел'}</DialogTitle>
                <DialogDescription>
                  {editingDepartment 
                    ? 'Измените название отдела и нажмите "Сохранить".'
                    : 'Введите название отдела и нажмите "Добавить".'
                  }
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Название отдела</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Введите название отдела" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="submit">
                      {editingDepartment ? 'Сохранить' : 'Добавить'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : departments.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {departments.map(department => (
              <Card key={department.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>{department.name}</CardTitle>
                    <Badge variant="secondary" className="ml-2">
                      <Users className="h-3 w-3 mr-1" />
                      {departmentStaff[department.id]?.length || 0}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="text-sm">
                  {departmentStaff[department.id]?.length > 0 ? (
                    <div>
                      <span className="font-semibold">Сотрудники:</span>
                      <ul className="mt-2 space-y-1 list-disc pl-5">
                        {departmentStaff[department.id].map(staff => (
                          <li key={staff.id}>{staff.name} - {staff.position}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">В этом отделе нет сотрудников</p>
                  )}
                </CardContent>
                
                <CardFooter className="flex justify-between pt-3 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => openEditDialog(department)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Изменить
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        disabled={departmentStaff[department.id]?.length > 0}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Удалить
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Это действие нельзя отменить. Отдел будет удален из системы.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(department.id, department.name)}>
                          Удалить
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <p className="text-muted-foreground mb-4">Отделы не найдены</p>
              <Button onClick={openAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить отдел
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDepartments;
