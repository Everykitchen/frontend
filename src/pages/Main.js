import { useSearch } from "../contexts/SearchContext";
import { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import api from "../api/axiosInstance";
import StoreCard from "../components/StoreCard";
import { useNavigate } from "react-router-dom";
import defaultKitchenImage from "../assets/jpg/kitchen1.jpg";
import NewFilterBar from "../components/NewFilterBar";
import FilterBar from "../components/FilterBar";

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px;
    position: relative;
    min-height: 100vh;
    width: 100%;
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
    margin-bottom: 80px;
`;


// StoreList와 정렬 드롭다운을 한 줄에 배치하는 RowSection
const RowSection = styled.div`
    width: 100%;
    max-width: 1200px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 16px;
`;

// 커스텀 드롭다운 스타일
const DropdownWrapper = styled.div`
    position: relative;
    width: 160px;
    font-size: 14px;
`;
const DropdownButton = styled.button`
    width: 100%;
    height: 32px;
    background: #fff;
    border: 1px solid #ffa500;
    border-radius: 6px;
    padding: 0 12px;
    text-align: left;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #222;
    font-size: 14px;
    &:focus {
        outline: 2px solid #ffa500;
    }
`;
const DropdownList = styled.ul`
    position: absolute;
    top: 38px;
    left: 0;
    width: 100%;
    background: #fff;
    border: 1px solid #ffa500;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    z-index: 20;
    margin: 0;
    padding: 0;
    list-style: none;
`;
const DropdownItem = styled.li`
    padding: 10px 14px;
    cursor: pointer;
    color: ${({ selected }) => (selected ? "#ffa500" : "#222")};
    background: ${({ selected }) => (selected ? "#fff8e1" : "#fff")};
    font-weight: ${({ selected }) => (selected ? 700 : 400)};
    &:hover {
        background: #fff3d1;
        color: #ffa500;
    }
`;

const MainPage = () => {
    const [storeList, setStoreList] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [filters, setFilters] = useState({
        location: "",
        date: null,
        count: null,
        price: null,
        facilities: [],
    });
    const { count, price, date, facilities } = filters;
    const { location: selectedLocation } = filters;
    const [isFetching, setIsFetching] = useState(false);
    const [sortOrder, setSortOrder] = useState('');

    const observer = useRef();
    const navigate = useNavigate();

    const sortOptions = [
        { value: '', label: '정렬 선택' },
        { value: 'asc', label: '낮은 가격순' },
        { value: 'desc', label: '높은 가격순' },
        { value: 'review', label: '후기많은순' },
    ];
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef();

    // 드롭다운 외부 클릭 시 닫기
    useEffect(() => {
        const handleClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        if (dropdownOpen) document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [dropdownOpen]);

    // 마지막 요소 참조를 위한 콜백 함수
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

            const response = await api.get("/api/common/kitchen", {
                params: {
                    location: selectedLocation || "",
                    count: count || null,
                    price: price || null,
                    availableDate: date
                        ? new Date(date).toISOString().split("T")[0]
                        : null,
                    facilities:
                        facilities.length > 0 ? facilities.join(",") : null,
                    page: pageNum,
                    size: 12,
                },
            });

            console.log("필터 요청 파라미터:", {
                selectedLocation,
                count,
                price,
                availableDate: date
                    ? new Date(date).toISOString().split("T")[0]
                    : null,
                facilities: facilities.join(","),
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
            setTimeout(() => {
                setIsFetching(false);
            }, 1000);
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

    useEffect(() => {
        setPage(0);
        fetchStores(0, true); // 필터 바뀌면 새로 요청
    }, [filters]);

    const handleFilterChange = (newFilters) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    };

    const handleSortSelect = (value) => {
        setSortOrder(value);
        setDropdownOpen(false);
        if (!value) {
            // 정렬 선택(초기화) 시 원래대로 fetch
            setPage(0);
            fetchStores(0);
            return;
        }
        setStoreList((prevList) => {
            const sorted = [...prevList].sort((a, b) => {
                const priceA = parseInt(a.price.replace(/[^0-9]/g, '')) || 0;
                const priceB = parseInt(b.price.replace(/[^0-9]/g, '')) || 0;
                if (value === 'asc') return priceA - priceB;
                if (value === 'desc') return priceB - priceA;
                if (value === 'review') return (b.reviewCount || 0) - (a.reviewCount || 0);
                return 0;
            });
            return sorted;
        });
    };

    // 필터/페이지 변경 시 정렬 초기화
    useEffect(() => {
        setSortOrder('');
    }, [filters, page]);

    return (
        <PageContainer>
            <NewFilterBar onFilterChange={handleFilterChange} />
            {/* <FilterBar onFilterChange={handleFilterChange} /> */}
            <RowSection>
                <div />
                <DropdownWrapper ref={dropdownRef}>
                    <DropdownButton onClick={() => setDropdownOpen((v) => !v)}>
                        {sortOptions.find(opt => opt.value === sortOrder)?.label || '정렬 선택'}
                        <span style={{ fontSize: 16, marginLeft: 8 }}>{dropdownOpen ? '▲' : '▼'}</span>
                    </DropdownButton>
                    {dropdownOpen && (
                        <DropdownList>
                            {sortOptions.map(opt => (
                                <DropdownItem
                                    key={opt.value}
                                    selected={sortOrder === opt.value}
                                    onClick={() => handleSortSelect(opt.value)}
                                >
                                    {opt.label}
                                </DropdownItem>
                            ))}
                        </DropdownList>
                    )}
                </DropdownWrapper>
            </RowSection>
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
