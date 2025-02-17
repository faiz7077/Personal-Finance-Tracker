'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { CreateTransactionInput } from "@/types/transaction"
import { useRouter } from "next/navigation"
import { useTransactions } from '@/context/TransactionContext'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EXPENSE_CATEGORIES, type ExpenseCategory } from '@/lib/constants'



const formSchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Amount must be a valid number",
  }),
  description: z.string().min(1, "Description is required"),
  category: z.enum(EXPENSE_CATEGORIES, {
    required_error: "Please select a category",
  }),
  date: z.string().min(1, "Date is required"),
})

export default function AddTransactionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { addTransaction, refreshTransactions } = useTransactions()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      description: "",
      category: EXPENSE_CATEGORIES[0],
      date: new Date().toISOString().split('T')[0],
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      console.log('Submitting with values:', values)
      console.log('Category:', values.category)
      const payload: CreateTransactionInput = {
        amount: -Math.abs(Number(values.amount)),
        description: values.description,
        category: values.category,
        date: values.date,
      }

      console.log('Sending payload:', payload)

      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      
      const data = await response.json()
      console.log('Response:', data)
      if (!response.ok) {
        console.error('Server error:', data)
        throw new Error(data.error || 'Failed to create transaction')
      }

      console.log('Server response:', data)
      addTransaction(data)
      
      form.reset({
        amount: "",
        description: "",
        category: values.category,
        date: new Date().toISOString().split('T')[0],
      })
      
      await refreshTransactions()
    } catch (error) {
      console.error('Error creating transaction:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Transaction'}
        </Button>
      </form>
    </Form>
  )
} 