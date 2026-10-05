export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    author: string;
    category: string;
    imageUrl: string;
}

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    content: string;
    imageUrl: string;
}
