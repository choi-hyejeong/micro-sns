import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

dayjs.extend(relativeTime);
dayjs.locale("ko");

export const fromNow = (createdAt: string | Date, nowTimestamp?: number): string => {
    const createdDate = new Date(createdAt);
    const now = nowTimestamp ? new Date(nowTimestamp) : new Date();
    const diffInSeconds = Math.floor((now.getTime() - createdDate.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return "방금 전";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes}분 전`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours}시간 전`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays}일 전`;
    }

    // 날짜 포맷 (7일 이상)
    const year = createdDate.getFullYear();
    const month = createdDate.getMonth() + 1;
    const date = createdDate.getDate();

    if (year === now.getFullYear()) {
        return `${month}월 ${date}일`;
    } else {
        return `${year}년 ${month}월 ${date}일`;
    }
};
