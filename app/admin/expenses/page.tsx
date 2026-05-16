'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trash2, Edit2, Plus, Search } from 'lucide-react';

interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  expenseDate: string;
  eventId?: string;
  matchId?: string;
  tournamentId?: string;
  createdAt: string;
}

const expenseCategories = ['খাদ্য', 'জার্সি', 'মাঠ ভাড়া', 'পরিবহন', 'সরঞ্জাম', 'অন্যান্য'];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    category: 'খাদ্য',
    description: '',
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/admin/expenses');
      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
      }
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.description) {
      alert('দয়া করে সমস্ত ক্ষেত্র পূরণ করুন');
      return;
    }

    try {
      const response = await fetch('/api/admin/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
          category: formData.category,
          description: formData.description,
        }),
      });

      if (response.ok) {
        setFormData({ amount: '', category: 'খাদ্য', description: '' });
        setShowForm(false);
        fetchExpenses();
      }
    } catch (error) {
      console.error('Failed to add expense:', error);
      alert('খরচ যোগ করতে ব্যর্থ হয়েছে');
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm('এই খরচ মুছে ফেলতে চান?')) return;

    try {
      const response = await fetch(`/api/admin/expenses/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchExpenses();
      }
    } catch (error) {
      console.error('Failed to delete expense:', error);
      alert('খরচ মুছতে ব্যর্থ হয়েছে');
    }
  };

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">খরচ ব্যবস্থাপনা</h1>
          <p className="text-gray-600 mt-1">ক্লাবের সকল খরচ ট্র্যাক করুন</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          নতুন খরচ
        </Button>
      </div>

      {/* Stats */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50">
        <CardHeader>
          <CardTitle className="text-orange-900">মোট খরচ</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-orange-600">৳ {totalExpenses.toLocaleString('bn-BD')}</p>
        </CardContent>
      </Card>

      {/* Form */}
      {showForm && (
        <Card className="bg-blue-50">
          <CardHeader>
            <CardTitle>নতুন খরচ যোগ করুন</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">পরিমাণ (টাকা)</label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="১০০০"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ক্যাটাগরি</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    {expenseCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">বর্ণনা</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="খরচের বিবরণ লিখুন"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600">সংরক্ষণ করুন</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  বাতিল করুন
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="flex gap-2">
        <Input
          placeholder="খরচ অনুসন্ধান করুন..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button variant="outline" className="px-3">
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {/* Expenses List */}
      {loading ? (
        <p className="text-center py-8 text-gray-600">লোড হচ্ছে...</p>
      ) : filteredExpenses.length === 0 ? (
        <p className="text-center py-8 text-gray-600">কোনো খরচ নেই</p>
      ) : (
        <div className="grid gap-4">
          {filteredExpenses.map((expense) => (
            <Card key={expense.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-semibold">
                        ৳
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{expense.description}</h3>
                        <p className="text-sm text-gray-500">{expense.category}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">৳ {expense.amount.toLocaleString('bn-BD')}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(expense.expenseDate).toLocaleDateString('bn-BD')}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="ghost" size="sm">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
