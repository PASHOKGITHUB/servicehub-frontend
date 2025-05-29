import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MessageCircle } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Support
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Get help with your provider account and services
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-gray-200 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle>Phone Support</CardTitle>
            <CardDescription>Talk to our support team directly</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button className="w-full bg-gradient-to-r from-[#1EC6D9] to-[#16A8B8]">
              Call Support
            </Button>
            <p className="text-sm text-gray-500 mt-2">Available 9 AM - 6 PM</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle>Live Chat</CardTitle>
            <CardDescription>Get instant help through chat</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full border-[#1EC6D9] text-[#1EC6D9] hover:bg-[#1EC6D9] hover:text-white">
              Start Chat
            </Button>
            <p className="text-sm text-gray-500 mt-2">Usually responds in minutes</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-purple-600" />
            </div>
            <CardTitle>Email Support</CardTitle>
            <CardDescription>Send us your questions via email</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full">
              Send Email
            </Button>
            <p className="text-sm text-gray-500 mt-2">Response within 24 hours</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8 border border-gray-200 shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Quick answers to common provider questions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">How do I get paid?</h3>
              <p className="text-gray-600 text-sm">Payments are processed weekly and transferred to your registered bank account within 1-3 business days.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">How can I improve my ratings?</h3>
              <p className="text-gray-600 text-sm">Provide excellent service, communicate clearly with customers, arrive on time, and maintain professionalism.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Can I update my service areas?</h3>
              <p className="text-gray-600 text-sm">Yes, you can update your service areas anytime from the My Services section in your dashboard.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}