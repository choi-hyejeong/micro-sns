import { PostCard } from "./PostCard";
import Loader from "./Loader";
import PullToRefresh from "react-pull-to-refresh";
import { mockCategories } from "../mocks/mockCategories";
import { currentUser } from "../mocks/mockUsers";
import { usePostFeed } from "../hooks/usePostFeed";
import { CreatePostModal } from "./CreatePostModal";
import "./PostList.css";

/**
 * 게시물 피드 목록, 필터링, 정렬 및 게시물 작성 기능을 제공하는 메인 컴포넌트
 */
export const PostList = () => {
    // 피드 관련 상태와 핸들러를 관리하는 커스텀 훅
    const {
        posts,
        loading,
        refreshing,
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
    } = usePostFeed();

    return (
        <>
            {/* 고정 헤더 (필터 및 정렬) */}
            <div className="fixed-header">
                {/* 카테고리 필터 */}
                <div className="category-filter">
                    <button
                        onClick={() => handleCategoryChange(null)}
                        className={`filter-button ${selectedCategoryId === null ? "active" : ""}`}
                    >
                        전체
                    </button>
                    {mockCategories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryChange(cat.id)}
                            className={`filter-button ${selectedCategoryId === cat.id ? "active" : ""}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* 정렬 버튼 */}
                <div className="sort-container">
                    <button onClick={handleSortChange} className="filter-button">
                        등록시간: {sortOrder === "asc" ? "오래된순" : "최신순"}
                    </button>
                </div>
            </div>

            {/* 새 글 알림 */}
            {isNewPostAlertVisible && (
                <div onClick={handleScrollToNewPost} className="new-post-alert">
                    새로운 글이 추가되었습니다 🔼
                </div>
            )}

            {/* 콘텐츠 영역 */}
            <div className="content-area">
                {/* 풀 투 리프레시 */}
                <PullToRefresh onRefresh={refreshPosts} style={{ WebkitOverflowScrolling: "touch" }}>
                    {/* 게시물 작성 모달 */}
                    <CreatePostModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onCreate={handleCreatePost}
                        currentUser={currentUser}
                    />

                    {/* 게시물 리스트 or 로딩 (새로고침 중일 때) */}
                    {refreshing ? (
                        <Loader count={3} />
                    ) : (
                        posts.map((post) => {
                            return (
                                <div key={post.id}>
                                    <PostCard post={post} now={now} />
                                </div>
                            );
                        })
                    )}

                    {/* 로딩 */}
                    {!refreshing && loading && <Loader count={3} />}

                    <div ref={loader} className="loader-trigger" />
                </PullToRefresh>
            </div>

            {/* 하단 글쓰기 버튼 */}
            <button
                onClick={() => setIsModalOpen(true)}
                aria-label="글 작성 버튼"
                className="float-button"
            >
                +
            </button>
        </>
    );
};
