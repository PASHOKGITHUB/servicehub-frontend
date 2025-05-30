// src/components/User/BookService.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  MapPin, 
  CreditCard, 
  DollarSign,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { useServiceDetails } from '@/hooks/useUserQueries';
import { useCreateBookingWithPayment, useVerifyPayment, useHandlePaymentFailure } from '@/hooks/useBookingQueries';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency } from '@/lib/formatters';
import { 
  PaymentMethod,
  CreateBookingWithPaymentRequest,
  BookingWithPaymentResponse,
} from '@/domain/entities/User/Payment';
import { toast } from 'sonner';

// Properly typed Razorpay interfaces
interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayError {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
  };
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  modal: {
    ondismiss: () => void;
  };
  theme: {
    color: string;
  };
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
}

interface RazorpayInstance {
  open(): void;
  on(event: string, handler: (response: RazorpayError) => void): void;
}

// Declare Razorpay global type
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface BookServiceProps {
  serviceId: string;
}

// User interface from auth store
interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

// Service details interface
interface ServiceProvider {
  _id: string;
  name: string;
}

interface ServiceDetails {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  serviceAreas: string[];
  provider: ServiceProvider;
}

interface ServiceDetailsResponse {
  service: ServiceDetails;
}

// Form data interfaces
interface FormAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
}

interface FormData {
  bookingDate: string;
  timeSlot: string;
  address: FormAddress;
  customerNotes: string;
  paymentMethod: PaymentMethod;
}

