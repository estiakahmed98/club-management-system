'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Trophy, Calendar, BarChart3, MapPin, Phone } from 'lucide-react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="bg-white">
      {/* Navigation */}
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/landing" className={`text-2xl font-bold ${scrolled ? 'text-blue-600' : 'text-white'}`}>
            ক্রীড়া ক্লাব
          </Link>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="outline" className={scrolled ? '' : 'border-white text-white hover:bg-white hover:text-blue-600'}>
                লগইন
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className={scrolled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white text-blue-600 hover:bg-gray-100'}>
                যোগ দিন
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-br from-blue-600 to-blue-900 pt-20 flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full opacity-20"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-300 rounded-full opacity-20"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">স্পোর্টস ক্লাব ম্যানেজমেন্ট সিস্টেম</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">আপনার ক্লাবের সকল কার্যক্রম পরিচালনা করুন একটি প্ল্যাটফর্ম থেকে</p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                এখনই যোগ দিন
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                বৈশিষ্ট্য দেখুন
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">আমাদের বৈশিষ্ট্যসমূহ</h2>
            <p className="text-gray-600 text-lg">সম্পূর্ণ ক্লাব পরিচালনার জন্য প্রয়োজনীয় সকল সরঞ্জাম</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <Users className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle>সদস্য ব্যবস্থাপনা</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                সকল সদস্যের তথ্য একটি জায়গায় সংরক্ষণ এবং পরিচালনা করুন
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Trophy className="w-8 h-8 text-yellow-600 mb-2" />
                <CardTitle>ম্যাচ ও টুর্নামেন্ট</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                ম্যাচ সময়সূচী এবং ফলাফল সহজেই পরিচালনা করুন
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Calendar className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle>ইভেন্ট ব্যবস্থাপনা</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                ক্লাব ইভেন্ট এবং অনুষ্ঠান সংগঠিত করুন সহজে
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="w-8 h-8 text-purple-600 mb-2" />
                <CardTitle>রিপোর্ট ও বিশ্লেষণ</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                বিস্তারিত রিপোর্ট এবং পরিসংখ্যান দেখুন
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">১০০+</div>
            <p className="text-blue-100">সক্রিয় সদস্য</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">৫০+</div>
            <p className="text-blue-100">অনুষ্ঠিত ইভেন্ট</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">২০০+</div>
            <p className="text-blue-100">খেলা আয়োজিত</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">১০০%</div>
            <p className="text-blue-100">সন্তুষ্টি হার</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">আজই শুরু করুন</h2>
          <p className="text-gray-600 text-lg mb-8">
            আপনার ক্লাবের জন্য একটি সম্পূর্ণ ডিজিটাল সমাধান পান
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              নতুন অ্যাকাউন্ট তৈরি করুন
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">সম্পর্কে</h4>
              <p className="text-sm">স্পোর্টস ক্লাব ম্যানেজমেন্ট সিস্টেম একটি আধুনিক সমাধান</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">দ্রুত লিঙ্ক</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/auth/login" className="hover:text-white">লগইন</Link></li>
                <li><Link href="/auth/signup" className="hover:text-white">যোগ দিন</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">যোগাযোগ</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Phone size={16} /> +৮৮ ০১৭-xxxx-xxxx
                </li>
                <li className="flex items-center gap-2">
                  <MapPin size={16} /> ঢাকা, বাংলাদেশ
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">অনুসরণ করুন</h4>
              <p className="text-sm">সোশ্যাল মিডিয়ায় আমাদের সাথে সংযুক্ত থাকুন</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 স্পোর্টস ক্লাব ম্যানেজমেন্ট সিস্টেম। সর্বাধিকার সংরক্ষিত।</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
