"use client"

import { useRouter } from "next/navigation";
import { useEffect } from 'react';
import ExpensePage from './expenses/page';
import { useAuth } from './hooks/useAuthContext';
import { TransactionProvider } from "./hooks/useTransactions";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login"); // Redirect to login page if not authenticated
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Avoid rendering anything while redirecting
  }

  return < TransactionProvider>
    <ExpensePage />
  </TransactionProvider>

    ;
}