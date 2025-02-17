'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

export default function MonthlyExpensesChart() {
  // Temporary mock data - will be replaced with real data later
  const data = [
    { month: "Jan", expenses: 1200 },
    { month: "Feb", expenses: 900 },
    { month: "Mar", expenses: 1500 },
    { month: "Apr", expenses: 800 },
    { month: "May", expenses: 1100 },
    { month: "Jun", expenses: 1300 },
  ]

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar 
            dataKey="expenses" 
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
} 