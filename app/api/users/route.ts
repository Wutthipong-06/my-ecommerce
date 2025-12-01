import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - ดึงข้อมูล users ทั้งหมด
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    const users = await prisma.user.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } }
            ]
          }
        : {},
        // การเลือกฟิลด์ที่ต้องการส่งกลับ
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        password : true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: users,
      count: users.length
    })
  } catch (error) {
    console.error('GET /api/users error:', error)
    return NextResponse.json(
      { success: false, error: 'ไม่สามารถดึงข้อมูลผู้ใช้ได้' },
      { status: 500 }
    )
  }
}

// POST - สร้าง user ใหม่
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name, password, role } = body

    // Validate
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'อีเมลและรหัสผ่านเป็นข้อมูลที่จำเป็น' },
        { status: 400 }
      )
    }

    // ตรวจสอบว่า email ซ้ำมั้ย
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'อีเมลนี้ถูกใช้งานแล้ว' },
        { status: 409 }
      )
    }
    // ตรวจสอบว่า user ซ้ำมั้ย
    const existingUserByName = await prisma.user.findFirst({
      where: { name }
    })

    if (existingUserByName) {
      return NextResponse.json(
        { success: false, error: 'ชื่อนี้ถูกใช้งานแล้ว' },
        { status: 409 }
      )
    }

    // ตรวจสอบว user และ email ซ้ำมั้ย
    const existingUserByNameAndEmail = await prisma.user.findFirst({
      where: { name, email }
    })

    if (existingUserByNameAndEmail) {
      return NextResponse.json(
        { success: false, error: 'ชื่อนี้และอีเมลนี้ถูกใช้งานแล้ว' },
        { status: 409 }
      )
    }

    // สร้าง user ใหม่
    const user = await prisma.user.create({
      data: {
        email,
        name: name || null,
        password, // ในจริงต้อง hash ด้วย bcrypt
        role: role || 'USER'
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    })

    return NextResponse.json(
      { success: true, data: user },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/users error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
