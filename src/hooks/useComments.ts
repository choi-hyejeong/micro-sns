// src/hooks/useComments.ts

import { useState, useRef } from "react";
import { Comment } from "../types";
import { currentUser } from "../mocks/mockUsers";

/**
 * 댓글 기능을 처리하는 커스텀 훅
 * @param initialComments 초기 댓글 목록
 * @returns 댓글 상태, 핸들러 함수
 */
export function useComments(initialComments: Comment[] | undefined) {
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState(initialComments || []);
    const [newComment, setNewComment] = useState("");
    const commentListRef = useRef<HTMLDivElement | null>(null);

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        const newCommentObj: Comment = {
            author: {
                name: currentUser.name,
                nickname: currentUser.nickname,
                profileImage: currentUser.avatar || "https://picsum.photos/40/40?random=999",
                verified: currentUser.verified,
            },
            content: newComment.trim(),
            createdAt: new Date().toISOString(),
            likes: 0,
            isLiked: false,
        };

        setComments((prev) => [...prev, newCommentObj]);
        setNewComment("");

        // 댓글 목록을 최하단으로 스크롤
        setTimeout(() => {
            if (commentListRef.current) {
                commentListRef.current.scrollTop = commentListRef.current.scrollHeight;
            }
        }, 0);
    };

    return {
        showComments,
        setShowComments,
        comments,
        newComment,
        setNewComment,
        handleAddComment,
        commentListRef,
    };
}
