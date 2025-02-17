'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { Transaction } from '@/types/transaction'
import { EXPENSE_CATEGORIES } from '@/lib/constants'

type TransactionContextType = {
  transactions: Transaction[]
  setTransactions: (transactions: Transaction[]) => void
  addTransaction: (transaction: Transaction) => void
  deleteTransaction: (id: string) => void
  refreshTransactions: () => Promise<void>
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined)

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const refreshTransactions = useCallback(async () => {
    try {
      const response = await fetch('/api/transactions')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      
      // Validate categories in the response
      const validatedTransactions = data.map((t: Transaction) => ({
        ...t,
        category: EXPENSE_CATEGORIES.includes(t.category) ? t.category : EXPENSE_CATEGORIES[1]
      }))

      console.log('Fetched transactions with categories:', validatedTransactions)
      setTransactions(validatedTransactions)
    } catch (error) {
      console.error('Error fetching transactions:', error)
    }
  }, [])

  const addTransaction = useCallback((transaction: Transaction) => {
    // Validate category before adding
    const validCategory = EXPENSE_CATEGORIES.includes(transaction.category) 
      ? transaction.category 
      : EXPENSE_CATEGORIES[0]

    const validatedTransaction = {
      ...transaction,
      category: validCategory
    }

    console.log('Adding transaction with category:', validatedTransaction.category)
    setTransactions(prev => [validatedTransaction, ...prev])
  }, [])

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t._id !== id))
  }, [])

  return (
    <TransactionContext.Provider value={{
      transactions,
      setTransactions,
      addTransaction,
      deleteTransaction,
      refreshTransactions
    }}>
      {children}
    </TransactionContext.Provider>
  )
}

export function useTransactions() {
  const context = useContext(TransactionContext)
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider')
  }
  return context
} 