'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useTransactions } from '@/context/TransactionContext';
import { Transaction } from '@/types/transaction';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { useTheme } from 'next-themes';
import PieChartComponent from './Piechart';

const LIGHT_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#36A2EB', '#FFCE56'];
const DARK_COLORS = ['#00509E', '#007A5E', '#CC9A00', '#CC4A00', '#CC4A84', '#1A5A9E', '#CC9A56'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px', color: 'black' }}>
        <p className="label">{`${label}`}</p>
        <p className="intro">{`Amount: $${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

const Dashboard = () => {
  console.log('Dashboard component rendered');

  const { transactions } = useTransactions();
  const { theme } = useTheme();
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [weeklyData, setWeeklyData] = useState<{ week: string; amount: number; color: string }[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [categoryData, setCategoryData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      // Calculate total expenses
      const total = transactions.reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
      setTotalExpenses(total);

      // Calculate weekly spending
      const colors = theme === 'dark' ? DARK_COLORS : LIGHT_COLORS;
      const weeklyTotals = transactions.reduce((acc: { [key: string]: { amount: number; color: string } }, transaction) => {
        const week = `Week ${Math.ceil(new Date(transaction.date).getDate() / 7)}`;
        if (!acc[week]) {
          acc[week] = { amount: 0, color: colors[Math.floor(Math.random() * colors.length)] };
        }
        acc[week].amount += Math.abs(transaction.amount);
        return acc;
      }, {});

      const chartData = Object.entries(weeklyTotals).map(([week, { amount, color }]) => ({
        week,
        amount,
        color,
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
  }, [transactions, theme]);

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
                <XAxis dataKey="week" stroke={theme === 'dark' ? 'white' : 'black'} />
                <YAxis stroke={theme === 'dark' ? 'white' : 'black'} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="amount"
                  fill="#888888"
                  onMouseOver={(data, index) => {
                    const bar = document.querySelectorAll('.recharts-bar-rectangle')[index];
                    if (bar) bar.setAttribute('fill', weeklyData[index].color);
                  }}
                  onMouseOut={(data, index) => {
                    const bar = document.querySelectorAll('.recharts-bar-rectangle')[index];
                    if (bar) bar.setAttribute('fill', '#8884d8');
                  }}
                >
                  {weeklyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#8884d8" />
                  ))}
                </Bar>
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
                    <Cell key={`cell-${index}`} fill={theme === 'dark' ? DARK_COLORS[index % DARK_COLORS.length] : LIGHT_COLORS[index % LIGHT_COLORS.length]} />
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
      {/* <PieChartComponent /> */}
    </div>
  );
};

export default Dashboard;