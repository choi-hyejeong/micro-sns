import { useState, useRef, useCallback } from "react";

/**
 * 이미지 슬라이더 및 모달 기능을 처리하는 커스텀 훅
 * @param imageCount 이미지 개수
 * @returns 슬라이더/모달 상태, 핸들러 함수
 */
export function useImageSliderModal(imageCount: number) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sliderIndex, setSliderIndex] = useState(0);
    const [modalImageIndex, setModalImageIndex] = useState(0);

    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);

    /**
     * 모달 열고, 현재 슬라이더 인덱스로 모달 이미지 인덱스를 설정
     * @param index 현재 슬라이더 인덱스
     */
    const openModal = (index: number) => {
        setModalImageIndex(index);
        setIsModalOpen(true);
    };

    const prevSlide = useCallback(() => {
        setSliderIndex((prev) => (prev === 0 ? imageCount - 1 : prev - 1));
    }, [imageCount]);

    const nextSlide = useCallback(() => {
        setSliderIndex((prev) => (prev === imageCount - 1 ? 0 : prev + 1));
    }, [imageCount]);

    const modalPrevSlide = useCallback(() => {
        setModalImageIndex((prev) => (prev === 0 ? imageCount - 1 : prev - 1));
    }, [imageCount]);

    const modalNextSlide = useCallback(() => {
        setModalImageIndex((prev) => (prev === imageCount - 1 ? 0 : prev + 1));
    }, [imageCount]);

    const onTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.changedTouches[0].clientX;
    };

    const onTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.changedTouches[0].clientX;
    };

    const onTouchEnd = () => {
        if (touchStartX.current !== null && touchEndX.current !== null) {
            const deltaX = touchStartX.current - touchEndX.current;
            const threshold = 50; // 스와이프로 인정하는 최소 거리
            if (deltaX > threshold) nextSlide(); // 다음
            else if (deltaX < -threshold) prevSlide(); // 이전
        }
        touchStartX.current = null;
        touchEndX.current = null;
    };

    return {
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
    };
}
