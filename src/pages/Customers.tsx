
import { useState, useEffect } from 'react';
import CustomerListView from '@/components/customers/CustomerListView';
import { Helmet } from 'react-helmet-async';

const Customers = () => {
  return (
    <div>
      <Helmet>
        <title>ניהול לקוחות | Chen Mizrahi</title>
      </Helmet>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">ניהול לקוחות</h1>
        <p className="text-muted-foreground">
          צפה ונהל את רשימת הלקוחות שלך
        </p>
      </div>

      <CustomerListView />
    </div>
  );
};

export default Customers;
