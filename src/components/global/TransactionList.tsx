'use client'

import { Card } from "@/components/ui/card"

export default function TransactionList() {
  // Temporary mock data - will be replaced with real data later
  const transactions = [
    { id: 1, amount: 50.00, description: "Groceries", date: "2024-03-15" },
    { id: 2, amount: -30.00, description: "Restaurant", date: "2024-03-14" },
    { id: 3, amount: 1000.00, description: "Salary", date: "2024-03-13" },
  ]

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <Card key={transaction.id} className="p-4 flex justify-between items-center">
          <div>
            <p className="font-medium">{transaction.description}</p>
            <p className="text-sm text-muted-foreground">{transaction.date}</p>
          </div>
          <p className={`font-medium ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {transaction.amount >= 0 ? '+' : ''}{transaction.amount.toFixed(2)}
          </p>
        </Card>
      ))}
    </div>
  )
} 