import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import TransactionList from "@/components/global/TransactionList"
import AddTransactionForm from "@/components/global/AddTransactionForm"
import MonthlyExpensesChart from "@/components/global/MonthlyExpensesChart"
// import PieChartComponent from "@/components/global/PieChart"
// import Dashboard from "@/components/global/Dashboard" // Component not found
import CategoryBudget from "@/components/global/CategoryBudget"
import Dashboard from "@/components/global/Dashboard"

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Add Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <AddTransactionForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyExpensesChart />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionList />
        </CardContent>
      </Card>



      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Dashboard />
        </CardContent>
      </Card>


      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Monthly Category Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryBudget />
        </CardContent>
      </Card>
    </main>
  )
}

