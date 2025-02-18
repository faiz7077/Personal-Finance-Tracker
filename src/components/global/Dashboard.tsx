'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useTransactions } from '@/context/TransactionContext';
import { Transaction } from '@/types/transaction';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#36A2EB', '#FFCE56'];

const Dashboard = () => {
  const { transactions } = useTransactions();
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [weeklyData, setWeeklyData] = useState<{ week: string; amount: number }[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [categoryData, setCategoryData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      // Calculate total expenses
      const total = transactions.reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
      setTotalExpenses(total);

      // Calculate weekly spending
      const weeklyTotals = transactions.reduce((acc: { [key: string]: number }, transaction) => {
        const week = `Week ${Math.ceil(new Date(transaction.date).getDate() / 7)}`;
        if (!acc[week]) {
          acc[week] = 0;
        }
        acc[week] += Math.abs(transaction.amount);
        return acc;
      }, {});

      const chartData = Object.entries(weeklyTotals).map(([week, amount]) => ({
        week,
        amount,
      }));

      setWeeklyData(chartData);

      // Calculate category breakdown
      const categoryTotals = transactions.reduce((acc: { [key: string]: number }, transaction) => {
        if (!acc[transaction.category]) {
          acc[transaction.category] = 0;
        }
        acc[transaction.category] += Math.abs(transaction.amount);
        return acc;
      }, {});

      const categoryChartData = Object.entries(categoryTotals).map(([name, value]) => ({
        name,
        value,
      }));

      setCategoryData(categoryChartData);

      // Get the most recent transactions
      const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setRecentTransactions(sortedTransactions.slice(0, 5)); // Get the 5 most recent transactions
    }
  }, [transactions]);

  return (
    <div className="dashboard space-y-4">
      <div className="flex flex-wrap gap-4">
        <Card className="flex-1 min-w-[300px]">
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="flex-1 min-w-[300px]">
          <CardHeader>
            <CardTitle>Weekly Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData}>
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-wrap gap-4">
        <Card className="flex-1 min-w-[300px]">
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="flex-1 min-w-[300px]">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentTransactions.map(transaction => (
                <li key={transaction._id} className="flex justify-between">
                  <div>
                    <span className="font-medium">{transaction.description}</span>
                    <span className="text-sm text-muted-foreground ml-2"> 
                         {transaction.category}</span>
                    <span className="text-xs text-muted-foreground ml-2">| {new Date(transaction.date).toLocaleDateString()}</span>
                  </div>
                  <span className={`font-medium ${transaction.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    ${Math.abs(transaction.amount).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;