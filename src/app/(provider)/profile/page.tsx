import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {  Camera, } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Profile Settings
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Manage your provider profile and business information
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture */}
        <Card className="border border-gray-200 shadow-sm rounded-2xl">
          <CardHeader className="text-center">
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Upload a professional photo</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Avatar className="w-32 h-32 mx-auto mb-4">
              <AvatarImage src="" />
              <AvatarFallback className="bg-gradient-to-r from-[#1EC6D9] to-[#16A8B8] text-white text-2xl font-semibold">
                JP
              </AvatarFallback>
            </Avatar>
            <Button className="w-full bg-gradient-to-r from-[#1EC6D9] to-[#16A8B8]">
              <Camera className="w-4 h-4 mr-2" />
              Change Photo
            </Button>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card className="lg:col-span-2 border border-gray-200 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Update your professional details</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Business Name</Label>
                  <Input id="name" placeholder="Your business name" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+91 9876543210" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="your@email.com" />
              </div>
              
              <div>
                <Label htmlFor="bio">Business Description</Label>
                <Textarea 
                  id="bio" 
                  placeholder="Tell customers about your experience and expertise"
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="address">Business Address</Label>
                <Textarea 
                  id="address" 
                  placeholder="Your business address"
                  rows={2}
                />
              </div>
              
              <Button className="w-full bg-gradient-to-r from-[#1EC6D9] to-[#16A8B8]">
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Business Stats */}
      <Card className="mt-6 border border-gray-200 shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle>Business Performance</CardTitle>
          <CardDescription>Your key performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">15</div>
              <p className="text-sm text-gray-600">Active Services</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">4.8</div>
              <p className="text-sm text-gray-600">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">125</div>
              <p className="text-sm text-gray-600">Total Bookings</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">₹45,000</div>
              <p className="text-sm text-gray-600">Total Earnings</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
