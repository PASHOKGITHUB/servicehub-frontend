// src/components/Admin/ServiceCategories.tsx - Fixed Version

'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  Settings, 
  Plus, 
  Search, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Package
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
  useAdminCategories, 
  useCreateCategory, 
  useUpdateCategory, 
  useDeleteCategory 
} from '@/hooks/useAdminQueries';
import type { ServiceCategory } from '@/domain/entities';
import { toast } from 'sonner';

const ServiceCategories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  // Fix: Change from any to ServiceCategory | null
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
  // Remove unused variable warning by commenting out
  // const [currentPage, setCurrentPage] = useState(1);
  const currentPage = 1; // Use const since pagination isn't implemented
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    sortOrder: 0
  });

  const { data: categoriesData, isLoading } = useAdminCategories({
    page: currentPage,
    limit: 12,
    search: searchTerm || undefined,
  });

  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const handleCreate = async () => {
    if (!formData.name || !formData.description || !formData.icon) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createCategoryMutation.mutateAsync(formData);
      setIsCreateDialogOpen(false);
      setFormData({ name: '', description: '', icon: '', sortOrder: 0 });
    } catch (error) {
      console.error('Create failed:', error);
    }
  };

  // Fix: Change parameter type from any to ServiceCategory
  const handleEdit = (category: ServiceCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      icon: category.icon,
      sortOrder: category.sortOrder
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingCategory) return;

    try {
      await updateCategoryMutation.mutateAsync({
        id: editingCategory._id,
        data: formData
      });
      setIsEditDialogOpen(false);
      setEditingCategory(null);
      setFormData({ name: '', description: '', icon: '', sortOrder: 0 });
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  // Fix: Change parameter type from any to ServiceCategory
  const handleToggleStatus = async (category: ServiceCategory) => {
    try {
      await updateCategoryMutation.mutateAsync({
        id: category._id,
        data: { isActive: !category.isActive }
      });
    } catch (error) {
      console.error('Status toggle failed:', error);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        await deleteCategoryMutation.mutateAsync(categoryId);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const predefinedIcons = [
    'home', 'scissors', 'broom', 'wrench', 'heart', 'shopping-cart',
    'book', 'camera', 'car', 'truck', 'briefcase', 'settings'
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Service Categories
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Manage service categories and their organization
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#1EC6D9] to-[#16A8B8] hover:from-[#16A8B8] hover:to-[#128A96] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
                <DialogDescription>
                  Add a new service category to organize services on the platform
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Home Services"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the category"
                    className="mt-1"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="icon">Icon *</Label>
                  <div className="mt-2 grid grid-cols-6 gap-2">
                    {predefinedIcons.map((icon) => (
                      <Button
                        key={icon}
                        type="button"
                        variant={formData.icon === icon ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFormData({ ...formData, icon })}
                        className="h-10 w-10 p-0"
                      >
                        {icon}
                      </Button>
                    ))}
                  </div>
                  <Input
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="Or enter custom icon name"
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="sortOrder">Sort Order</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="mt-1"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreate}
                  disabled={createCategoryMutation.isPending}
                  className="bg-gradient-to-r from-[#1EC6D9] to-[#16A8B8]"
                >
                  {createCategoryMutation.isPending ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Creating...
                    </>
                  ) : (
                    'Create Category'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <Card className="mb-6 border border-gray-200 shadow-sm rounded-2xl">
        <CardContent className="p-4 sm:p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-200 focus:border-[#1EC6D9] focus:ring-[#1EC6D9]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {isLoading ? (
          [...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <Skeleton className="w-12 h-12 rounded-lg mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-3/4" />
              </CardContent>
            </Card>
          ))
        ) : (
          // Fix: Change from any to ServiceCategory
          categoriesData?.categories?.map((category: ServiceCategory) => (
            <Card key={category._id} className="border border-gray-200 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold ${
                    category.isActive 
                      ? 'bg-gradient-to-r from-[#1EC6D9] to-[#16A8B8]' 
                      : 'bg-gray-400'
                  }`}>
                    {category.icon || 'S'}
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => handleEdit(category)}
                        disabled={updateCategoryMutation.isPending}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleToggleStatus(category)}
                        disabled={updateCategoryMutation.isPending}
                      >
                        {updateCategoryMutation.isPending ? (
                          <LoadingSpinner size="sm" className="w-4 h-4 mr-2" />
                        ) : category.isActive ? (
                          <EyeOff className="w-4 h-4 mr-2" />
                        ) : (
                          <Eye className="w-4 h-4 mr-2" />
                        )}
                        {category.isActive ? 'Deactivate' : 'Activate'}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(category._id)}
                        disabled={deleteCategoryMutation.isPending}
                        className="text-red-600"
                      >
                        {deleteCategoryMutation.isPending ? (
                          <LoadingSpinner size="sm" className="w-4 h-4 mr-2" />
                        ) : (
                          <Trash2 className="w-4 h-4 mr-2" />
                        )}
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{category.description}</p>
                
                <div className="flex items-center justify-between">
                  <Badge variant={category.isActive ? "default" : "secondary"} className={
                    category.isActive 
                      ? "bg-green-100 text-green-700" 
                      : "bg-gray-100 text-gray-700"
                  }>
                    {category.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Package className="w-4 h-4" />
                    <span>{category.servicesCount || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Empty State */}
      {!isLoading && categoriesData?.categories?.length === 0 && (
        <Card className="border border-gray-200 shadow-sm rounded-2xl">
          <CardContent className="p-12 text-center">
            <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first service category</p>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-gradient-to-r from-[#1EC6D9] to-[#16A8B8]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category information
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Category Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Home Services"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the category"
                className="mt-1"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-icon">Icon *</Label>
              <div className="mt-2 grid grid-cols-6 gap-2">
                {predefinedIcons.map((icon) => (
                  <Button
                    key={icon}
                    type="button"
                    variant={formData.icon === icon ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormData({ ...formData, icon })}
                    className="h-10 w-10 p-0"
                  >
                    {icon}
                  </Button>
                ))}
              </div>
              <Input
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="Or enter custom icon name"
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-sortOrder">Sort Order</Label>
              <Input
                id="edit-sortOrder"
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdate}
              disabled={updateCategoryMutation.isPending}
              className="bg-gradient-to-r from-[#1EC6D9] to-[#16A8B8]"
            >
              {updateCategoryMutation.isPending ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Updating...
                </>
              ) : (
                'Update Category'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceCategories;