import React from "react";
import "./Loader.css";

/**
 * 게시물 목록의 로딩 상태를 시각적으로 보여주는 스켈레톤(Skeleton) 로더
 * @param count 렌더링할 스켈레톤 카드의 개수 (기본값: 3)
 */
export const Loader: React.FC<{ count?: number }> = ({ count = 3 }) => {
    return (
        <div style={{ display: "grid", gap: 12 }}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} style={s.card}>
                    <div style={s.header}>
                        <div style={s.avatar} className="skeleton shimmer" />
                        <div style={{ flex: 1 }}>
                            <div
                                style={{
                                    ...s.lineShort,
                                    width: `${50 + Math.random() * 30}%`,
                                }}
                                className="skeleton shimmer"
                            />
                            <div
                                style={{
                                    ...s.lineShort,
                                    width: `${30 + Math.random() * 50}%`,
                                    marginTop: 8,
                                }}
                                className="skeleton shimmer"
                            />
                        </div>
                    </div>
                    <div
                        style={{
                            ...s.lineLong,
                            marginTop: 12,
                            width: `${70 + Math.random() * 30}%`,
                        }}
                        className="skeleton shimmer"
                    />
                    <div
                        style={{
                            ...s.lineLong,
                            marginTop: 8,
                            width: `${60 + Math.random() * 40}%`,
                        }}
                        className="skeleton shimmer"
                    />
                </div>
            ))}
        </div>
    );
};

const s: { [k: string]: React.CSSProperties } = {
    card: {
        border: "1px solid #eee",
        padding: 16,
        borderRadius: 10,
        background: "#fafafa",
    },
    header: { display: "flex", gap: 10, alignItems: "center" },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: "#e0e0e0",
    },
    lineShort: {
        height: 10,
        borderRadius: 6,
        background: "#e0e0e0",
    },
    lineLong: {
        height: 12,
        borderRadius: 6,
        background: "#e0e0e0",
    },
};

export default Loader;
