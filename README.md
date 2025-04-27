# Finance Tracker

A modern, responsive personal finance management application built with React and Tailwind CSS.


## Features

- **Dashboard Overview**: View your financial status at a glance with summary cards and visualizations
- **Transaction Management**: Add, edit, and delete income and expense transactions
- **Budgeting Tools**: Set and monitor budgets by category
- **Category Management**: Create and customize expense categories
- **Data Visualization**: Interactive charts for spending analysis
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **Local Storage**: Your data stays private and is stored locally in your browser

## Technology Stack

- **Frontend**: React.js with functional components and hooks
- **State Management**: React Context API
- **Styling**: Tailwind CSS for modern UI design
- **Charts**: Recharts for data visualization
- **Icons**: React Icons (Font Awesome)
- **Storage**: Browser LocalStorage for data persistence

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/finance-tracker.git
   cd finance-tracker
   ```

2. Install dependencies
   ```
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage Guide

### Adding Transactions

1. Navigate to the Transactions tab
2. Click the "Add Transaction" button
3. Fill in the transaction details (amount, date, description, category)
4. Select transaction type (income or expense)
5. Click "Add" to save

### Setting Budgets

1. Navigate to the Budget tab
2. Click "Set Budget" for a category
3. Enter your monthly budget amount
4. Monitor your spending progress with the visual indicators

### Managing Categories

1. Go to the Categories tab
2. Add new categories with custom colors
3. Edit or delete existing categories as needed

## Project Structure

```
finance-tracker/
├── public/              # Static files
├── src/                 # Source code
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React Context providers
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Main page components
│   ├── App.jsx          # Main application component
│   ├── App.css          # Global styles
│   └── main.jsx         # Application entry point
├── package.json         # Dependencies and scripts
└── README.md            # Project documentation
```

## Customization

### Changing Theme Colors

The application uses Tailwind CSS for styling. The primary color scheme is indigo-based, but you can easily modify it:

1. Update color references in components (look for `text-indigo-600`, `bg-indigo-100`, etc.)
2. For hex colors, update the values in components (like `#6366f1`)

### Adding New Features

The codebase is structured to make extending functionality straightforward:

1. Create new components in the `components` directory
2. Add new pages in the `pages` directory
3. Extend the state in `FinanceContext.jsx` as needed


This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons provided by [React Icons](https://react-icons.github.io/react-icons/)
- Charts powered by [Recharts](https://recharts.org/en-US/)
- UI components inspired by [Tailwind UI](https://tailwindui.com/)

---

© 2025 Finance Tracker. All rights reserved.
