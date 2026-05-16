'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trash2, Edit2, Plus, Trophy } from 'lucide-react';

interface Tournament {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  location?: string;
  entryFee: number;
  totalPrize: number;
  description?: string;
  createdAt: string;
}

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    location: '',
    entryFee: '',
    totalPrize: '',
    description: '',
  });

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const response = await fetch('/api/admin/tournaments');
      if (response.ok) {
        const data = await response.json();
        setTournaments(data);
      }
    } catch (error) {
      console.error('Failed to fetch tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTournament = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.startDate || !formData.endDate) {
      alert('দয়া করে প্রয়োজনীয় ক্ষেত্র পূরণ করুন');
      return;
    }

    try {
      const response = await fetch('/api/admin/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          entryFee: parseFloat(formData.entryFee) || 0,
          totalPrize: parseFloat(formData.totalPrize) || 0,
        }),
      });

      if (response.ok) {
        setFormData({
          name: '',
          startDate: '',
          endDate: '',
          location: '',
          entryFee: '',
          totalPrize: '',
          description: '',
        });
        setShowForm(false);
        fetchTournaments();
      }
    } catch (error) {
      console.error('Failed to add tournament:', error);
      alert('টুর্নামেন্ট যোগ করতে ব্যর্থ হয়েছে');
    }
  };

  const handleDeleteTournament = async (id: string) => {
    if (!confirm('এই টুর্নামেন্ট মুছে ফেলতে চান?')) return;

    try {
      const response = await fetch(`/api/admin/tournaments/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchTournaments();
      }
    } catch (error) {
      console.error('Failed to delete tournament:', error);
      alert('টুর্নামেন্ট মুছতে ব্যর্থ হয়েছে');
    }
  };

  const upcomingTournaments = tournaments.filter(
    (t) => new Date(t.startDate) > new Date()
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">টুর্নামেন্ট</h1>
          <p className="text-gray-600 mt-1">ক্লাবের সকল টুর্নামেন্ট পরিচালনা করুন</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-yellow-600">
          <Plus className="w-4 h-4 mr-2" />
          নতুন টুর্নামেন্ট
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100">
          <CardHeader>
            <CardTitle className="text-yellow-900">সর্বমোট টুর্নামেন্ট</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">{tournaments.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100">
          <CardHeader>
            <CardTitle className="text-orange-900">আসন্ন টুর্নামেন্ট</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">{upcomingTournaments}</p>
          </CardContent>
        </Card>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="bg-yellow-50">
          <CardHeader>
            <CardTitle>নতুন টুর্নামেন্ট যোগ করুন</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddTournament} className="space-y-4">
              <Input
                placeholder="টুর্নামেন্ট নাম"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">শুরুর তারিখ</label>
                  <Input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">শেষের তারিখ</label>
                  <Input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  placeholder="স্থান"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="এন্ট্রি ফি"
                  value={formData.entryFee}
                  onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="মোট পুরস্কার"
                  value={formData.totalPrize}
                  onChange={(e) => setFormData({ ...formData, totalPrize: e.target.value })}
                />
                <Input
                  placeholder="বর্ণনা"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-yellow-600">সংরক্ষণ করুন</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  বাতিল করুন
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tournaments List */}
      {loading ? (
        <p className="text-center py-8 text-gray-600">লোড হচ্ছে...</p>
      ) : tournaments.length === 0 ? (
        <p className="text-center py-8 text-gray-600">কোনো টুর্নামেন্ট নেই</p>
      ) : (
        <div className="grid gap-4">
          {tournaments.map((tournament) => (
            <Card key={tournament.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{tournament.name}</h3>
                        <p className="text-sm text-gray-500">
                          {tournament.location && `${tournament.location} • `}
                          {new Date(tournament.startDate).toLocaleDateString('bn-BD')} - {new Date(tournament.endDate).toLocaleDateString('bn-BD')}
                        </p>
                      </div>
                    </div>
                    {tournament.description && (
                      <p className="text-sm text-gray-600 mt-2">{tournament.description}</p>
                    )}
                    <div className="flex gap-4 mt-3 text-sm">
                      <span className="text-gray-600">এন্ট্রি: ৳ {tournament.entryFee}</span>
                      <span className="text-green-600 font-semibold">পুরস্কার: ৳ {tournament.totalPrize.toLocaleString('bn-BD')}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTournament(tournament.id)}
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
