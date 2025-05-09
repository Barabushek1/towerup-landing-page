
import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Pencil, Plus, Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { StaffMember, Department, addStaffMember, deleteStaffMember, fetchDepartments, fetchStaffMembers, updateStaffMember } from '@/utils/staff-helpers';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAdmin } from '@/contexts/AdminContext';

const staffFormSchema = z.object({
  name: z.string().min(1, { message: 'Имя обязательно' }),
  position: z.string().min(1, { message: 'Должность обязательна' }),
  departmentId: z.string().min(1, { message: 'Отдел обязателен' }),
  bio: z.string().optional(),
  email: z.string().email({ message: 'Введите правильный email' }).optional().or(z.literal('')),
  phone: z.string().optional(),
  image_url: z.string().optional()
});

type StaffFormValues = z.infer<typeof staffFormSchema>;

const AdminStaff = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const { toast } = useToast();
  const { admin } = useAdmin();

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      name: '',
      position: '',
      departmentId: '',
      bio: '',
      email: '',
      phone: '',
      image_url: ''
    }
  });

  useEffect(() => {
    if (editingStaff) {
      form.reset({
        name: editingStaff.name,
        position: editingStaff.position,
        departmentId: editingStaff.departmentId || '',
        bio: editingStaff.bio || '',
        email: editingStaff.email || '',
        phone: editingStaff.phone || '',
        image_url: editingStaff.image_url || ''
      });
    } else {
      form.reset({
        name: '',
        position: '',
        departmentId: '',
        bio: '',
        email: '',
        phone: '',
        image_url: ''
      });
    }
  }, [editingStaff, form]);

  const fetchData = async () => {
    setIsLoading(true);
    
    const [staffData, departmentsData] = await Promise.all([
      fetchStaffMembers(),
      fetchDepartments()
    ]);
    
    setStaff(staffData);
    setDepartments(departmentsData);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (data: StaffFormValues) => {
    try {
      if (editingStaff) {
        // Update existing staff member
        const success = await updateStaffMember(editingStaff.id, data);
        
        if (success) {
          toast({
            title: "Сотрудник обновлен",
            description: `Информация о сотруднике ${data.name} успешно обновлена.`
          });
          
          setIsDialogOpen(false);
          fetchData();
        } else {
          toast({
            title: "Ошибка обновления",
            description: "Не удалось обновить информацию о сотруднике.",
            variant: "destructive"
          });
        }
      } else {
        // Add new staff member
        const newStaff = await addStaffMember(data);
        
        if (newStaff) {
          toast({
            title: "Сотрудник добавлен",
            description: `Сотрудник ${newStaff.name} успешно добавлен.`
          });
          
          setIsDialogOpen(false);
          fetchData();
        } else {
          toast({
            title: "Ошибка добавления",
            description: "Не удалось добавить нового сотрудника.",
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
      const success = await deleteStaffMember(id);
      
      if (success) {
        toast({
          title: "Сотрудник удален",
          description: `Сотрудник ${name} успешно удален.`
        });
        
        fetchData();
      } else {
        toast({
          title: "Ошибка удаления",
          description: "Не удалось удалить сотрудника.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при удалении сотрудника.",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (staffMember: StaffMember) => {
    setEditingStaff(staffMember);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingStaff(null);
    setIsDialogOpen(true);
  };

  if (!admin) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Управление сотрудниками</h1>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить сотрудника
              </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingStaff ? 'Изменить сотрудника' : 'Добавить сотрудника'}</DialogTitle>
                <DialogDescription>
                  {editingStaff 
                    ? 'Измените информацию о сотруднике и нажмите "Сохранить".'
                    : 'Заполните форму ниже и нажмите "Добавить".'
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
                        <FormLabel>Имя</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Введите имя" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Должность</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Введите должность" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="departmentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Отдел</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите отдел" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departments.map(dept => (
                              <SelectItem key={dept.id} value={dept.id}>
                                {dept.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Биография</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Введите биографию сотрудника" 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="email" 
                            placeholder="Введите email" 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Телефон</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Введите номер телефона" 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL изображения</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Введите URL изображения" 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="submit">
                      {editingStaff ? 'Сохранить' : 'Добавить'}
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
        ) : staff.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {staff.map(person => (
              <Card key={person.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle>{person.name}</CardTitle>
                  <CardDescription>{person.position}</CardDescription>
                </CardHeader>
                
                <CardContent className="text-sm">
                  <div className="space-y-2">
                    <div>
                      <span className="font-semibold">Отдел:</span> {person.departmentName}
                    </div>
                    
                    {person.email && (
                      <div>
                        <span className="font-semibold">Email:</span> {person.email}
                      </div>
                    )}
                    
                    {person.phone && (
                      <div>
                        <span className="font-semibold">Телефон:</span> {person.phone}
                      </div>
                    )}
                    
                    {person.bio && (
                      <div>
                        <span className="font-semibold">Биография:</span>
                        <p className="mt-1 text-muted-foreground">{person.bio}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between pt-3 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => openEditDialog(person)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Изменить
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash className="h-4 w-4 mr-2" />
                        Удалить
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Это действие нельзя отменить. Сотрудник будет удален из системы.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(person.id, person.name)}>
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
              <p className="text-muted-foreground mb-4">Сотрудники не найдены</p>
              <Button onClick={openAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить сотрудника
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminStaff;
