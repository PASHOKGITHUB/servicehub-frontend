'use client';

import { useState } from 'react';
import { Card, CardContent} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Briefcase, 
  Plus, 
  Search, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  DollarSign,
  MapPin,
  Star
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  useProviderServices, 
  useCreateService, 
  useUpdateService, 
  useDeleteService,
  useServiceCategories
} from '@/hooks/useProviderQueries';
import { toast } from 'sonner';

const MyServices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [currentPage] = useState(1);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: 0,
    duration: 60,
    serviceAreas: [''],
    tags: ['']
  });

  const { data: servicesData, isLoading } = useProviderServices({
    page: currentPage,
    limit: 12,
    search: searchTerm || undefined,
    category: selectedCategory === 'all' ? undefined : selectedCategory,
  });

  const { data: categoriesData } = useServiceCategories();
  const createServiceMutation = useCreateService();
  const updateServiceMutation = useUpdateService();
  const deleteServiceMutation = useDeleteService();

  const handleCreate = async () => {
    if (!formData.name || !formData.description || !formData.category || formData.price <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    const serviceAreas = formData.serviceAreas.filter(area => area.trim() !== '');
    const tags = formData.tags.filter(tag => tag.trim() !== '');

    try {
      await createServiceMutation.mutateAsync({
        ...formData,
        serviceAreas,
        tags
      });
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Create failed:', error);
    }
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      category: service.category._id,
      price: service.price,
      duration: service.duration,
      serviceAreas: service.serviceAreas.length > 0 ? service.serviceAreas : [''],
      tags: service.tags.length > 0 ? service.tags : ['']
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingService) return;

    const serviceAreas = formData.serviceAreas.filter(area => area.trim() !== '');
    const tags = formData.tags.filter(tag => tag.trim() !== '');

    try {
      await updateServiceMutation.mutateAsync({
        id: editingService._id,
        data: {
          ...formData,
          serviceAreas,
          tags
        }
      });
      setIsEditDialogOpen(false);
      setEditingService(null);
      resetForm();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleToggleStatus = async (service: any) => {
    try {
      await updateServiceMutation.mutateAsync({
        id: service._id,
        data: { isActive: !service.isActive }
      });
    } catch (error) {
      console.error('Status toggle failed:', error);
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (window.confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      try {
        await deleteServiceMutation.mutateAsync(serviceId);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

   const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      price: 0,
      duration: 60,
      serviceAreas: [''],
      tags: ['']
    });
  };

  const addServiceArea = () => {
    setFormData({ ...formData, serviceAreas: [...formData.serviceAreas, ''] });
  };

  const removeServiceArea = (index: number) => {
    setFormData({ 
      ...formData, 
      serviceAreas: formData.serviceAreas.filter((_, i) => i !== index) 
    });
  };

  const updateServiceArea = (index: number, value: string) => {
    const newAreas = [...formData.serviceAreas];
    newAreas[index] = value;
    setFormData({ ...formData, serviceAreas: newAreas });
  };

  const addTag = () => {
    setFormData({ ...formData, tags: [...formData.tags, ''] });
  };

  const removeTag = (index: number) => {
    setFormData({ 
      ...formData, 
      tags: formData.tags.filter((_, i) => i !== index) 
    });
  };

  const updateTag = (index: number, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData({ ...formData, tags: newTags });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              My Services
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Manage and showcase your professional services
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#1EC6D9] to-[#16A8B8] hover:from-[#16A8B8] hover:to-[#128A96] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Service</DialogTitle>
                <DialogDescription>
                  Add a new service to your portfolio
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Service Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Home Cleaning Service"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesData?.categories?.map((category: any) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your service in detail"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      placeholder="500"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="duration">Duration (minutes) *</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
                      placeholder="60"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Service Areas *</Label>
                  {formData.serviceAreas.map((area, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        value={area}
                        onChange={(e) => updateServiceArea(index, e.target.value)}
                        placeholder="e.g., Chennai, Madurai"
                      />
                      {formData.serviceAreas.length > 1 && (
                        <Button type="button" variant="outline" size="sm" onClick={() => removeServiceArea(index)}>
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addServiceArea} className="mt-2">
                    Add Area
                  </Button>
                </div>
                
                <div>
                  <Label>Tags (Optional)</Label>
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        value={tag}
                        onChange={(e) => updateTag(index, e.target.value)}
                        placeholder="e.g., cleaning, professional"
                      />
                      {formData.tags.length > 1 && (
                        <Button type="button" variant="outline" size="sm" onClick={() => removeTag(index)}>
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addTag} className="mt-2">
                    Add Tag
                  </Button>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreate}
                  disabled={createServiceMutation.isPending}
                  className="bg-gradient-to-r from-[#1EC6D9] to-[#16A8B8]"
                >
                  {createServiceMutation.isPending ? 'Creating...' : 'Create Service'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6 border border-gray-200 shadow-sm rounded-2xl">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:border-[#1EC6D9] focus:ring-[#1EC6D9]"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48 border-gray-200">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categoriesData?.categories?.map((category: any) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-full mb-4" />
                <Skeleton className="h-8 w-1/2" />
              </CardContent>
            </Card>
          ))
        ) : (
          servicesData?.services?.map((service: any) => (
            <Card key={service._id} className="border border-gray-200 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                    <Badge className="bg-blue-100 text-blue-700 text-xs mb-2">
                      {service.category?.name}
                    </Badge>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(service)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleStatus(service)}>
                        {service.isActive ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-2" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(service._id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                
                <div className="space-y-2 text-xs text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-3 h-3" />
                    <span>{formatCurrency(service.price)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{service.duration} minutes</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{service.serviceAreas?.slice(0, 2).join(', ')}</span>
                    {service.serviceAreas?.length > 2 && (
                      <span>+{service.serviceAreas.length - 2} more</span>
                    )}
                  </div>
                  {service.averageRating > 0 && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span>{service.averageRating.toFixed(1)} ({service.totalReviews} reviews)</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge variant={service.isActive ? "default" : "secondary"} className={
                    service.isActive 
                      ? "bg-green-100 text-green-700" 
                      : "bg-gray-100 text-gray-700"
                  }>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  
                  <div className="text-xs text-gray-500">
                    {service.totalBookings || 0} bookings
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Empty State */}
      {!isLoading && servicesData?.services?.length === 0 && (
        <Card className="border border-gray-200 shadow-sm rounded-2xl">
          <CardContent className="p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600 mb-6">Create your first service to start receiving bookings</p>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-gradient-to-r from-[#1EC6D9] to-[#16A8B8]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>
              Update your service information
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Service Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Home Cleaning Service"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesData?.categories?.map((category: any) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your service in detail"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-price">Price (₹) *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-duration">Duration (minutes) *</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
                />
              </div>
            </div>
            
            <div>
              <Label>Service Areas *</Label>
              {formData.serviceAreas.map((area, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <Input
                    value={area}
                    onChange={(e) => updateServiceArea(index, e.target.value)}
                    placeholder="e.g., Chennai, Madurai"
                  />
                  {formData.serviceAreas.length > 1 && (
                    <Button type="button" variant="outline" size="sm" onClick={() => removeServiceArea(index)}>
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addServiceArea} className="mt-2">
                Add Area
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdate}
              disabled={updateServiceMutation.isPending}
              className="bg-gradient-to-r from-[#1EC6D9] to-[#16A8B8]"
            >
              {updateServiceMutation.isPending ? 'Updating...' : 'Update Service'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyServices;
