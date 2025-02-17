import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Transaction from '@/models/Transaction'
import { EXPENSE_CATEGORIES } from '@/lib/constants'

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    if (!id) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      )
    }

    await connectDB()
    const transaction = await Transaction.findByIdAndDelete(id)
    
    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      message: 'Transaction deleted successfully',
      id 
    })
  } catch (error) {
    console.error('Delete transaction error:', error)
    return NextResponse.json(
      { error: 'Failed to delete transaction' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    if (!id) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      )
    }

    await connectDB()
    const body = await req.json()

    // Validate category
    if (body.category && !EXPENSE_CATEGORIES.includes(body.category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    const transaction = await Transaction.findByIdAndUpdate(
      id,
      {
        ...body,
        date: new Date(body.date)
      },
      { new: true }
    )
    
    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(transaction)
  } catch (error) {
    console.error('Update transaction error:', error)
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    )
  }
} 