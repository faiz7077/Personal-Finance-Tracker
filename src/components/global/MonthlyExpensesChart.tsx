'use client'

import { useEffect, useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, TooltipProps } from "recharts"
import { Transaction } from '@/types/transaction'
import { format } from 'date-fns'
import { useTransactions } from '@/context/TransactionContext'
import { ExpenseCategory } from '@/lib/constants'

type TransactionData = {
  description: string
  amount: number
  date: string
  category: string
}

type MonthlyData = {
  month: string
  expenses: number
  transactions: TransactionData[]
}



const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (!active || !payload || !payload[0]) return null

  const monthData = payload[0].payload as MonthlyData
  const transactions = monthData.transactions || []

  return (
    <div className="bg-background border rounded-lg shadow-lg p-4 max-w-[300px]">
      <h3 className="font-semibold mb-2">{label}</h3>
      <div className="space-y-2">
        <div className="flex justify-between gap-4">
          <span>Total Expenses:</span>
          <span className="text-red-600">${monthData.expenses.toFixed(2)}</span>
        </div>
        {transactions.length > 0 && (
          <div className="border-t mt-2 pt-2">
            <p className="font-semibold mb-1">Expense Details:</p>
            <div className="max-h-[200px] overflow-y-auto space-y-1">
              {transactions.map((t: TransactionData, index: number) => (
                <div key={index} className="text-sm flex justify-between gap-2">
                  <div className="flex flex-col">
                    <span>{t.description}</span>
                    <span className='text-sm'>{t.category}</span>
            
                    <span className="text-xs text-muted-foreground">{t.date}</span>
                  </div>
                  <span className="text-red-600">
                    ${Math.abs(t.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>


            



            
          </div>

          
        )}
      </div>
    </div>
  )
}

export default function MonthlyExpensesChart() {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { transactions, refreshTransactions } = useTransactions()

  useEffect(() => {
    refreshTransactions().finally(() => setIsLoading(false))
  }, [refreshTransactions])

  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setMonthlyData([])
      return
    }

    const monthlyTotals = transactions.reduce((acc: { [key: string]: MonthlyData }, transaction) => {
      const month = format(new Date(transaction.date), 'MMM yyyy')
      
      if (!acc[month]) {
        acc[month] = {
          month,
          expenses: 0,
          transactions: []
        }
      }

      // All amounts are treated as expenses (already stored as negative)
      acc[month].expenses += Math.abs(transaction.amount)
      acc[month].transactions.push({
        description: transaction.description,
        amount: transaction.amount,
        date: format(new Date(transaction.date), 'MMM d, yyyy'),
        category: transaction.category
      })

      return acc
    }, {})

    const chartData = Object.values(monthlyTotals)
      .map(data => ({
        ...data,
        expenses: Number(data.expenses.toFixed(2)),
        transactions: data.transactions.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      }))
      .sort((a, b) => {
        const dateA = new Date(a.month)
        const dateB = new Date(b.month)
        return dateA.getTime() - dateB.getTime()
      })

    setMonthlyData(chartData)
  }, [transactions])

  if (isLoading) {
    return <div className="h-[300px] w-full flex items-center justify-center">
      Loading chart data...
    </div>
  }

  if (monthlyData.length === 0) {
    return <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">
      No expense data available
    </div>
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={monthlyData}
          margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
        >
          <XAxis 
            dataKey="month"
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ fill: 'var(--hover-overlay)' }}
          />
          <Bar 
            dataKey="expenses" 
            fill="hsl(var(--destructive))"
            radius={[4, 4, 0, 0]}
            name="Expenses"
            maxBarSize={50}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
} 