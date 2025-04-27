import { useState, useMemo } from 'react';
import Card from '../components/Card';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import Modal from '../components/Modal';
import { useFinance } from '../contexts/FinanceContext';

const Transactions = () => {
  const { transactions, categories, addTransaction, updateTransaction, deleteTransaction } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterCategory, setFilterCategory] = useState('');
  
  // Filtered and sorted transactions
  const filteredTransactions = useMemo(() => {
    return [...transactions]
      .filter(transaction => {
        // Apply search filter
        const searchMatch = 
          transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
          
        // Apply category filter
        let categoryMatch = true;
        
        if (filterCategory === 'income') {
          // Filter for income transactions (positive amount)
          categoryMatch = transaction.amount > 0;
        } else if (filterCategory === 'null') {
          // Filter for uncategorized expense transactions
          categoryMatch = transaction.amount < 0 && !transaction.category;
        } else if (filterCategory) {
          // Filter for specific expense category
          categoryMatch = transaction.category === filterCategory;
        }
          
        return searchMatch && categoryMatch;
      })
      .sort((a, b) => {
        // Apply sorting
        if (sortBy === 'date') {
          return sortOrder === 'asc' 
            ? new Date(a.date) - new Date(b.date)
            : new Date(b.date) - new Date(a.date);
        }
        
        if (sortBy === 'amount') {
          return sortOrder === 'asc' 
            ? a.amount - b.amount
            : b.amount - a.amount;
        }
        
        if (sortBy === 'description') {
          return sortOrder === 'asc'
            ? a.description.localeCompare(b.description)
            : b.description.localeCompare(a.description);
        }
        
        return 0;
      });
  }, [transactions, searchTerm, filterCategory, sortBy, sortOrder]);
  
  const handleOpenModal = (transaction = null) => {
    setCurrentTransaction(transaction);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTransaction(null);
  };
  
  const handleSubmit = (data) => {
    if (currentTransaction) {
      updateTransaction({ ...currentTransaction, ...data });
    } else {
      addTransaction(data);
    }
    handleCloseModal();
  };
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };
  
  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Transactions</h1>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 w-full sm:w-auto"
        >
          Add Transaction
        </button>
      </div>
      
      <Card>
        <div className="flex flex-col gap-4 mb-4">
          <div className="w-full">
            <input 
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="w-full">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">All Transactions</option>
                <option value="income">Income</option>
                {categories.length > 0 && (
                  <optgroup label="Expense Categories">
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                    <option value="null">Uncategorized Expenses</option>
                  </optgroup>
                )}
              </select>
            </div>
            
            <div className="w-full">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="date-desc">Date (Newest First)</option>
                <option value="date-asc">Date (Oldest First)</option>
                <option value="amount-desc">Amount (Highest First)</option>
                <option value="amount-asc">Amount (Lowest First)</option>
                <option value="description-asc">Description (A-Z)</option>
                <option value="description-desc">Description (Z-A)</option>
              </select>
            </div>
          </div>
        </div>
        
        <TransactionList
          transactions={filteredTransactions}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          categories={categories}
        />
      </Card>
      
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={`${currentTransaction ? 'Edit' : 'Add'} Transaction`}
        size={window.innerWidth < 640 ? 'sm' : 'md'}
      >
        <TransactionForm
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          initialData={currentTransaction}
          categories={categories}
        />
      </Modal>
    </div>
  );
};

export default Transactions; 