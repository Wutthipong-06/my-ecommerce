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
    <div className="min-h-screen flex flex-col py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to the User Management App</h1>
      </div>

      {/* Grid Col แสดงจำนวน Users และ posts */}
      <div className="container flex justify-center items-center mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* แสดงจำนวนผู้ใช้ทั้งหมด */}
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h2 className="text-2xl font-semibold mb-2">Total Users</h2>
          {/* ดึงข้อมูลจำนวนผู้ใช้ทั้งหมดมาแสดง */}
          {userCount !== null ? (
            userCount === 0 ? (
              <p className="mt-4">ไม่มีผู้ใช้ในระบบ</p>
          ) : (
              <p className="mt-4 text-3xl font-bold">{userCount}</p>
          )
          ) : (
            <p className="mt-4">กำลังโหลดจำนวนผู้ใช้...</p>
          )}
        </div>

        {/* แสดงจำนวนโพสต์ทั้งหมด */}
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h2 className="text-2xl font-semibold mb-2">Total Posts</h2>
          <p className="mt-4 text-3xl font-bold">42</p> {/* แก้ไขเป็นการดึงข้อมูลจริงในอนาคต */}
        </div>
      </div>
      </div>
    </div>
  );
}
