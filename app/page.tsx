"use client";

import Link from "next/link";
import { useEffect, useState } from "react";


export default function Home() {
  const [userCount, setUserCount] = useState<number | null>(null);

  useEffect(() => {
    // Fetch the total number of users
    const fetchUserCount = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        if (data.success) {
          setUserCount(data.count);
        } else {
          console.error("Failed to fetch user count");
        }
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

    fetchUserCount();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello, Next.js 16!</h1>
      <Link href="/users" className="text-blue-500 underline">
        ไปหน้าจัดการผู้ใช้
      </Link>
      {/* ดึงข้อมูลจำนวนผู้ใช้ทั้งหมดมาแสดง */}
      {userCount !== null ? (
        userCount === 0 ? (
          <p className="mt-4">ไม่มีผู้ใช้ในระบบ</p>
        ) : (
          <p className="mt-4">จำนวนผู้ใช้ทั้งหมด: {userCount}</p>
        )
      ) : (
        <p className="mt-4">กำลังโหลดจำนวนผู้ใช้...</p>
      )}
    </div>
  );
}
