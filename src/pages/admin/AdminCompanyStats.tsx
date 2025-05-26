import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronUp, ChevronDown, Edit, Trash2, Plus, Building, Users, MapPin, Construction, Award, Calendar, Clock, Briefcase, Home, CheckCircle, Target, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
type StatItem = {
  id: string;
  title: string;
  title_en: string;
  title_ru: string;
  title_uz: string;
  value: string;
  subtitle: string;
  subtitle_en: string;
  subtitle_ru: string;
  subtitle_uz: string;
  icon: string;
  display_order: number;
  is_active: boolean;
};
const iconOptions = [{
  value: "building",
  label: "Building",
  icon: <Building className="h-4 w-4 mr-2" />
}, {
  value: "users",
  label: "Users",
  icon: <Users className="h-4 w-4 mr-2" />
}, {
  value: "map-pin",
  label: "Map Pin",
  icon: <MapPin className="h-4 w-4 mr-2" />
}, {
  value: "construction",
  label: "Construction",
  icon: <Construction className="h-4 w-4 mr-2" />
}, {
  value: "award",
  label: "Award",
  icon: <Award className="h-4 w-4 mr-2" />
}, {
  value: "calendar",
  label: "Calendar",
  icon: <Calendar className="h-4 w-4 mr-2" />
}, {
  value: "clock",
  label: "Clock",
  icon: <Clock className="h-4 w-4 mr-2" />
}, {
  value: "briefcase",
  label: "Briefcase",
  icon: <Briefcase className="h-4 w-4 mr-2" />
}, {
  value: "home",
  label: "Home",
  icon: <Home className="h-4 w-4 mr-2" />
}, {
  value: "check-circle",
  label: "Check Circle",
  icon: <CheckCircle className="h-4 w-4 mr-2" />
}, {
  value: "target",
  label: "Target",
  icon: <Target className="h-4 w-4 mr-2" />
}, {
  value: "trending-up",
  label: "Trending Up",
  icon: <TrendingUp className="h-4 w-4 mr-2" />
}];
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'building':
      return <Building className="h-5 w-5" />;
    case 'users':
      return <Users className="h-5 w-5" />;
    case 'map-pin':
      return <MapPin className="h-5 w-5" />;
    case 'construction':
      return <Construction className="h-5 w-5" />;
    case 'award':
      return <Award className="h-5 w-5" />;
    case 'calendar':
      return <Calendar className="h-5 w-5" />;
    case 'clock':
      return <Clock className="h-5 w-5" />;
    case 'briefcase':
      return <Briefcase className="h-5 w-5" />;
    case 'home':
      return <Home className="h-5 w-5" />;
    case 'check-circle':
      return <CheckCircle className="h-5 w-5" />;
    case 'target':
      return <Target className="h-5 w-5" />;
    case 'trending-up':
      return <TrendingUp className="h-5 w-5" />;
    default:
      return <Building className="h-5 w-5" />;
  }
};
const AdminCompanyStats = () => {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentStat, setCurrentStat] = useState<Partial<StatItem>>({
    title: '',
    title_en: '',
    title_ru: '',
    title_uz: '',
    value: '',
    subtitle: '',
    subtitle_en: '',
    subtitle_ru: '',
    subtitle_uz: '',
    icon: 'building',
    is_active: true
  });
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('ru');
  const {
    toast
  } = useToast();
  const fetchStats = async () => {
    try {
      setLoading(true);
      const {
        data,
        error
      } = await supabase.from('company_stats').select('*').order('display_order');
      if (error) {
        throw error;
      }
      setStats(data || []);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch company statistics.'
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStats();
  }, []);
  const handleCreateOrUpdate = async () => {
    try {
      const {
        title_ru,
        title_en,
        title_uz,
        subtitle_ru,
        subtitle_en,
        subtitle_uz
      } = currentStat;

      // Validate required fields
      if (!currentStat.value) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Value field is required.'
        });
        return;
      }

      // At least one language must have title and subtitle
      if (!title_ru && !title_en && !title_uz || !subtitle_ru && !subtitle_en && !subtitle_uz) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Please fill in the title and subtitle for at least one language.'
        });
        return;
      }
      if (editing && currentStat.id) {
        const {
          error
        } = await supabase.from('company_stats').update({
          title: currentStat.title_ru || '',
          // Set main title to Russian version by default
          title_ru: currentStat.title_ru || '',
          title_en: currentStat.title_en || '',
          title_uz: currentStat.title_uz || '',
          value: currentStat.value,
          subtitle: currentStat.subtitle_ru || '',
          // Set main subtitle to Russian version by default
          subtitle_ru: currentStat.subtitle_ru || '',
          subtitle_en: currentStat.subtitle_en || '',
          subtitle_uz: currentStat.subtitle_uz || '',
          icon: currentStat.icon,
          is_active: currentStat.is_active
        }).eq('id', currentStat.id);
        if (error) throw error;
        toast({
          title: 'Success',
          description: 'Statistic updated successfully.'
        });
      } else {
        const maxOrderResult = await supabase.from('company_stats').select('display_order').order('display_order', {
          ascending: false
        }).limit(1);
        const maxOrder = maxOrderResult.data && maxOrderResult.data.length > 0 ? maxOrderResult.data[0].display_order + 1 : 1;
        const {
          error
        } = await supabase.from('company_stats').insert({
          title: currentStat.title_ru || '',
          // Set main title to Russian version by default
          title_ru: currentStat.title_ru || '',
          title_en: currentStat.title_en || '',
          title_uz: currentStat.title_uz || '',
          value: currentStat.value || '',
          subtitle: currentStat.subtitle_ru || '',
          // Set main subtitle to Russian version by default
          subtitle_ru: currentStat.subtitle_ru || '',
          subtitle_en: currentStat.subtitle_en || '',
          subtitle_uz: currentStat.subtitle_uz || '',
          icon: currentStat.icon || 'building',
          is_active: currentStat.is_active === undefined ? true : currentStat.is_active,
          display_order: maxOrder
        });
        if (error) throw error;
        toast({
          title: 'Success',
          description: 'Statistic created successfully.'
        });
      }
      setDialogOpen(false);
      resetForm();
      fetchStats();
    } catch (error) {
      console.error('Error saving stat:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save statistics.'
      });
    }
  };
  const handleDelete = async (id: string) => {
    try {
      const {
        error
      } = await supabase.from('company_stats').delete().eq('id', id);
      if (error) throw error;
      toast({
        title: 'Success',
        description: 'Statistic deleted successfully.'
      });
      fetchStats();
    } catch (error) {
      console.error('Error deleting stat:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete statistic.'
      });
    }
  };
  const handleEdit = (stat: StatItem) => {
    setCurrentStat(stat);
    setEditing(true);
    setDialogOpen(true);
  };
  const handleMoveUp = async (stat: StatItem, index: number) => {
    if (index === 0) return;
    try {
      const prevStat = stats[index - 1];
      const updates = [{
        id: stat.id,
        display_order: prevStat.display_order
      }, {
        id: prevStat.id,
        display_order: stat.display_order
      }];
      for (const update of updates) {
        await supabase.from('company_stats').update({
          display_order: update.display_order
        }).eq('id', update.id);
      }
      fetchStats();
    } catch (error) {
      console.error('Error reordering stats:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to reorder statistics.'
      });
    }
  };
  const handleMoveDown = async (stat: StatItem, index: number) => {
    if (index === stats.length - 1) return;
    try {
      const nextStat = stats[index + 1];
      const updates = [{
        id: stat.id,
        display_order: nextStat.display_order
      }, {
        id: nextStat.id,
        display_order: stat.display_order
      }];
      for (const update of updates) {
        await supabase.from('company_stats').update({
          display_order: update.display_order
        }).eq('id', update.id);
      }
      fetchStats();
    } catch (error) {
      console.error('Error reordering stats:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to reorder statistics.'
      });
    }
  };
  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const {
        error
      } = await supabase.from('company_stats').update({
        is_active: !currentStatus
      }).eq('id', id);
      if (error) throw error;
      fetchStats();
    } catch (error) {
      console.error('Error toggling active state:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update statistic status.'
      });
    }
  };
  const resetForm = () => {
    setCurrentStat({
      title: '',
      title_en: '',
      title_ru: '',
      title_uz: '',
      value: '',
      subtitle: '',
      subtitle_en: '',
      subtitle_ru: '',
      subtitle_uz: '',
      icon: 'building',
      is_active: true
    });
    setEditing(false);
    setActiveTab('ru');
  };
  return <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Company Statistics</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
            resetForm();
            setDialogOpen(true);
          }}>
              <Plus className="mr-2 h-4 w-4" /> Add New Statistic
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Statistic' : 'Add New Statistic'}</DialogTitle>
              <DialogDescription>
                {editing ? 'Update the statistic information below.' : 'Fill in the details below to add a new statistic to the homepage.'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <Tabs defaultValue="ru" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="ru">Russian</TabsTrigger>
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="uz">Uzbek</TabsTrigger>
                </TabsList>
                
                <TabsContent value="ru" className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title_ru">Title (Russian)</Label>
                    <Input id="title_ru" value={currentStat.title_ru || ''} onChange={e => setCurrentStat({
                    ...currentStat,
                    title_ru: e.target.value,
                    title: e.target.value // Also update the main title field
                  })} placeholder="e.g., построенных площадей" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="subtitle_ru">Subtitle (Russian)</Label>
                    <Input id="subtitle_ru" value={currentStat.subtitle_ru || ''} onChange={e => setCurrentStat({
                    ...currentStat,
                    subtitle_ru: e.target.value,
                    subtitle: e.target.value // Also update the main subtitle field
                  })} placeholder="e.g., площадь" />
                  </div>
                </TabsContent>
                
                <TabsContent value="en" className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title_en">Title (English)</Label>
                    <Input id="title_en" value={currentStat.title_en || ''} onChange={e => setCurrentStat({
                    ...currentStat,
                    title_en: e.target.value
                  })} placeholder="e.g., built areas" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="subtitle_en">Subtitle (English)</Label>
                    <Input id="subtitle_en" value={currentStat.subtitle_en || ''} onChange={e => setCurrentStat({
                    ...currentStat,
                    subtitle_en: e.target.value
                  })} placeholder="e.g., area" />
                  </div>
                </TabsContent>
                
                <TabsContent value="uz" className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title_uz">Title (Uzbek)</Label>
                    <Input id="title_uz" value={currentStat.title_uz || ''} onChange={e => setCurrentStat({
                    ...currentStat,
                    title_uz: e.target.value
                  })} placeholder="e.g., qurilgan maydonlar" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="subtitle_uz">Subtitle (Uzbek)</Label>
                    <Input id="subtitle_uz" value={currentStat.subtitle_uz || ''} onChange={e => setCurrentStat({
                    ...currentStat,
                    subtitle_uz: e.target.value
                  })} placeholder="e.g., maydon" />
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="grid gap-2">
                <Label htmlFor="value">Value</Label>
                <Input id="value" value={currentStat.value || ''} onChange={e => setCurrentStat({
                ...currentStat,
                value: e.target.value
              })} placeholder="e.g., 257" />
                <p className="text-xs text-gray-500">For values with m², animation will be disabled.</p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="icon">Icon</Label>
                <Select value={currentStat.icon || 'building'} onValueChange={value => setCurrentStat({
                ...currentStat,
                icon: value
              })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map(option => <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center">
                          {option.icon}
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="is_active" checked={currentStat.is_active} onCheckedChange={checked => setCurrentStat({
                ...currentStat,
                is_active: checked
              })} />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
              setDialogOpen(false);
              resetForm();
            }}>
                Cancel
              </Button>
              <Button onClick={handleCreateOrUpdate}>
                {editing ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? <div className="flex justify-center py-10">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div> : stats.length === 0 ? <div className="text-center py-10 bg-slate-100 dark:bg-slate-800 rounded-md">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            No statistics found. Add your first one to get started.
          </p>
        </div> : <div className="bg-white dark:bg-slate-800 rounded-md shadow overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-zinc-800">Order</TableHead>
                <TableHead className="bg-zinc-800">Title (RU)</TableHead>
                <TableHead className="bg-zinc-800">Value</TableHead>
                <TableHead className="bg-zinc-800">Subtitle (RU)</TableHead>
                <TableHead className="bg-zinc-800">Icon</TableHead>
                <TableHead className="bg-zinc-800">Active</TableHead>
                <TableHead className="bg-zinc-800">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.map((stat, index) => <TableRow key={stat.id}>
                  <TableCell className="w-24 bg-zinc-800">
                    <div className="flex items-center space-x-1">
                      <span>{stat.display_order}</span>
                      <div className="flex flex-col ml-2">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMoveUp(stat, index)} disabled={index === 0}>
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMoveDown(stat, index)} disabled={index === stats.length - 1}>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="bg-zinc-700">
                    <div>
                      <div>{stat.title_ru || stat.title}</div>
                      <div className="text-xs text-gray-500">
                        {stat.title_en && `EN: ${stat.title_en}`}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="bg-zinc-700">{stat.value}</TableCell>
                  <TableCell className="bg-zinc-700">
                    <div>
                      <div>{stat.subtitle_ru || stat.subtitle}</div>
                      <div className="text-xs text-gray-500">
                        {stat.subtitle_en && `EN: ${stat.subtitle_en}`}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="w-12 bg-zinc-700">
                    <div className="flex justify-center">
                      {getIconComponent(stat.icon)}
                    </div>
                  </TableCell>
                  <TableCell className="bg-zinc-700">
                    <Switch checked={stat.is_active} onCheckedChange={() => handleToggleActive(stat.id, stat.is_active)} />
                  </TableCell>
                  <TableCell className="bg-zinc-700">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(stat)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(stat.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
        </div>}
    </div>;
};
export default AdminCompanyStats;