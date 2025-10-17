import React, { useState, useRef, ChangeEvent } from "react";
import { Category, Post, User } from "../types";
import { mockCategories } from "../mocks/mockCategories";
import { currentUser as defaultUser } from "../mocks/mockUsers";
import dayjs from "dayjs";

interface Props {
    onCreate?: (post: Post) => void;
    currentUser?: User;
}

const MAX_CHAR = 280;
const MAX_IMAGES = 4;

/**
 * 새로운 게시물을 생성하는 폼 컴포넌트
 */
export const CreatePost: React.FC<Props> = ({ onCreate, currentUser }) => {
    // 현재 사용자 정보 설정
    const user = currentUser ?? defaultUser;
    
    // 폼 상태 관리
    const [text, setText] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [categoryId, setCategoryId] = useState<number>(mockCategories[0]?.id ?? 1);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [submitting, setSubmitting] = useState(false);

    /**
     * 텍스트 입력 핸들러: 최대 글자 수 제한
     */
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length <= MAX_CHAR) setText(e.target.value);
    };

    /**
     * 파일 선택 핸들러: 이미지 미리보기 생성 및 최대 이미지 수 제한
     */
    const handleFiles = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        
        // 최대 이미지 수 제한
        const fileArr = Array.from(files).slice(0, MAX_IMAGES);
        // 파일 객체 URL 생성하여 미리보기 이미지 배열에 저장
        const previews = fileArr.map((file) => URL.createObjectURL(file));
        setImages(previews);
    };

    /**
     * 이미지 제거 핸들러: 이미지 URL 해제 및 배열에서 제거
     */
    const removeImage = (idx: number) => {
        const copy = images.slice();
        const removed = copy.splice(idx, 1);
        // 메모리 누수 방지를 위해 URL 해제
        if (removed[0]) URL.revokeObjectURL(removed[0]);
        setImages(copy);
    };

    /**
     * 게시물 등록: 새 게시물 객체 생성 및 업로드
     */
    const handleSubmit = async () => {
        // 내용 또는 이미지가 없으면 등록 방지
        if (!text.trim() && images.length === 0) {
            alert("내용 또는 이미지를 입력하세요.");
            return;
        }

        setSubmitting(true);

        // 새로운 Post 객체 생성
        const newPost: Post = {
            id: Date.now(),
            author: {
                name: user.name,
                nickname: user.nickname,
                profileImage: user.avatar ?? user.profileImage ?? "",
                verified: user.verified,
            },
            content: text,
            images,
            category: (mockCategories.find((c) => c.id === categoryId) ?? mockCategories[0]).id,
            categoryName: (mockCategories.find((c) => c.id === categoryId) ?? mockCategories[0]).name,
            createdAt: dayjs().toISOString(),
            likes: 0,
            retweets: 0,
            comments: 0,
            isLiked: false,
            isRetweeted: false,
            hasMoreComments: false,
            commentList: [],
        };

        // 업로드 지연 시간 (0.7초)
        await new Promise((r) => setTimeout(r, 700));
        
        onCreate?.(newPost);

        // 폼 초기화
        setText("");
        images.forEach((u) => URL.revokeObjectURL(u));
        setImages([]);
        setCategoryId(mockCategories[0]?.id ?? 1);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setSubmitting(false);
    };

    // 폼 렌더링
    return (
        <div style={styles.container}>
            {/* 작성자 정보 헤더 */}
            <div style={styles.header}>
                <img src={user.avatar} alt="me" style={styles.avatar} />
                <strong>{user.name}</strong>
            </div>

            {/* 본문 입력 영역 */}
            <textarea
                placeholder="무슨 생각을 하고 있나요?"
                value={text}
                onChange={handleTextChange}
                maxLength={MAX_CHAR}
                style={styles.textarea}
                rows={4}
                aria-label="post-content"
            />
            
            {/* 글자 수 카운터 및 카테고리 선택 */}
            <div style={styles.row}>
                <div style={{ fontSize: 12, color: "#666" }}>
                    {text.length}/{MAX_CHAR}
                </div>
                <div>
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(Number(e.target.value))}
                        aria-label="category-select"
                    >
                        {mockCategories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* 이미지 업로드 및 미리보기 */}
            <div style={{ marginTop: 8 }}>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFiles}
                    aria-label="image-upload"
                />
                <div style={styles.previewWrap}>
                    {images.map((src, i) => (
                        <div key={i} style={styles.preview}>
                            <img src={src} alt={`preview-${i}`} style={styles.previewImg} />
                            {/* 이미지 제거 버튼 */}
                            <button onClick={() => removeImage(i)} style={styles.removeBtn} aria-label={`remove-${i}`}>
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* 게시 버튼 */}
            <div style={styles.actions}>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    style={styles.postBtn}
                >
                    {submitting ? "업로드 중..." : "게시하기"}
                </button>
            </div>
        </div>
    );
};

const styles: { [k: string]: React.CSSProperties } = {
    container: {
        border: "1px solid #e6e6e6",
        borderRadius: 8,
        padding: 12,
        background: "#fff",
        marginBottom: 12,
    },
    header: { display: "flex", gap: 10, alignItems: "center", marginBottom: 8 },
    avatar: { width: 40, height: 40, borderRadius: "50%" },
    textarea: {
        width: "100%",
        resize: "vertical",
        padding: 8,
        borderRadius: 6,
        border: "1px solid #ddd",
    },
    row: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 6,
    },
    previewWrap: { display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" },
    preview: { position: "relative", width: 100, height: 100, borderRadius: 8, overflow: "hidden" },
    previewImg: { width: "100%", height: "100%", objectFit: "cover" },
    removeBtn: {
        position: "absolute",
        top: 4,
        right: 4,
        background: "rgba(0,0,0,0.5)",
        color: "#fff",
        border: "none",
        borderRadius: "50%",
        width: 22,
        height: 22,
        cursor: "pointer",
    },
    actions: { display: "flex", justifyContent: "flex-end", marginTop: 10 },
    postBtn: {
        padding: "8px 14px",
        borderRadius: 6,
        border: "none",
        background: "#1da1f2",
        color: "#fff",
        cursor: "pointer",
    },
};

export default CreatePost;