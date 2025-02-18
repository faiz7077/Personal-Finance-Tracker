'use client';

import React, { useState } from 'react';
import { useTransactions } from '@/context/TransactionContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CategoryBudgetProps {}

const CategoryBudget: React.FC<CategoryBudgetProps> = () => {
  const { transactions } = useTransactions();
  const [budgets, setBudgets] = useState<{ [key: string]: number }>({});

  const handleBudgetChange = (category: string, value: string) => {
    setBudgets({
      ...budgets,
      [category]: parseFloat(value) || 0,
    });
  };

  const handleSaveBudgets = () => {
    // Logic to save budgets, e.g., API call or context update
    console.log('Budgets saved:', budgets);
  };

  const categories = Array.from(new Set(transactions.map(t => t.category)));

  return (
    <div>
      <h2>Set Monthly Budgets</h2>
      {categories.map(category => (
        <div key={category} style={{ marginBottom: '10px' }}>
          <label>{category}</label>
          <Input
            type="number"
            value={budgets[category] || ''}
            onChange={(e) => handleBudgetChange(category, e.target.value)}
            placeholder="Enter budget"
          />
        </div>
      ))}
      <Button onClick={handleSaveBudgets}>Save Budgets</Button>
    </div>
  );
};

export default CategoryBudget;
