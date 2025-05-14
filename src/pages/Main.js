import { useSearch } from "../contexts/SearchContext";
import { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import api from "../api/axiosInstance";
import StoreCard from "../components/StoreCard";
import { useNavigate } from "react-router-dom";
import defaultKitchenImage from "../assets/jpg/kitchen1.jpg";

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px;
`;

const StoreList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    justify-content: left;
    max-width: 1200px;
    margin-left: 168px;
`;

const LoadingIndicator = styled.div`
    text-align: center;
    padding: 20px;
    width: 100%;
    font-size: 16px;
    color: #666;
`;

const MainPage = () => {
    const [storeList, setStoreList] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();
    const navigate = useNavigate();

    // 마지막 요소 참조를 위한 콜백 함수
    const lastStoreElementRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prevPage) => prevPage + 1);
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    const fetchStores = async (pageNum = 0) => {
        try {
            setLoading(true);
            const response = await api.get("/api/common/kitchen", {
                params: {
                    location: "",
                    date: "",
                    count: "",
                    price: "",
                    page: pageNum,
                    size: 12,
                },
            });

            const kitchens = response.data?.content || [];

            const transformed = kitchens.map((kitchen) => ({
                id: kitchen.kitchenId ?? kitchen.id,
                imageUrl: kitchen.imageUrl || defaultKitchenImage, // import한 이미지 사용
                location: formatLocation(kitchen.location), // 주소 포맷 변경
                name: kitchen.kitchenName,
                price: kitchen.minPrice
                    ? `${kitchen.minPrice.toLocaleString()}원~`
                    : "가격 정보 없음",
                time: `${kitchen.minReservationTime}분`,
                tags: kitchen.category
                    ? [kitchen.category === "COOKING" ? "쿠킹" : "베이킹"]
                    : [],
                isLiked: kitchen.liked ?? false,
                review: kitchen.avgStar || 0,
                reviewCount: kitchen.reviewCount || 0,
            }));

            // 첫 페이지면 새로 설정, 아니면 기존 목록에 추가
            if (pageNum === 0) {
                setStoreList(transformed);
            } else {
                setStoreList((prev) => [...prev, ...transformed]);
            }

            // 더 불러올 데이터가 있는지 체크
            setHasMore(kitchens.length > 0 && !response.data.last);
        } catch (err) {
            console.error("주방 목록 불러오기 실패", err);
        } finally {
            setLoading(false);
        }
    };

    // 주소 형식 변경 함수
    const formatLocation = (location) => {
        if (!location) return "";

        // 공백으로 구분하여 앞의 두 부분만 사용 (예: "서울시 관악구")
        const parts = location.split(" ");
        if (parts.length >= 2) {
            return `${parts[0]} ${parts[1]}`;
        }
        return location;
    };

    const handleLikeToggle = async (id) => {
        try {
            await api.post(`/api/user/kitchen/${id}/likes`);
            // 찜 상태만 변경하고 전체 리스트를 다시 불러오지 않음
            setStoreList((prevList) =>
                prevList.map((store) =>
                    store.id === id
                        ? { ...store, isLiked: !store.isLiked }
                        : store
                )
            );
        } catch (err) {
            alert("찜 처리 실패");
        }
    };

    // 주방 카드 클릭 핸들러
    const handleStoreClick = (id) => {
        navigate(`/kitchen/${id}`);
    };

    useEffect(() => {
        fetchStores(page);
    }, [page]);

    return (
        <PageContainer>
            <StoreList>
                {storeList.map((store, index) => {
                    if (storeList.length === index + 1) {
                        // 마지막 요소에는 ref 전달
                        return (
                            <div key={store.id} ref={lastStoreElementRef}>
                                <StoreCard
                                    store={store}
                                    onLikeToggle={handleLikeToggle}
                                    onClick={() => handleStoreClick(store.id)}
                                />
                            </div>
                        );
                    } else {
                        return (
                            <StoreCard
                                key={store.id}
                                store={store}
                                onLikeToggle={handleLikeToggle}
                                onClick={() => handleStoreClick(store.id)}
                            />
                        );
                    }
                })}
            </StoreList>

            {loading && <LoadingIndicator>로딩 중...</LoadingIndicator>}
            {!hasMore && storeList.length > 0 && (
                <LoadingIndicator>더 이상 주방이 없습니다</LoadingIndicator>
            )}
        </PageContainer>
    );
};

export default MainPage;
