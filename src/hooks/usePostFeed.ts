import { useEffect, useRef, useState, useCallback } from "react";
import { getPosts } from "../api/posts";
import { Post } from "../types";

/**
 * 게시물 목록 피드의 데이터 로딩, 무한 스크롤, 새로고침, 필터링/정렬을 처리하는 커스텀 훅
 */
export function usePostFeed() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNewPostAlertVisible, setIsNewPostAlertVisible] = useState(false);
    const [newPostId, setNewPostId] = useState<number | null>(null);
    const [now, setNow] = useState(Date.now());
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const loader = useRef<HTMLDivElement | null>(null);

    // 최신 상태 추적용 useRef
    const sortOrderRef = useRef(sortOrder);
    const categoryRef = useRef(selectedCategoryId);
    const pageRef = useRef(page);

    useEffect(() => {
        sortOrderRef.current = sortOrder;
    }, [sortOrder]);

    useEffect(() => {
        categoryRef.current = selectedCategoryId;
    }, [selectedCategoryId]);

    useEffect(() => {
        pageRef.current = page;
    }, [page]);

    // 'now' 시간 업데이트 (상대 시간 표시용)
    useEffect(() => {
        const intervalId = setInterval(() => {
        setNow(Date.now());
        }, 60000); // 1분마다 업데이트
        return () => clearInterval(intervalId);
    }, []);

    const loadPosts = useCallback(async () => {
        if (!hasMore || loading || refreshing) return;
        setLoading(true);

        const newPosts = await getPosts(
            page,
            5,
            selectedCategoryId,
            sortOrder
        );

        setPosts((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const filtered = newPosts.filter((p) => !existingIds.has(p.id));
            return [...prev, ...filtered];
        });

        if (newPosts.length === 0) {
            setHasMore(false);
        }
        setLoading(false);
    }, [page, hasMore, loading, refreshing, selectedCategoryId, sortOrder]);

    const refreshPosts = useCallback(async () => {
        if (loading || refreshing) return;
        setRefreshing(true);

        const currentSortOrder = sortOrderRef.current;
        const currentCategory = categoryRef.current;
        const currentPage = pageRef.current;
        const itemsPerPage = 5;
        
        // 현재까지 로드된 모든 데이터를 한 번에 다시 불러오기
        const totalItemsToLoad = (currentPage - 1) * itemsPerPage + itemsPerPage;

        const refreshedPosts = await getPosts(
            1,
            totalItemsToLoad,
            currentCategory,
            currentSortOrder
        );

        setPosts(refreshedPosts);
        setPage(Math.max(2, Math.ceil(refreshedPosts.length / itemsPerPage) + 1)); // 현재 페이지 + 1 설정
        setHasMore(true);
        setRefreshing(false);
    }, [loading, refreshing]);

    const triggerFullRefresh = useCallback(
        async (category: number | null, sort: "asc" | "desc") => {
            setRefreshing(true);
            setLoading(false); // 로딩 중이던 요청은 무시
            const refreshed = await getPosts(1, 5, category, sort);
            setPosts(refreshed);
            setPage(2);
            setHasMore(true);
            setRefreshing(false);
        },
        []
    );

    const handleCategoryChange = (catId: number | null) => {
        setSelectedCategoryId(catId);
        triggerFullRefresh(catId, sortOrderRef.current);
    };

    const handleSortChange = () => {
        const newOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(newOrder);
        triggerFullRefresh(selectedCategoryId, newOrder);
    };

    const handleCreatePost = (newPost: Post) => {
        setIsModalOpen(false);
        setNewPostId(newPost.id);
        setIsNewPostAlertVisible(true);
        // 새 글을 목록 최상단에 추가하고 기존 중복 글(ID가 같은) 제거
        setPosts((prev) => [newPost, ...prev.filter((p) => p.id !== newPost.id)]);
        // 페이지를 2로 리셋하여 다음 스크롤 시 2페이지부터 로드 시작
        setPage(2);
        setHasMore(true);
    };

    // 초기 로딩 및 페이지 변경 시 추가 로드
    useEffect(() => {
        // 첫 페이지 로딩은 한번만
        if (page === 1 && posts.length > 0) return;
        loadPosts();
    }, [page, loadPosts]);


    // 무한 스크롤 Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting && !loading && !refreshing && hasMore) {
            setPage((p) => p + 1);
            }
        },
        { threshold: 1 }
        );

        if (loader.current) {
        observer.observe(loader.current);
        }

        return () => observer.disconnect();
    }, [loading, refreshing, hasMore]);

    // 새 글 알림 처리
    const handleScrollToNewPost = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setIsNewPostAlertVisible(false);
    };

    useEffect(() => {
        const handleScroll = () => {
        // 스크롤이 최상단(0)이 아니면 알림 숨김 (사용자가 피드 탐색 중)
        if (window.scrollY > 10 && isNewPostAlertVisible) {
            setIsNewPostAlertVisible(false);
        }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isNewPostAlertVisible]);


    return {
        posts,
        loading,
        refreshing,
        hasMore,
        now,
        selectedCategoryId,
        sortOrder,
        isModalOpen,
        setIsModalOpen,
        isNewPostAlertVisible,
        handleCategoryChange,
        handleSortChange,
        handleCreatePost,
        handleScrollToNewPost,
        refreshPosts,
        loader,
        newPostId,
    };
}