import { useEffect, useState } from "react";
import styled from "styled-components";
import api from "../api/axiosInstance";
import StoreCard from "../components/StoreCard";
import FilterBar from "../components/FilterBar";

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

const PaginationContainer = styled.div`
    margin: 32px 0;
    display: flex;
    gap: 12px;
`;

const PageButton = styled.button`
    padding: 8px 16px;
    border: 1px solid #ccc;
    border-radius: 6px;
    background-color: ${({ active }) => (active ? "#ffbc39" : "white")};
    color: ${({ active }) => (active ? "white" : "#333")};
    font-weight: bold;
    cursor: pointer;
`;

const MainPage = () => {
    const [storeList, setStoreList] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        location: "",
        count: 1,
        price: 50000,
    });

    const fetchStores = async (pageNum = 0) => {
        try {
            const response = await api.get("/api/common/kitchen", {
                params: {
                    location: filters.location || "",
                    count: filters.count || "",
                    price: filters.price || "",
                    page: pageNum,
                    size: 10,
                },
            });

            const kitchens = response.data?.content || [];

            const transformed = kitchens.map((kitchen) => ({
                id: kitchen.kitchenId ?? kitchen.id,
                imageUrl:
                    kitchen.imageUrl || "https://via.placeholder.com/240x160",
                location: kitchen.location,
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

            setStoreList(transformed);
            setTotalPages(response.data.totalPages || 1);
        } catch (err) {
            console.error("주방 목록 불러오기 실패", err);
        }
    };

    const handleLikeToggle = async (id) => {
        try {
            await api.post(`/api/user/kitchen/${id}/likes`);
            await fetchStores(page); // 전체 데이터 재요청
        } catch (err) {
            alert("찜 처리 실패");
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setPage(0); // 필터 변경 시 1페이지부터
    };

    useEffect(() => {
        fetchStores(page);
    }, [page, filters]);

    return (
        <PageContainer>
            <FilterBar onFilterChange={handleFilterChange} />
            <StoreList>
                {storeList.map((store) => (
                    <StoreCard
                        key={store.id}
                        store={store}
                        onLikeToggle={handleLikeToggle}
                    />
                ))}
            </StoreList>

            <PaginationContainer>
                {[...Array(totalPages)].map((_, i) => (
                    <PageButton
                        key={i}
                        active={i === page}
                        onClick={() => setPage(i)}
                    >
                        {i + 1}
                    </PageButton>
                ))}
            </PaginationContainer>
        </PageContainer>
    );
};

export default MainPage;
