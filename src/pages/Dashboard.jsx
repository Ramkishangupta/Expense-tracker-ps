import { useMemo } from 'react';
import Card from '../components/Card';
import SummaryCard from '../components/SummaryCard';
import MonthlyExpensesChart from '../components/MonthlyExpensesChart';
import CategoryPieChart from '../components/CategoryPieChart';
import TransactionList from '../components/TransactionList';
import { useFinance } from '../contexts/FinanceContext';
import { FaArrowRight, FaMoneyBillWave, FaShoppingCart, FaBalanceScale } from 'react-icons/fa';

const Dashboard = () => {
  const { transactions, categories, stats } = useFinance();
  
  // Get the most recent 5 transactions for the dashboard
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [transactions]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <SummaryCard
          title="This Month's Income"
          value={stats.monthlyIncome}
          color="#10b981" // emerald-500
          icon={<FaMoneyBillWave size={20} />}
        />
        <SummaryCard
          title="This Month's Expenses"
          value={stats.monthlyExpenses}
          color="#ef4444" // red-500
          icon={<FaShoppingCart size={20} />}
        />
        <SummaryCard
          title="Net Balance"
          value={stats.balance}
          color="#6366f1" // indigo-500
          icon={<FaBalanceScale size={20} />}
          subtitle={`As of ${new Date().toLocaleDateString()}`}
          className="sm:col-span-2 md:col-span-1"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card 
          title="Monthly Overview" 
          className="lg:col-span-2"
        >
          <div className="h-64 sm:h-80">
            <MonthlyExpensesChart transactions={transactions} height="100%" />
          </div>
        </Card>
        
        {categories.length > 0 && (
          <Card title="Spending by Category">
            <div className="h-64 sm:h-80">
              <CategoryPieChart 
                transactions={transactions} 
                categories={categories}
                height="100%" 
              />
            </div>
          </Card>
        )}
        
        <Card 
          title="Recent Transactions"
          titleAction={
            recentTransactions.length > 0 ? (
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  // Handle navigation programmatically
                }}
                className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                View All <FaArrowRight className="ml-1" size={12} />
              </a>
            ) : null
          }
        >
          <div>
            {recentTransactions.length > 0 ? (
              <TransactionList
                transactions={recentTransactions}
                onEdit={() => {}}
                onDelete={() => {}}
                categories={categories}
                compact={true}
              />
            ) : (
              <div className="text-center py-6 text-gray-500">
                No transactions yet. Add your first transaction to get started.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard; 