// Verification request interface
interface PaymentVerificationRequest {
  paymentId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Payment failure request interface
interface PaymentFailureRequest {
  paymentId: string;
  reason: string;
}

const BookService: React.FC<BookServiceProps> = ({ serviceId }) => {
  const router = useRouter();
  const { user } = useAuthStore() as { user: User | null };
  const { data: serviceData, isLoading: serviceLoading } = useServiceDetails(serviceId) as {
    data?: ServiceDetailsResponse;
    isLoading: boolean;
  };
  const createBookingMutation = useCreateBookingWithPayment();
  const verifyPaymentMutation = useVerifyPayment();
  const handlePaymentFailureMutation = useHandlePaymentFailure();

  const [formData, setFormData] = useState<FormData>({
    bookingDate: '',
    timeSlot: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      landmark: '',
    },
    customerNotes: '',
    paymentMethod: PaymentMethod.RAZORPAY,
  });

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'address') {
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address,
            [child]: value,
          },
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const calculateFees = (servicePrice: number) => {
    const serviceFee = servicePrice;
    const platformFee = Math.round(servicePrice * 0.1); // 10% platform fee
    const totalAmount = serviceFee + platformFee;
    
    return { serviceFee, platformFee, totalAmount };
  };

  const handleRazorpayPayment = (bookingResponse: BookingWithPaymentResponse): void => {
    const { payment, razorpayOrder } = bookingResponse;
    
    if (!window.Razorpay) {
      toast.error('Payment system not loaded. Please refresh and try again.');
      setIsProcessing(false);
      return;
    }

    if (!razorpayOrder || !razorpayOrder.id) {
      toast.error('Payment order creation failed. Please try again.');
      setIsProcessing(false);
      return;
    }
    
    const options: RazorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: 'ServiceHub',
      description: `Payment for ${serviceData?.service?.name}`,
      order_id: razorpayOrder.id,
      handler: async function (response: RazorpayResponse) {
        try {
          console.log('Payment successful, verifying...', response);
          
          const verificationRequest: PaymentVerificationRequest = {
            paymentId: payment._id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };
          
          await verifyPaymentMutation.mutateAsync(verificationRequest);
          
          toast.success('Booking confirmed! Payment successful.');
          router.push('/user/bookings/upcoming');
        } catch (error) {
          console.error('Payment verification failed:', error);
          toast.error('Payment verification failed. Please contact support.');
          
          const failureRequest: PaymentFailureRequest = {
            paymentId: payment._id,
            reason: 'Payment verification failed',
          };
          
          await handlePaymentFailureMutation.mutateAsync(failureRequest);
          setIsProcessing(false);
        }
      },
      modal: {
        ondismiss: async function () {
          console.log('Payment modal dismissed');
          
          const failureRequest: PaymentFailureRequest = {
            paymentId: payment._id,
            reason: 'Payment cancelled by user',
          };
          
          await handlePaymentFailureMutation.mutateAsync(failureRequest);
          
          toast.error('Payment cancelled');
          setIsProcessing(false);
        },
      },
      theme: {
        color: '#1EC6D9',
      },
      prefill: {
        name: user?.name || '',
        email: user?.email || '',
        contact: user?.phone || '',
      },
    };

    console.log('Opening Razorpay with options:', options);
    
    const razorpay = new window.Razorpay(options);
    
    razorpay.on('payment.failed', async function (response: RazorpayError) {
      console.error('Payment failed:', response);
      
      const failureRequest: PaymentFailureRequest = {
        paymentId: payment._id,
        reason: `Payment failed: ${response.error.description}`,
      };
      
      await handlePaymentFailureMutation.mutateAsync(failureRequest);
      
      toast.error(`Payment failed: ${response.error.description}`);
      setIsProcessing(false);
    });
    
    razorpay.open();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Validate form data before submission
      if (!formData.bookingDate || !formData.timeSlot) {
        toast.error('Please select date and time for your booking');
        setIsProcessing(false);
        return;
      }

      if (!formData.address.street || !formData.address.city || !formData.address.state || !formData.address.pincode) {
        toast.error('Please fill in all address fields');
        setIsProcessing(false);
        return;
      }

      // Validate pincode format
      const pincodeRegex = /^[1-9][0-9]{5}$/;
      if (!pincodeRegex.test(formData.address.pincode)) {
        toast.error('Please enter a valid 6-digit pincode');
        setIsProcessing(false);
        return;
      }

      // Check if booking date is in the future
      const selectedDate = new Date(formData.bookingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        toast.error('Please select a future date for your booking');
        setIsProcessing(false);
        return;
      }

      const bookingData: CreateBookingWithPaymentRequest = {
        service: serviceId,
        bookingDate: new Date(formData.bookingDate).toISOString(),
        timeSlot: formData.timeSlot,
        address: formData.address,
        customerNotes: formData.customerNotes || undefined,
        paymentMethod: formData.paymentMethod,
      };

      console.log('Submitting booking data:', bookingData);

      const bookingResponse = await createBookingMutation.mutateAsync(bookingData);

      if (formData.paymentMethod === PaymentMethod.RAZORPAY) {
        handleRazorpayPayment(bookingResponse);
      } else {
        toast.success('Booking created successfully!');
        router.push('/user/bookings/upcoming');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Booking creation failed:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Handle specific error cases
      if (errorMessage.includes('payment order')) {
        toast.error('Payment system error. Please try again or contact support.');
      } else if (errorMessage.includes('validation')) {
        toast.error('Please check your booking details and try again.');
      } else {
        toast.error(errorMessage || 'Failed to create booking. Please try again.');
      }
      
      setIsProcessing(false);
    }
  };

  if (serviceLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!serviceData?.service) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">Service not found</p>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const { service } = serviceData;
  const { serviceFee, platformFee, totalAmount } = calculateFees(service.price);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Book Service</h1>
          <p className="text-gray-600">Complete your booking for {service.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Form */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
            <CardDescription>Fill in the details for your service booking</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date and Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bookingDate">Service Date</Label>
                  <Input
                    id="bookingDate"
                    name="bookingDate"
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.bookingDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeSlot">Time Slot</Label>
                  <Input
                    id="timeSlot"
                    name="timeSlot"
                    type="time"
                    required
                    value={formData.timeSlot}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h3 className="font-medium">Service Address</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address.street">Street Address</Label>
                    <Input
                      id="address.street"
                      name="address.street"
                      required
                      placeholder="Enter your street address"
                      value={formData.address.street}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="address.city">City</Label>
                      <Input
                        id="address.city"
                        name="address.city"
                        required
                        placeholder="City"
                        value={formData.address.city}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address.state">State</Label>
                      <Input
                        id="address.state"
                        name="address.state"
                        required
                        placeholder="State"
                        value={formData.address.state}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="address.pincode">Pincode</Label>
                      <Input
                        id="address.pincode"
                        name="address.pincode"
                        required
                        placeholder="123456"
                        pattern="[1-9][0-9]{5}"
                        value={formData.address.pincode}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address.landmark">Landmark (Optional)</Label>
                      <Input
                        id="address.landmark"
                        name="address.landmark"
                        placeholder="Near landmark"
                        value={formData.address.landmark}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Notes */}
              <div className="space-y-2">
                <Label htmlFor="customerNotes">Special Instructions (Optional)</Label>
                <Textarea
                  id="customerNotes"
                  name="customerNotes"
                  placeholder="Any special instructions for the service provider..."
                  rows={3}
                  maxLength={500}
                  value={formData.customerNotes}
                  onChange={handleInputChange}
                />
              </div>

              {/* Payment Method */}
              <div className="space-y-3">
                <Label>Payment Method</Label>
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value as PaymentMethod }))}
                >
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value={PaymentMethod.RAZORPAY} id="razorpay" />
                    <Label htmlFor="razorpay" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="w-4 h-4" />
                      <span>Pay Online (Razorpay)</span>
                      <span className="text-sm text-green-600 ml-auto">Recommended</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg opacity-50">
                    <RadioGroupItem value={PaymentMethod.COD} id="cod" disabled />
                    <Label htmlFor="cod" className="flex items-center gap-2 cursor-not-allowed flex-1">
                      <DollarSign className="w-4 h-4" />
                      <span>Cash on Delivery</span>
                      <span className="text-sm text-gray-500 ml-auto">Coming Soon</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[#1EC6D9] to-[#16A8B8] hover:from-[#16A8B8] hover:to-[#128A96]" 
                size="lg"
                disabled={isProcessing || createBookingMutation.isPending}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Book Now - {formatCurrency(totalAmount)}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Service Summary */}
        <div className="space-y-6">
          {/* Service Details */}
          <Card>
            <CardHeader>
              <CardTitle>Service Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{service.name}</h3>
                    <p className="text-sm text-gray-600">by {service.provider.name}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {service.duration} minutes
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {service.serviceAreas?.[0]}
                      </div>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="text-sm text-gray-600">
                  <p>{service.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Price Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span>{formatCurrency(serviceFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span>{formatCurrency(platformFee)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Amount</span>
                  <span className="text-primary">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="text-xs text-gray-500">
                  * Platform fee includes taxes and service charges
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Booking Terms</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-gray-600 space-y-2">
              <p>• Service provider will arrive at your location at the scheduled time</p>
              <p>• You can cancel your booking up to 2 hours before the scheduled time</p>
              <p>• Payment will be processed securely through Razorpay</p>
              <p>• Refunds will be processed within 5-7 business days for cancelled bookings</p>
              <p>• Please ensure someone is available at the service location</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookService;