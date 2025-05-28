// 'use client';

// import { useState } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { 
//   Users, 
//   Search, 
//   Filter, 
//   MoreHorizontal,
//   UserCheck,
//   UserX,
//   Mail,
//   Phone,
//   Calendar,
//   Shield,
//   AlertTriangle
// } from 'lucide-react';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { useAdminUsers, useUpdateUserStatus } from '@/hooks/useAdminQueries';
// import { toast } from 'sonner';

// const UserManagement = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedRole, setSelectedRole] = useState('all');
//   const [selectedStatus, setSelectedStatus] = useState('all');
//   const [currentPage, setCurrentPage] = useState(1);
  
//   const { data: usersData, isLoading } = useAdminUsers({
//     page: currentPage,
//     limit: 10,
//     role: selectedRole === 'all' ? undefined : selectedRole,
//     search: searchTerm || undefined,
//     isActive: selectedStatus === 'all' ? undefined : selectedStatus === 'active',
//   });

//   const updateUserStatusMutation = useUpdateUserStatus();

//   const handleStatusToggle = async (userId: string, currentStatus: boolean) => {
//     try {
//       await updateUserStatusMutation.mutateAsync({
//         userId,
//         isActive: !currentStatus,
//         reason: !currentStatus ? 'Activated by admin' : 'Deactivated by admin'
//       });
//     } catch (error) {
//       console.error('Status update failed:', error);
//     }
//   };

//   const getInitials = (name: string) => {
//     return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
//   };

//   const getRoleBadge = (role: string) => {
//     const variants = {
//       admin: 'bg-red-100 text-red-700',
//       provider: 'bg-blue-100 text-blue-700',
//       user: 'bg-green-100 text-green-700'
//     };
//     return variants[role as keyof typeof variants] || variants.user;
//   };

//   return (
//     <div className="p-4 sm:p-6 lg:p-8">
//       {/* Header */}
//       <div className="mb-6 sm:mb-8">
//         <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
//           User Management
//         </h1>
//         <p className="text-gray-600 text-sm sm:text-base">
//           Manage users and providers across the platform
//         </p>
//       </div>

//       {/* Filters */}
//       <Card className="mb-6 border border-gray-200 shadow-sm rounded-2xl">
//         <CardContent className="p-4 sm:p-6">
//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <Input
//                 placeholder="Search users by name, email, or phone..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 border-gray-200 focus:border-[#1EC6D9] focus:ring-[#1EC6D9]"
//               />
//             </div>
//             <Select value={selectedRole} onValueChange={setSelectedRole}>
//               <SelectTrigger className="w-full sm:w-48 border-gray-200">
//                 <SelectValue placeholder="Filter by role" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Roles</SelectItem>
//                 <SelectItem value="user">Customers</SelectItem>
//                 <SelectItem value="provider">Providers</SelectItem>
//                 <SelectItem value="admin">Admins</SelectItem>
//               </SelectContent>
//             </Select>
//             <Select value={selectedStatus} onValueChange={setSelectedStatus}>
//               <SelectTrigger className="w-full sm:w-48 border-gray-200">
//                 <SelectValue placeholder="Filter by status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Status</SelectItem>
//                 <SelectItem value="active">Active</SelectItem>
//                 <SelectItem value="inactive">Inactive</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </CardContent>
//       </Card>