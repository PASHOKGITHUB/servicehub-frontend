import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'My Bookings - ServiceHub',
  description: 'View and manage all your service bookings',
};

export default function BookingsPage() {
  // Redirect to upcoming bookings by default
  redirect('/user/bookings/upcoming');
}