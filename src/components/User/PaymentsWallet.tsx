'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Wallet, Plus, History } from 'lucide-react';

const PaymentsWallet = () => {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Payments & Wallet</h1>
        <p className="text-gray-600">Manage your wallet balance and payment methods</p>
      </div>

      <Card>
        <CardContent className="p-8 text-center">
          <Wallet className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">Payment Features Coming Soon</h3>
          <p className="text-gray-600 mb-4">
            Wallet management and payment features are under development
          </p>
          <Button variant="outline">
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsWallet;