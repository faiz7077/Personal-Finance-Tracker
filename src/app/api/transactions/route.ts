import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Transaction from '@/models/Transaction'
import { EXPENSE_CATEGORIES } from '@/lib/constants'
import type { CreateTransactionInput } from '@/types/transaction'

export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json() as CreateTransactionInput
    // console.log('Category:', body.category)
    if (!body.category || !EXPENSE_CATEGORIES.includes(body.category)) {
      return NextResponse.json(
        { error: 'Valid category is required' },
        { status: 400 }
      )
    }
    // console.log('Category:', body.category)
    // console.log('Creating transaction...')
    const transaction = await Transaction.create({
      amount: body.amount,
      description: body.description,
      category: body.category,
      date: new Date(body.date)
    })
    // console.log('Transaction created:', transaction)
    return NextResponse.json(transaction)
  } catch (error) {
    console.error('Create transaction error:', error)
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await connectDB()
    const transactions = await Transaction.find({})
      .sort({ date: -1 })
      .limit(50)
      .lean()

    console.log('Fetched transactions:', transactions)
    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Fetch transactions error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
} 