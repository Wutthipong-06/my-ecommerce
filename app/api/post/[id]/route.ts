import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - ดึงข้อมูลโพสต์ตาม id
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const post = await prisma.post.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                content: true,
                published: true,
                authorId: true,
                createdAt: true,
                updatedAt: true,
            }
        });
        
        if (!post) {
            return NextResponse.json(
                { success: false, error: 'ไม่พบโพสต์' },
                { status: 404 }
            );
        }
        
        return NextResponse.json({ success: true, data: post });
    } catch (error) {
        console.error('GET /api/post/[id] error:', error);
        return NextResponse.json(
            { success: false, error: 'ไม่สามารถดึงข้อมูลโพสต์ได้' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { title, content, published } = body;
        
        // อัพเดทโพสต์ในฐานข้อมูล
        const updatedPost = await prisma.post.update({
            where: { id },
            data: { title, content, published },
        });
        
        // ส่งกลับข้อมูลโพสต์ที่อัปเดตแล้ว
        return NextResponse.json({ success: true, data: updatedPost });
    } catch (error) {
        console.error('PUT /api/post/[id] error:', error);
        return NextResponse.json(
            { success: false, error: 'ไม่สามารถอัปเดตโพสต์ได้' },
            { status: 500 }
        );
    }
}

// DELETE - ลบโพสต์ตาม id
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.post.delete({
            where: { id },
        });
        return NextResponse.json({ success: true, message: 'โพสต์ถูกลบเรียบร้อยแล้ว' });
    } catch (error) {
        console.error('DELETE /api/post/[id] error:', error);
        return NextResponse.json(
            { success: false, error: 'ไม่สามารถลบโพสต์ได้' },
            { status: 500 }
        );
    }
}