"use client";

import { useState, useEffect } from 'react';
import type { Post, ApiResponse } from '@/types/post';
import Link from 'next/link';

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  // ดึงข้อมูลบทความจาก API เมื่อ component โหลดครั้งแรก
  useEffect(() => {
    async function fetchPosts() {
      try {
        // GET - ดึงข้อมูลบทความจาก API
        const res = await fetch('/api/post');
        const json: ApiResponse<Post[]> = await res.json();
        // ตรวจสอบผลลัพธ์และอัพเดทสถานะ
        if (json.success) {
          setPosts(json.data || []);
        } else {
          setError(json.error || 'ไม่สามารถดึงบทความได้');
        }
      } catch {
        setError('เกิดข้อผิดพลาดในการดึงข้อมูลบทความ');
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);


  // การสร้าง Post ใหม่
  const handleCreatePost = () => {
    // นำผู้ใช้ไปยังหน้าสร้างบทความ
    window.location.href = '/posts/newpost';
  }


  // กรองบทความตามการค้นหา
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📝 บทความทั้งหมด
          </h1>
          <p className="text-gray-600 text-lg">
            อ่านบทความที่น่าสนใจจากผู้เขียนของเรา
          </p>
          <button 
            onClick={handleCreatePost}
            className="mt-6 inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-full shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200"
          >
            สร้างบทความใหม่
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 ค้นหาบทความ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <span className="ml-4 text-gray-600 text-lg">กำลังโหลด...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-8">
            <div className="flex items-center">
              <span className="text-2xl mr-3">❌</span>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        {!loading && !error && (
          <>
            {filteredPosts.length === 0 ? (
              <div className="text-center py-20">
                <span className="text-6xl mb-4 block">📭</span>
                <p className="text-gray-500 text-xl">ไม่พบบทความ</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredPosts.map((post) => (
                  <Link 
                    key={post.id} 
                    href={`/posts/${post.id}`}
                    className="block group"
                  >
                    <article className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1">
                      <div className="p-6 sm:p-8">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              {post.published ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                                  ✅ เผยแพร่แล้ว
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
                                  📝 แบบร่าง
                                </span>
                              )}
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-3">
                              {post.title}
                            </h2>
                            {post.content && (
                              <p className="text-gray-600 line-clamp-2 leading-relaxed">
                                {post.content.substring(0, 150)}
                                {post.content.length > 150 ? '...' : ''}
                              </p>
                            )}
                          </div>
                          <div className="ml-4 text-gray-400 group-hover:text-blue-500 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 pt-4 border-t border-gray-100">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            ผู้เขียน
                          </span>
                          <span className="mx-3">•</span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            อ่านเพิ่มเติม →
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}

            {/* Posts Count */}
            <div className="text-center mt-8 text-gray-500">
              แสดง {filteredPosts.length} จาก {posts.length} บทความ
            </div>
          </>
        )}
      </div>
    </div>
  );
}