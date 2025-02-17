export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Shopping',
  'Transportation',
  'Bills & Utilities',
  'Entertainment',
  'Health & Medical',
  'Travel',
  'Education',
  'Personal Care',
  'Home',
  'Other'
] as const

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]

// Category colors for charts and UI
export const CATEGORY_COLORS = {
  'Food & Dining': 'hsl(0, 70%, 50%)',
  'Shopping': 'hsl(30, 70%, 50%)',
  'Transportation': 'hsl(60, 70%, 50%)',
  'Bills & Utilities': 'hsl(90, 70%, 50%)',
  'Entertainment': 'hsl(120, 70%, 50%)',
  'Health & Medical': 'hsl(150, 70%, 50%)',
  'Travel': 'hsl(180, 70%, 50%)',
  'Education': 'hsl(210, 70%, 50%)',
  'Personal Care': 'hsl(240, 70%, 50%)',
  'Home': 'hsl(270, 70%, 50%)',
  'Other': 'hsl(300, 70%, 50%)'
} as const

// Category icons
export const CATEGORY_ICONS = {
  'Food & Dining': '🍽️',
  'Shopping': '🛍️',
  'Transportation': '🚗',
  'Bills & Utilities': '📱',
  'Entertainment': '🎮',
  'Health & Medical': '🏥',
  'Travel': '✈️',
  'Education': '📚',
  'Personal Care': '💅',
  'Home': '🏠',
  'Other': '📦'
} as const

// Short names for charts
export const CATEGORY_SHORT_NAMES = {
  'Food & Dining': 'Food',
  'Shopping': 'Shop',
  'Transportation': 'Transport',
  'Bills & Utilities': 'Bills',
  'Entertainment': 'Fun',
  'Health & Medical': 'Health',
  'Travel': 'Travel',
  'Education': 'Edu',
  'Personal Care': 'Personal',
  'Home': 'Home',
  'Other': 'Other'
} as const 