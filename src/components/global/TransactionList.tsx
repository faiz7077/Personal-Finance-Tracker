'use client'

import { useEffect, useState } from 'react'
import { Card } from "@/components/ui/card"
import { Transaction } from '@/types/transaction'
import { format } from 'date-fns'
import { Button } from '../ui/button'
import { Trash2, Pencil } from 'lucide-react'
import { useTransactions } from '@/context/TransactionContext'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from '../ui/input'
import { EXPENSE_CATEGORIES, type ExpenseCategory } from '@/lib/constants'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type EditedValues = {
  amount: string;
  description: string;
  date: string;
  category: ExpenseCategory;
}

export default function TransactionList() {
  const [isLoading, setIsLoading] = useState(true)
  const { transactions, deleteTransaction, refreshTransactions } = useTransactions()
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [editedValues, setEditedValues] = useState<EditedValues>({
    amount: '',
    description: '',
    date: '',
    category: EXPENSE_CATEGORIES[0]
  })

  useEffect(() => {
    refreshTransactions().finally(() => setIsLoading(false))
  }, [refreshTransactions])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete')
      
      deleteTransaction(id)
    } catch (error) {
      console.error('Error deleting transaction:', error)
    }
  }

  const handleEdit = (transaction: Transaction) => {
    if (!transaction.category) {
      transaction.category = EXPENSE_CATEGORIES[0]
    }
    
    setEditingTransaction(transaction)
    setEditedValues({
      amount: Math.abs(transaction.amount).toString(),
      description: transaction.description,
      date: format(new Date(transaction.date), 'yyyy-MM-dd'),
      category: transaction.category
    })
  }

  const handleUpdate = async () => {
    if (!editingTransaction) return

    try {
      // Validate category before sending
      if (!EXPENSE_CATEGORIES.includes(editedValues.category)) {
        console.error('Invalid category:', editedValues.category)
        return
      }

      const response = await fetch(`/api/transactions/${editingTransaction._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: -Math.abs(Number(editedValues.amount)),
          description: editedValues.description,
          date: editedValues.date,
          category: editedValues.category
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update')
      }
      
      await refreshTransactions()
      setEditingTransaction(null)
    } catch (error) {
      console.error('Error updating transaction:', error)
    }
  }

  if (isLoading) {
    return <div>Loading transactions...</div>
  }

  return (
    <>
      <div className="space-y-4">
        {transactions.length === 0 ? (
          <p className="text-center text-muted-foreground">No transactions found</p>
        ) : (
          transactions.map((transaction) => (
            <Card key={transaction._id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{transaction.description}</p>
                <div className="flex gap-2 text-sm text-muted-foreground">
                  <span>{format(new Date(transaction.date), 'MMM d, yyyy')}</span>
                  <span>•</span>
                  <span className="font-medium">{transaction.category}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-medium text-red-600">
                  ${Math.abs(transaction.amount).toFixed(2)}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(transaction)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(transaction._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <Dialog open={!!editingTransaction} onOpenChange={() => setEditingTransaction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount</label>
                <Input
                  type="number"
                  step="0.01"
                  value={editedValues.amount}
                  onChange={(e) => setEditedValues(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={editedValues.date}
                  onChange={(e) => setEditedValues(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                value={editedValues.description}
                onChange={(e) => setEditedValues(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select 
                value={editedValues.category}
                onValueChange={(value: ExpenseCategory) => 
                  setEditedValues(prev => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleUpdate} className="w-full">
              Update Transaction
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 