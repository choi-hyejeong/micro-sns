import React from "react";
import { CreatePost } from "./CreatePost";
import { Post, User } from "../types";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (newPost: Post) => void;
    currentUser: User;
}

/**
 * 게시물 작성 모달 컴포넌트
 */
export const CreatePostModal: React.FC<Props> = ({
    isOpen,
    onClose,
    onCreate,
    currentUser,
}) => {
    if (!isOpen) return null;

    const modalOverlayStyle: React.CSSProperties = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    };

    const modalContentStyle: React.CSSProperties = {
        background: "#fff",
        padding: 16,
        borderRadius: 8,
        width: 500,
        maxWidth: "90%",
        position: "relative",
    };

    const closeButtonStyle: React.CSSProperties = {
        position: "absolute",
        top: 8,
        right: 8,
        border: "none",
        background: "transparent",
        fontSize: 20,
        cursor: "pointer",
    };

    return (
        <div style={modalOverlayStyle} onClick={onClose}>
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} style={closeButtonStyle}>
                    ✕
                </button>
                <CreatePost onCreate={onCreate} currentUser={currentUser} />
            </div>
        </div>
    );
};
