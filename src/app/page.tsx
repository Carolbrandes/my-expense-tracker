import ExpensePage from './expenses/page';
import { TransactionProvider } from "./hooks/useTransactions";

export default function Home() {
  return < TransactionProvider>
    <ExpensePage />
  </TransactionProvider>
    ;
}