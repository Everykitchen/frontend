import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import FilterBar from "../components/FilterBar";
import StoreCard from "../components/StoreCard";

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

    const fetchStores = async (pageNum = 0) => {
        try {
            const response = await axios.get("/api/common/kitchen", {
                params: {
                    location: "",
                    date: "",
                    count: "",
                    price: "",
                    page: pageNum,
                    size: 10,
                },
            });

            const kitchens = response.data?.content || [];

            const transformed = kitchens.map((kitchen) => ({
                id: kitchen.id,
                imageUrl:
                    kitchen.image || "https://via.placeholder.com/240x160",
                location: kitchen.location || "위치 정보 없음",
                name: kitchen.kitchenName || "이름 없음",
                price: kitchen.defaultPrice
                    ? `${kitchen.defaultPrice.toLocaleString()}원~`
                    : "가격 정보 없음",
                time: "1시간", // API에서 제공되면 교체
                tags: kitchen.tag
                    ? [kitchen.tag === "KITCHEN" ? "쿠킹" : "베이킹"]
                    : [],
            }));

            setStoreList(transformed);
            setTotalPages(response.data.totalPages || 1);
        } catch (err) {
            console.error("주방 목록 불러오기 실패", err);
        }
    };

    useEffect(() => {
        fetchStores(page);
    }, [page]);

    return (
        <PageContainer>
            <FilterBar />
            <StoreList>
                {storeList.map((store) => (
                    <StoreCard key={store.id} store={store} />
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
