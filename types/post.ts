export interface Post {
    id: string;
    title: string;
    content: string | null;
    published: boolean;
    authorId: string;
    createdAt: string;
    updatedAt: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    count?: number;
    message?: string;
}