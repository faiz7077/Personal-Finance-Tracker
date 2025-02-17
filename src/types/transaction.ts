import type { ExpenseCategory } from '@/lib/constants'

export interface Transaction {
  _id: string
  amount: number
  description: string
  category: ExpenseCategory
  date: string
  createdAt: string
  updatedAt: string
}

export interface CreateTransactionInput {
  amount: number
  description: string
  category: ExpenseCategory
  date: string
}

export interface UpdateTransactionInput extends Partial<CreateTransactionInput> {} 