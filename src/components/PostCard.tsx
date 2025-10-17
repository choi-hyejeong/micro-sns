import { Post } from "../types";
import { fromNow } from "../utils/time";
import { parseContent } from "../utils/contentParser";
import { useLikeRetweet } from "../hooks/useLikeRetweet";
import { useComments } from "../hooks/useComments";
import { useImageSliderModal } from "../hooks/useImageSliderModal";
import "./PostCard.css";

interface Props {
    post: Post;
    now: number;
}

export const PostCard = ({ post, now }: Props) => {
    // 좋아요 및 리트윗 상태/핸들러 훅
    const { liked, likes, retweeted, retweets, handleLike, handleRetweet } =
        useLikeRetweet(post);
    
    // 댓글 관련 상태/핸들러 훅
    const {
        showComments,
        setShowComments,
        comments,
        newComment,
        setNewComment,
        handleAddComment,
        commentListRef,
    } = useComments(post.commentList);

    // 이미지 슬라이더 및 모달 관련 훅
    const imageCount = post.images?.length ?? 0;
    const {
        isModalOpen,
        setIsModalOpen,
        sliderIndex,
        setSliderIndex,
        modalImageIndex,
        openModal,
        prevSlide,
        nextSlide,
        modalPrevSlide,
        modalNextSlide,
        onTouchStart,
        onTouchMove,
        onTouchEnd,
    } = useImageSliderModal(imageCount);

    return (
        <>
            <div className="post-card">
                <div className="post-card-header">
                    <img
                        src={post.author.profileImage}
                        alt="profile"
                        className="post-card-avatar"
                        loading="lazy"
                    />
                    <div className="post-card-info">
                        <strong>{post.author.name}</strong>
                        <div className="post-card-time">
                            {fromNow(post.createdAt, now)}
                        </div>
                    </div>
                </div>

                <div className="post-card-category-badge">{post.categoryName}</div>
                <p className="post-card-content">{parseContent(post.content)}</p>

                {/* 이미지 출력 - 단일 이미지 */}
                {post.images && post.images.length === 1 && (
                    <img
                        src={post.images[0]}
                        alt="post"
                        className="post-card-image"
                        onClick={() => openModal(0)}
                        loading="lazy"
                    />
                )}
                {/* 이미지 출력 - 다중 이미지 (슬라이더) */}
                {post.images && post.images.length > 1 && (
                    <div
                        className="slider-container"
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        {/* 이전 */}
                        <button className="slider-arrow arrow-left" onClick={prevSlide}>
                            ‹
                        </button>
                        {/* 현재 이미지 */}
                        <img
                            src={post.images[sliderIndex]}
                            alt={`post image ${sliderIndex + 1}`}
                            className="post-card-image"
                            onClick={() => openModal(sliderIndex)}
                            loading="lazy"
                        />
                        {/* 다음 */}
                        <button className="slider-arrow arrow-right" onClick={nextSlide}>
                            ›
                        </button>
                        {/* 도트 네비게이션 */}
                        <div className="dots-container">
                            {post.images.map((_, i) => (
                                <span
                                    key={i}
                                    className={`dot ${i === sliderIndex ? "active" : ""}`}
                                    onClick={() => setSliderIndex(i)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* 버튼 영역 (좋아요, 리트윗, 댓글) */}
                <div className="post-card-footer">
                    <button
                        onClick={handleLike}
                        className={`icon-button like-button ${liked ? "liked" : ""}`}
                    >
                        <span className="material-icons">
                            {liked ? "favorite" : "favorite_border"}
                        </span>
                        {likes}
                    </button>

                    <button
                        onClick={handleRetweet}
                        className={`icon-button retweet-button ${retweeted ? "retweeted" : ""}`}
                    >
                        <span className="material-icons">repeat</span>
                        {retweets}
                    </button>

                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="icon-button"
                    >
                        <span className="material-icons">chat_bubble_outline</span>
                        {post.comments + (comments.length - (post.commentList?.length ?? 0))}
                    </button>
                </div>

                {/* 댓글 영역 */}
                {showComments && (
                    <div className="comment-section">
                        {/* 댓글 입력 폼 */}
                        <div className="comment-input-container">
                            <input
                                type="text"
                                placeholder="댓글을 입력하세요..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="comment-input"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleAddComment();
                                }}
                            />
                            <button onClick={handleAddComment} className="comment-button">
                                등록
                            </button>
                        </div>

                        {/* 댓글 목록 */}
                        <div className="comment-list" ref={commentListRef}>
                            {comments.map((comment, index) => (
                                <div key={index} className="comment">
                                    <img
                                        src={comment.author.profileImage}
                                        alt="profile"
                                        className="comment-avatar"
                                        loading="lazy"
                                    />
                                    <div>
                                        <div className="comment-author-info">
                                            <strong>{comment.author.name}</strong>{" "}
                                            <span className="comment-time">
                                                {comment.createdAt ? fromNow(comment.createdAt, now) : "시간 없음"}
                                            </span>
                                        </div>
                                        <p className="comment-content">{comment.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* 이미지 모달 컴포넌트 */}
            {isModalOpen && post.images && post.images.length > 0 && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        {/* 모달 닫기 버튼 */}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="modal-close-button"
                        >
                            ✕
                        </button>

                        {/* 모달 내 슬라이드 화살표 */}
                        {post.images.length > 1 && (
                            <>
                                <button className="modal-arrow modal-arrow-left" onClick={modalPrevSlide}>
                                    ‹
                                </button>
                                <button className="modal-arrow modal-arrow-right" onClick={modalNextSlide}>
                                    ›
                                </button>
                            </>
                        )}

                        {/* 모달 이미지 */}
                        <img
                            src={post.images[modalImageIndex]}
                            alt={`post large image ${modalImageIndex + 1}`}
                            className="modal-image"
                            loading="lazy"
                        />
                    </div>
                </div>
            )}
        </>
    );
};
