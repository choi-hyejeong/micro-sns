import { mockPosts } from "../mocks/mockPosts";
import { Post } from "../types";

/**
 * @param page 현재 페이지 번호
 * @param limit 페이지당 게시물 수
 * @param categoryId 필터링할 카테고리 ID (null이면 전체)
 * @param sortOrder 정렬 순서 ("asc": 오름차순, "desc": 내림차순)
 * @returns Post[] 게시물 배열을 반환
 */
export const getPosts = async (
    page: number,
    limit: number,
    categoryId: number | null = null,
    sortOrder: "asc" | "desc" = "desc"
): Promise<Post[]> => {
    // 1초 지연
    await new Promise((r) => setTimeout(r, 1000));

    let filtered = mockPosts;

    // 카테고리 필터링
    if (categoryId !== null) {
        filtered = filtered.filter((post) => post.category === categoryId);
    }

    // 시간 순서에 따른 정렬
    filtered = [...filtered].sort((a, b) => {
        const aTime = new Date(a.createdAt).getTime();
        const bTime = new Date(b.createdAt).getTime();

        return sortOrder === "asc" ? aTime - bTime : bTime - aTime;
    });

    // 페이지네이션 적용
    return filtered.slice((page - 1) * limit, page * limit);
};

/**
 * @param postId 좋아요를 토글할 게시물 ID
 * @returns 성공 여부를 포함하는 객체를 반환하는 Promise
 */
export const toggleLike = async (postId: number) => {
    // 0.5초 지연
    await new Promise((r) => setTimeout(r, 500));
    return { success: true };
};

/**
 * @param postId 리트윗을 토글할 게시물 ID
 * @returns 성공 여부를 포함하는 객체를 반환하는 Promise
 */
export const toggleRetweet = async (postId: number) => {
    // 0.5초 지연
    await new Promise((r) => setTimeout(r, 500));
    return { success: true };
};
