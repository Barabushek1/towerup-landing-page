
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { PlusCircle, Pencil, Trash2, MoveUp, MoveDown, Flag, Building, Award, Target, Rocket, Briefcase, Trophy, Clock, Users, Landmark } from 'lucide-react';
import { 
  TimelineEvent, 
  fetchTimelineEvents, 
  createTimelineEvent, 
  updateTimelineEvent, 
  deleteTimelineEvent,
  reorderTimelineEvents 
} from '@/utils/timeline-helpers';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const AdminTimelineEvents = () => {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Partial<TimelineEvent>>({
    year: '',
    title: '',
    title_ru: '',
    title_uz: '',
    title_en: '',
    description: '',
    description_ru: '',
    description_uz: '',
    description_en: '',
    icon_name: 'Flag',
    display_order: 0,
  });
  const [eventIdToDelete, setEventIdToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const iconOptions = [
    { value: 'Flag', label: 'Flag', icon: <Flag className="h-4 w-4" /> },
    { value: 'Building', label: 'Building', icon: <Building className="h-4 w-4" /> },
    { value: 'Award', label: 'Award', icon: <Award className="h-4 w-4" /> },
    { value: 'Target', label: 'Target', icon: <Target className="h-4 w-4" /> },
    { value: 'Rocket', label: 'Rocket', icon: <Rocket className="h-4 w-4" /> },
    { value: 'Briefcase', label: 'Briefcase', icon: <Briefcase className="h-4 w-4" /> },
    { value: 'Trophy', label: 'Trophy', icon: <Trophy className="h-4 w-4" /> },
    { value: 'Clock', label: 'Clock', icon: <Clock className="h-4 w-4" /> },
    { value: 'Users', label: 'Users', icon: <Users className="h-4 w-4" /> },
    { value: 'Landmark', label: 'Landmark', icon: <Landmark className="h-4 w-4" /> },
  ];

  useEffect(() => {
    loadTimelineEvents();
  }, []);

  const loadTimelineEvents = async () => {
    setIsLoading(true);
    const events = await fetchTimelineEvents();
    setTimelineEvents(events);
    setIsLoading(false);
  };

  const handleAddNew = () => {
    setCurrentEvent({
      year: '',
      title: '',
      title_ru: '',
      title_uz: '',
      title_en: '',
      description: '',
      description_ru: '',
      description_uz: '',
      description_en: '',
      icon_name: 'Flag',
      display_order: timelineEvents.length + 1,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (event: TimelineEvent) => {
    setCurrentEvent(event);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setEventIdToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!eventIdToDelete) return;
    
    setIsSubmitting(true);
    const success = await deleteTimelineEvent(eventIdToDelete);
    setIsSubmitting(false);
    
    if (success) {
      toast.success("Timeline event deleted successfully");
      loadTimelineEvents();
    } else {
      toast.error("Failed to delete timeline event");
    }
    
    setIsDeleteDialogOpen(false);
    setEventIdToDelete(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentEvent.year || !currentEvent.title || !currentEvent.description) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    let success: boolean;
    if (currentEvent.id) {
      // Update existing event
      const { id, created_at, updated_at, ...dataToUpdate } = currentEvent as TimelineEvent;
      success = await updateTimelineEvent(id, dataToUpdate);
    } else {
      // Create new event
      success = await createTimelineEvent(currentEvent as Omit<TimelineEvent, 'id' | 'created_at' | 'updated_at'>);
    }
    
    setIsSubmitting(false);
    
    if (success) {
      toast.success(currentEvent.id ? "Timeline event updated successfully" : "Timeline event created successfully");
      setIsDialogOpen(false);
      loadTimelineEvents();
    } else {
      toast.error(currentEvent.id ? "Failed to update timeline event" : "Failed to create timeline event");
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    
    const newEvents = [...timelineEvents];
    const eventToMove = newEvents[index];
    const targetEvent = newEvents[index - 1];
    
    // Swap display orders
    const tempOrder = eventToMove.display_order;
    eventToMove.display_order = targetEvent.display_order;
    targetEvent.display_order = tempOrder;
    
    // Swap positions in array
    newEvents[index] = targetEvent;
    newEvents[index - 1] = eventToMove;
    
    setTimelineEvents(newEvents);
    
    // Update in database
    const orderedIds = newEvents.map(event => event.id);
    const success = await reorderTimelineEvents(orderedIds);
    if (!success) {
      toast.error("Failed to reorder events");
      loadTimelineEvents(); // Reload original order
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index >= timelineEvents.length - 1) return;
    
    const newEvents = [...timelineEvents];
    const eventToMove = newEvents[index];
    const targetEvent = newEvents[index + 1];
    
    // Swap display orders
    const tempOrder = eventToMove.display_order;
    eventToMove.display_order = targetEvent.display_order;
    targetEvent.display_order = tempOrder;
    
    // Swap positions in array
    newEvents[index] = targetEvent;
    newEvents[index + 1] = eventToMove;
    
    setTimelineEvents(newEvents);
    
    // Update in database
    const orderedIds = newEvents.map(event => event.id);
    const success = await reorderTimelineEvents(orderedIds);
    if (!success) {
      toast.error("Failed to reorder events");
      loadTimelineEvents(); // Reload original order
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setCurrentEvent(prev => ({ ...prev, [name]: value }));
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Timeline Events</h1>
          <Button onClick={handleAddNew} className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Add New Event
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="bg-white rounded-md shadow">
            {timelineEvents.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">No timeline events found. Click "Add New Event" to create one.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="p-4">Order</th>
                    <th className="p-4">Year</th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Icon</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {timelineEvents.map((event, index) => (
                    <tr key={event.id} className="border-t">
                      <td className="p-4">{event.display_order}</td>
                      <td className="p-4">{event.year}</td>
                      <td className="p-4">{event.title}</td>
                      <td className="p-4">{event.icon_name}</td>
                      <td className="p-4 flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleMoveUp(index)} disabled={index === 0}>
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleMoveDown(index)} disabled={index === timelineEvents.length - 1}>
                          <MoveDown className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleEdit(event)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="text-red-500" onClick={() => handleDelete(event.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{currentEvent.id ? 'Edit Timeline Event' : 'Add New Timeline Event'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="ru">
              <TabsList className="mb-4">
                <TabsTrigger value="ru">Russian</TabsTrigger>
                <TabsTrigger value="uz">Uzbek</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
              </TabsList>

              {/* Common fields for all languages */}
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    name="year"
                    value={currentEvent.year || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="icon_name">Icon *</Label>
                  <Select 
                    value={currentEvent.icon_name} 
                    onValueChange={(value) => handleSelectChange('icon_name', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            {option.icon}
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Russian language content */}
              <TabsContent value="ru">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title (Russian) *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={currentEvent.title || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description (Russian) *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={currentEvent.description || ''}
                      onChange={handleInputChange}
                      rows={4}
                      required
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Uzbek language content */}
              <TabsContent value="uz">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title_uz">Title (Uzbek)</Label>
                    <Input
                      id="title_uz"
                      name="title_uz"
                      value={currentEvent.title_uz || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description_uz">Description (Uzbek)</Label>
                    <Textarea
                      id="description_uz"
                      name="description_uz"
                      value={currentEvent.description_uz || ''}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* English language content */}
              <TabsContent value="en">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title_en">Title (English)</Label>
                    <Input
                      id="title_en"
                      name="title_en"
                      value={currentEvent.title_en || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description_en">Description (English)</Label>
                    <Textarea
                      id="description_en"
                      name="description_en"
                      value={currentEvent.description_en || ''}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Saving...
                  </>
                ) : currentEvent.id ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this timeline event? This action cannot be undone.</p>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Deleting...
                </>
              ) : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminTimelineEvents;
