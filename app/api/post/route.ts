import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - ดึงข้อมูลโพสต์ทั้งหมด
export async function GET(request: Request) {
    try {
        // ดึงพารามิเตอร์ค้นหา (ถ้ามี)
        // ไว้สำหรับค้นหาชื่อโพสต์
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        // ค้นหาโพสต์จากฐานข้อมูล
        const posts = await prisma.post.findMany({
            // ค้นหาด้วยเงื่อนไข title ถ้ามีพารามิเตอร์ search
            where: search
                ? {
                    OR: [
                        { title: { contains: search, mode: 'insensitive' } },
                    ]
                }
                : {},
                select: {
                    id: true,
                    title: true,
                    content: true,
                    published: true,
                    authorId: true,
                },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json({ success: true, data: posts });
    }
    catch (error) {
        console.error('GET /api/posts error:', error);
        return NextResponse.json(
            { success: false, error: 'ไม่สามารถดึงข้อมูลโพสต์ได้' },
            { status: 500 }
        );
    }
}
// POST - สร้างโพสต์ใหม่
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, content, published, authorId } = body;
        // Validate
        if (!title || !content || !authorId) {
            return NextResponse.json(
                { success: false, error: 'Title, content, and authorId are required' },
                { status: 400 }
            );
        }
        // สร้างโพสต์ใหม่ในฐานข้อมูล
        const newPost = await prisma.post.create({
            data: {
                title,
                content,
                published: published ?? false,
                authorId,
            },
        });
        return NextResponse.json({ success: true, data: newPost });
        // จับข้อผิดพลาด ว่าไม่สามารถสร้างโพสต์ได้
    } catch (error) {
        console.error('POST /api/posts error:', error);
        return NextResponse.json(
            { success: false, error: 'ไม่สามารถสร้างโพสต์ได้' },
            { status: 500 }
        );
    }
}