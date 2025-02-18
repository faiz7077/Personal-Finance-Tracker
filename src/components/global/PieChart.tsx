'use client';

import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

import { useTransactions } from '@/context/TransactionContext'; // Assuming you have a context to fetch transactions

interface Props {}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#36A2EB', '#FFCE56'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { name, description, category } = payload[0].payload;
    return (
      <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
        <p className="label" style={{ fontSize: '16px', fontWeight: 'bold' }}>{`${name}`}</p>
        <p className="intro" style={{ fontSize: '14px' }}>{`Description: ${description}`}</p>
        <p className="desc" style={{ fontSize: '12px', color: '#888' }}>{`Category: ${category}`}</p>
      </div>
    );
  }

  return null;
};

const PieChartComponent = (props: Props) => {
  const { transactions } = useTransactions(); // Fetch transactions from context
  const [data, setData] = useState<{ name: string; value: number; description: string; category: string }[]>([]);

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      const categoryTotals = transactions.reduce((acc: { [key: string]: number }, transaction) => {
        if (!acc[transaction.category]) {
          acc[transaction.category] = 0;
        }
        acc[transaction.category] += Math.abs(transaction.amount);
        return acc;
      }, {});

      const chartData = Object.entries(categoryTotals).map(([name, value]) => ({
        name,
        value,
        description: '',
        category: name,
      }));

      setData(chartData);
    }
  }, [transactions]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={150}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartComponent;

