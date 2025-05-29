import { Metadata } from 'next';
import PaymentsWallet from '@/components/User/PaymentsWallet';
import ProtectedRoute from '@/components/Common/ProtectedRoute';

export const metadata: Metadata = {
  title: 'Payments & Wallet - ServiceHub',
  description: 'Manage your wallet balance and payment methods',
};

export default function PaymentsWalletPage() {
  return (
    <ProtectedRoute allowedRoles={['user']} requireEmailVerification={true}>
      <PaymentsWallet />
    </ProtectedRoute>
  );
}