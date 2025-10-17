import React from "react";

const urlRegex = /(https?:\/\/[^\s]+)/;
const hashtagRegex = /#[\w가-힣]+/;

/**
 * 게시물 내용을 파싱하여 URL과 해시태그에 스타일링된 React 엘리먼트를 반환
 * @param text 게시물 내용 문자열
 * @returns 파싱된 내용이 담긴 React 노드 배열
 */
export function parseContent(text: string): React.ReactNode[] {
    const parts = text.split(/(\s+)/);

    return parts.map((part, i) => {
        if (!part) {
            return <React.Fragment key={i}></React.Fragment>;
        }

        // URL 체크
        if (urlRegex.test(part)) {
            return (
                <a
                    key={i}
                    href={part.startsWith('http') ? part : `http://${part}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-style"
                >
                    {part}
                </a>
            );
        }

        // 해시태그 체크
        if (hashtagRegex.test(part)) {
            return (
                <span key={i} className="hashtag-style">
                    {part}
                </span>
            );
        }

        // 일반 텍스트 처리
        return <span key={i}>{part}</span>;
    });
}
