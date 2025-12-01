'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/types/user';

export default function NewPostPage() {
    // Router
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [authorId, setAuthorId] = useState('');
    const [published, setPublished] = useState(false);

    // ดึงรายชื่อผู้ใช้ทั้งหมด
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/users');
                const json = await res.json();
                if (json.success) {
                    setUsers(json.data || []);
                } else {
                    setError('ไม่สามารถดึงรายชื่อผู้ใช้ได้');
                }
            } catch (err) {
                setError('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้');
            } finally {
                setLoadingUsers(false);
            }
        };
        fetchUsers();
    }, []);

    // ฟังก์ชันสร้างโพสต์
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Validate
        if (!title.trim()) {
            setError('กรุณากรอกหัวข้อบทความ');
            return;
        }
        if (!content.trim()) {
            setError('กรุณากรอกเนื้อหาบทความ');
            return;
        }
        if (!authorId) {
            setError('กรุณาเลือกผู้เขียนบทความ');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: title.trim(),
                    content: content.trim(),
                    authorId,
                    published,
                }),
            });

            const json = await res.json();

            if (json.success) {
                setSuccess(true);
                setTitle('');
                setContent('');
                setAuthorId('');
                setPublished(false);
                // ไปหน้ารายการโพสต์หลังจาก 1.5 วินาที
                setTimeout(() => {
                    router.push('/posts');
                }, 1500);
            } else {
                setError(json.error || 'ไม่สามารถสร้างบทความได้');
            }
        } catch (err) {
            setError('เกิดข้อผิดพลาดในการสร้างบทความ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
                <h1 className="text-3xl font-bold mb-6 text-gray-900 text-center">สร้างบทความใหม่ 📝</h1>

                {/* แสดงข้อความสำเร็จ */}
                {success && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                        ✅ สร้างบทความสำเร็จ! กำลังไปหน้ารายการโพสต์...
                    </div>
                )}

                {/* แสดงข้อความ error */}
                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                        ❌ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* หัวข้อบทความ */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            หัวข้อบทความ <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="กรอกหัวข้อบทความ"
                            disabled={loading}
                        />
                    </div>

                    {/* เนื้อหาบทความ */}
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                            เนื้อหาบทความ <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={6}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            placeholder="กรอกเนื้อหาบทความ"
                            disabled={loading}
                        />
                    </div>

                    {/* เลือกผู้เขียน */}
                    <div>
                        <label htmlFor="authorId" className="block text-sm font-medium text-gray-700 mb-2">
                            ผู้เขียนบทความ <span className="text-red-500">*</span>
                        </label>
                        {loadingUsers ? (
                            <div className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                                กำลังโหลดรายชื่อผู้ใช้...
                            </div>
                        ) : (
                            <select
                                id="authorId"
                                name="authorId"
                                value={authorId}
                                onChange={(e) => setAuthorId(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                disabled={loading}
                            >
                                <option value="">-- เลือกผู้เขียน --</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name || 'ไม่มีชื่อ'} ({user.email})
                                    </option>
                                ))}
                            </select>
                        )}
                        {users.length === 0 && !loadingUsers && (
                            <p className="mt-2 text-sm text-orange-600">
                                ⚠️ ยังไม่มีผู้ใช้ในระบบ กรุณาสร้างผู้ใช้ก่อน
                            </p>
                        )}
                    </div>

                    {/* เผยแพร่หรือไม่ */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="published"
                            name="published"
                            checked={published}
                            onChange={(e) => setPublished(e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            disabled={loading}
                        />
                        <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                            เผยแพร่บทความทันที
                        </label>
                    </div>

                    {/* ปุ่ม Submit */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading || loadingUsers}
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? '⏳ กำลังสร้าง...' : '✨ สร้างบทความ'}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push('/posts')}
                            disabled={loading}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed transition-colors"
                        >
                            ยกเลิก
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}