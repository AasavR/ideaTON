import React, { useState, useEffect } from 'react';
import { TonConnectButton, TonConnectProvider, useTonConnect } from '@tonconnect/ui-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Onboarding Modal
function OnboardingModal({ open, onClose }) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetTrigger asChild>
        {/* Invisible trigger wrapper */}
        <div />
      </SheetTrigger>
      <SheetContent>
        <h2 className="text-xl font-semibold mb-4">Welcome to P2PPro</h2>
        <p className="mb-4">Connect your TON wallet and start trading USDC with zero fees directly in Telegram.</p>
        <TonConnectButton />
      </SheetContent>
    </Sheet>
  );
}

// Offer Card
function OfferCard({ offer }) {
  return (
    <Card className="mb-4">
      <CardContent>
        <h3 className="text-lg font-bold">{offer.type} USDC</h3>
        <p>Amount: {offer.amount} USDC</p>
        <p>Price: {offer.price} TON</p>
        <Button className="mt-2">{offer.type === 'Buy' ? 'Sell Now' : 'Buy Now'}</Button>
      </CardContent>
    </Card>
  );
}

// Main Mini App Component
export default function MiniApp() {
  const [showOnboard, setShowOnboard] = useState(true);
  const { account } = useTonConnect();
  const [offers, setOffers] = useState([]);
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    if (account) {
      setShowOnboard(false);
    }
  }, [account]);

  // Fetch mock offers/trades
  useEffect(() => {
    setOffers([
      { id: 1, type: 'Buy', amount: 100, price: 99 },
      { id: 2, type: 'Sell', amount: 50, price: 50 }
    ]);
    setTrades([
      { id: 1, status: 'Completed', amount: 20, counterparty: '@alice' }
    ]);
  }, []);

  return (
    <TonConnectProvider>
      <div className="h-screen flex flex-col">
        <header className="p-4 bg-gray-900 text-white text-xl font-bold">P2PPro</header>
        <Tabs defaultValue="offers" className="flex-1">
          <TabsList>
            <TabsTrigger value="offers">Offers</TabsTrigger>
            <TabsTrigger value="trades">My Trades</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="offers" className="p-4">
            {offers.map(o => <OfferCard key={o.id} offer={o} />)}
          </TabsContent>

          <TabsContent value="trades" className="p-4">
            {trades.map(t => (
              <Card key={t.id} className="mb-4">
                <CardContent>
                  <h3 className="text-lg font-bold">{t.status}</h3>
                  <p>Amount: {t.amount} USDC</p>
                  <p>With: {t.counterparty}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="wallet" className="p-4">
            {account ? (
              <p>Your wallet: {account.address}</p>
            ) : (
              <TonConnectButton />
            )}
          </TabsContent>

          <TabsContent value="settings" className="p-4">
            <Button onClick={() => {/* disconnect logic */}}>Disconnect Wallet</Button>
          </TabsContent>
        </Tabs>

        {showOnboard && <OnboardingModal open={showOnboard} onClose={() => setShowOnboard(false)} />}
      </div>
    </TonConnectProvider>
  );
}
