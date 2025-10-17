export interface User {
    id: number | string;
    name: string;
    nickname: string;
    avatar?: string;
    profileImage?: string;
    verified: boolean;
}

export interface Category {
    id: number;
    name: string;
}

export interface PostAuthor {
    name: string;
    nickname: string;
    profileImage: string;
    verified: boolean;
}

export interface CommentAuthor {
    name: string;
    nickname: string;
    profileImage: string;
    verified: boolean;
}

export interface Comment {
    author: CommentAuthor;
    content?: string;
    createdAt?: string;
    likes?: number;
    isLiked?: boolean;
}

export interface Post {
    id: number;
    author: PostAuthor;
    content: string;
    images?: string[];
    category: number;
    categoryName: string;
    createdAt: string;
    likes: number;
    retweets: number;
    comments: number;
    isLiked: boolean;
    isRetweeted: boolean;
    hasMoreComments?: boolean;
    commentList: Comment[];
}
