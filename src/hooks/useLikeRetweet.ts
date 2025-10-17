import { useState } from "react";
import { toggleLike, toggleRetweet } from "../api/posts";
import { Post } from "../types";

/**
 * 좋아요 및 리트윗 기능을 처리하는 커스텀 훅
 * @param post 초기 게시물 데이터
 * @returns 좋아요/리트윗 상태, 핸들러 함수
 */
export function useLikeRetweet(post: Post) {
    const [liked, setLiked] = useState(post.isLiked);
    const [likes, setLikes] = useState(post.likes);

    const [retweeted, setRetweeted] = useState(post.isRetweeted ?? false);
    const [retweets, setRetweets] = useState(post.retweets ?? 0);

    const handleLike = async () => {
        setLiked((prev) => !prev);
        setLikes((prev) => (liked ? prev - 1 : prev + 1));
        await toggleLike(post.id);
    };

    const handleRetweet = async () => {
        setRetweeted((prev) => !prev);
        setRetweets((prev) => (retweeted ? prev - 1 : prev + 1));
        await toggleRetweet(post.id);
    };

    return {
        liked,
        likes,
        retweeted,
        retweets,
        handleLike,
        handleRetweet,
    };
}