'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone, Mail } from 'lucide-react';

const UserSupport = () => {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Support</h1>
        <p className="text-gray-600">Get help and contact customer support</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-primary" />
            <CardTitle>Live Chat</CardTitle>
            <CardDescription>Chat with our support team</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button className="w-full">Start Chat</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Phone className="w-12 h-12 mx-auto mb-4 text-primary" />
            <CardTitle>Phone Support</CardTitle>
            <CardDescription>Call us for immediate help</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full">
              +91-XXXX-XXXX
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Mail className="w-12 h-12 mx-auto mb-4 text-primary" />
            <CardTitle>Email Support</CardTitle>
            <CardDescription>Send us your questions</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full">
              support@servicehub.com
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Find quick answers to common questions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h4 className="font-medium mb-2">How do I book a service?</h4>
              <p className="text-sm text-gray-600">
                Browse our services, select a provider, choose your preferred time slot, and confirm your booking.
              </p>
            </div>
            <div className="border-b pb-4">
              <h4 className="font-medium mb-2">Can I cancel my booking?</h4>
              <p className="text-sm text-gray-600">
                Yes, you can cancel your booking up to 2 hours before the scheduled time.
              </p>
            </div>
            <div className="border-b pb-4">
              <h4 className="font-medium mb-2">How do I leave a review?</h4>
              <p className="text-sm text-gray-600">
                After your service is completed, you can leave a review from your booking history.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSupport;