"use client"

import { useRouter } from "next/navigation";
import { useEffect } from 'react';
import ExpensePage from './expenses/page';
import { useAuth } from './hooks/useAuthContext';
import { TransactionProvider } from "./hooks/useTransactions";

export default function Home() {
  const { isAuthenticated, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return < TransactionProvider userId={userId}>
    <ExpensePage />
  </TransactionProvider>

    ;
}