import { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import { useSearch } from "../contexts/SearchContext";
import api from "../api/axiosInstance";
import NewStoreCard from "../components/NewStoreCard";
import defaultKitchenImage from "../assets/jpg/kitchen1.jpg";
import LoadingOverlay from "../components/LoadingOverlay";

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px;
    position: relative;
    min-height: 100vh;
    width: 100%;
`;

const Header = styled.div`
    width: 100%;
    max-width: 1200px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
`;

const Title = styled.h1`
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const SearchKeyword = styled.span`
    color: #FF7926;
    font-weight: bold;
`;

const ResultCount = styled.span`
    font-size: 16px;
    color: #666;
    margin-left: 8px;
`;

const StoreList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    justify-content: center;
    max-width: 1400px;
`;

const LoadingIndicator = styled.div`
    text-align: center;
    padding: 20px;
    width: 100%;
    font-size: 16px;
    color: #666;
    margin-bottom: 80px;
`;

const SearchResult = () => {
    const { searchKeyword } = useSearch();
    const [storeList, setStoreList] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [totalResults, setTotalResults] = useState(0);
    const searchKeywordRef = useRef(searchKeyword);

    const observer = useRef();

    const lastStoreElementRef = useCallback(
        (node) => {
            if (loading || isFetching) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore && !isFetching) {
                    setPage((prevPage) => prevPage + 1);
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, isFetching, hasMore]
    );

    const fetchStores = async (pageNum = 0) => {
        if (isFetching) return;

        try {
            setIsFetching(true);
            setLoading(true);

            const currentSearchKeyword = searchKeywordRef.current;
            const response = await api.get("/api/common/kitchen", {
                params: {
                    page: pageNum,
                    size: 50,
                },
            });

            const kitchens = response.data?.content || [];
            
            // 검색어로 필터링
            const filteredKitchens = kitchens.filter(kitchen => {
                if (!currentSearchKeyword) return true;
                
                const searchTerm = currentSearchKeyword.trim().toLowerCase();
                const kitchenName = String(kitchen.kitchenName || '').trim().toLowerCase();
                const location = String(kitchen.location || '').trim().toLowerCase();
                
                return kitchenName.includes(searchTerm) || location.includes(searchTerm);
            });

            const transformed = filteredKitchens.map((kitchen) => ({
                id: kitchen.kitchenId ?? kitchen.id,
                imageUrl: kitchen.imageUrl || defaultKitchenImage,
                location: formatLocation(kitchen.location),
                name: kitchen.kitchenName,
                price: kitchen.minPrice
                    ? `${kitchen.minPrice.toLocaleString()}원~`
                    : "가격 정보 없음",
                time: `${kitchen.minReservationTime}시간`,
                tags: kitchen.category
                    ? [kitchen.category === "COOKING" ? "쿠킹" : "베이킹"]
                    : [],
                isLiked: kitchen.liked ?? false,
                review: kitchen.avgStar || 0,
                reviewCount: kitchen.reviewCount || 0,
            }));

            if (pageNum === 0) {
                setStoreList(transformed);
            } else {
                setStoreList((prev) => [...prev, ...transformed]);
            }

            setTotalResults(filteredKitchens.length);
            setHasMore(filteredKitchens.length > 0 && !response.data.last);
        } catch (err) {
            console.error("주방 목록 불러오기 실패", err);
        } finally {
            setLoading(false);
            setTimeout(() => {
                setIsFetching(false);
            }, 500);
        }
    };

    // 검색어가 변경될 때마다 ref 업데이트
    useEffect(() => {
        searchKeywordRef.current = searchKeyword;
        setPage(0);
        setStoreList([]);
        setTotalResults(0);
        fetchStores(0);
    }, [searchKeyword]);

    useEffect(() => {
        if (page > 0) {
            fetchStores(page);
        }
    }, [page]);

    const formatLocation = (location) => {
        if (!location) return "";
        const parts = location.split(" ");
        if (parts.length >= 2) {
            return `${parts[0]} ${parts[1]}`;
        }
        return location;
    };

    const handleLikeToggle = async (id) => {
        try {
            await api.post(`/api/user/kitchen/${id}/likes`);
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

    return (
        <PageContainer>
            <Header>
                <Title>
                    <span>검색 결과</span>
                    {searchKeyword && (
                        <>
                            <span>:</span>
                            <SearchKeyword>"{searchKeyword}"</SearchKeyword>
                            <ResultCount>({totalResults}건)</ResultCount>
                        </>
                    )}
                </Title>
            </Header>

            <StoreList>
                {storeList.map((store, index) => {
                    const uniqueKey = `${store.id}-${index}`;
                    if (storeList.length === index + 1) {
                        return (
                            <div key={uniqueKey} ref={lastStoreElementRef}>
                                <NewStoreCard
                                    store={store}
                                    onLikeToggle={handleLikeToggle}
                                />
                            </div>
                        );
                    } else {
                        return (
                            <NewStoreCard
                                key={uniqueKey}
                                store={store}
                                onLikeToggle={handleLikeToggle}
                            />
                        );
                    }
                })}
            </StoreList>

            <LoadingOverlay show={loading} />

            {!loading && storeList.length === 0 && (
                <LoadingIndicator>
                    검색 결과가 없습니다
                </LoadingIndicator>
            )}

            {!hasMore && storeList.length > 0 && (
                <LoadingIndicator>더 이상 주방이 없습니다</LoadingIndicator>
            )}
        </PageContainer>
    );
};

export default SearchResult; 