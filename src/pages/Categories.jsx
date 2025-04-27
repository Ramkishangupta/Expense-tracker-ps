import { useState } from 'react';
import Card from '../components/Card';
import CategoryForm from '../components/CategoryForm';
import Modal from '../components/Modal';
import { useFinance } from '../contexts/FinanceContext';

const Categories = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  const handleOpenModal = (category = null) => {
    setCurrentCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCategory(null);
  };

  const handleSubmit = (data) => {
    if (currentCategory) {
      updateCategory({ ...currentCategory, ...data });
    } else {
      addCategory(data);
    }
    handleCloseModal();
  };

  const handleDelete = (category) => {
    if (window.confirm(`Are you sure you want to delete the category "${category.name}"? This will remove the category from all associated transactions.`)) {
      deleteCategory(category.id);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Categories</h1>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 w-full sm:w-auto"
        >
          Add Category
        </button>
      </div>

      <Card>
        {categories.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p>No categories found</p>
            <button
              onClick={() => handleOpenModal()}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Add your first category
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {categories.map(category => (
              <div 
                key={category.id}
                className="p-3 md:p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-2">
                  <div 
                    className="w-4 h-4 md:w-5 md:h-5 rounded-full mr-2" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <h3 className="text-base md:text-lg font-medium text-gray-800">{category.name}</h3>
                </div>
                
                <div className="flex mt-3 justify-end space-x-2">
                  <button
                    onClick={() => handleOpenModal(category)}
                    className="text-xs md:text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category)}
                    className="text-xs md:text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={`${currentCategory ? 'Edit' : 'Add'} Category`}
        size={window.innerWidth < 640 ? 'sm' : 'md'}
      >
        <CategoryForm
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          initialData={currentCategory}
        />
      </Modal>
    </div>
  );
};

export default Categories; 