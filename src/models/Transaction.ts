// import mongoose from 'mongoose'
// import { EXPENSE_CATEGORIES } from '@/lib/constants'

// const transactionSchema = new mongoose.Schema({
//   amount: {
//     type: Number,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   category: {
//     type: String,
//     required: true,
//     enum: {
//       values: EXPENSE_CATEGORIES,
//       message: 'Invalid category'
//     },
//     default: EXPENSE_CATEGORIES[0]
//   },
//   date: {
//     type: Date,
//     required: true,
//     default: Date.now,
//   }
// }, {
//   timestamps: true,
//   strict: true
// })

// // Add strict validation and logging
// transactionSchema.pre('save', function(next) {
//   if (!this.category) {
//     next(new Error('Category is required'))
//     return
//   }
  
//   if (!EXPENSE_CATEGORIES.includes(this.category)) {
//     next(new Error(`Invalid category: ${this.category}`))
//     return
//   }

//   console.log('Saving transaction with data:', {
//     amount: this.amount,
//     description: this.description,
//     category: this.category,
//     date: this.date
//   })
//   next()
// })

// // Check if the model is already defined to prevent overwriting
// const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema)

// export default Transaction 



import mongoose from 'mongoose'
import { EXPENSE_CATEGORIES } from '@/lib/constants'

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: {
      values: EXPENSE_CATEGORIES,
      message: 'Invalid category'
    },
    default: EXPENSE_CATEGORIES[0]  // Default category
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  }
}, {
  timestamps: true,
  strict: true
})

// Add strict validation and logging before saving
transactionSchema.pre('save', function(next) {
  console.log('Transaction before save:', this) // Log the whole transaction object
  
  if (!this.category) {
    next(new Error('Category is required'))
    return
  }
  
  if (!EXPENSE_CATEGORIES.includes(this.category)) {
    next(new Error(`Invalid category: ${this.category}`))
    return
  }

  console.log('Saving transaction with data:', {
    amount: this.amount,
    description: this.description,
    category: this.category,
    date: this.date
  })
  
  next()  // Proceed with saving the document
})

// Check if the model is already defined to prevent overwriting
const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema)

export default Transaction
