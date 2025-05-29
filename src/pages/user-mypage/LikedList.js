import styled from "styled-components";
import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import Sidebar from "../../components/UserSideBar";
import StoreCard from "../../components/StoreCard";

/**
 * 사용자가 찜한 주방 목록을 보여주는 페이지 컴포넌트
 * 
 * 주요 기능:
 * - 사용자가 찜한 주방 목록을 그리드 형태로 표시
 * - 찜 해제 기능
 * - 각 주방 카드를 통해 상세 정보 접근
 */

const Container = styled.div`
    display: flex;
    min-height: 100vh;
`;

const Content = styled.div`
    flex: 1;
    padding: 40px;
    margin-top: 30px;
`;

const Title = styled.h2`
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 40px;
    color: #222;
    padding-bottom: 8px;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 24px;
`;

const LikedList = () => {
    const [likedStores, setLikedStores] = useState([]);

    /**
     * 카테고리를 한글로 변환
     * @param {string} category 영문 카테고리
     * @returns {string} 한글 카테고리
     */
    const convertCategoryToKorean = (category) => {
        switch (category?.toUpperCase()) {
            case 'COOKING':
                return '쿠킹';
            case 'BAKING':
                return '베이킹';
            default:
                return category;
        }
    };

    /**
     * 주소를 간략하게 표시 (앞 두 단어만)
     * @param {string} location 전체 주소
     * @returns {string} 축약된 주소
     */
    const formatLocation = (location) => {
        if (!location) return "";
        const words = location.split(" ");
        return words.slice(0, 2).join(" ");
    };

    const fetchLikedKitchens = async () => {
        try {
            const response = await api.get("/api/user/like-kitchens");
            const contents = response.data?.contents?.[0]?.myLikes || [];

            const transformed = contents.map((kitchen) => ({
                id: kitchen.kitchenId,
                imageUrl: kitchen.imageUrl,
                location: formatLocation(kitchen.location),
                name: kitchen.kitchenName,
                price: kitchen.minPrice
                    ? `${kitchen.minPrice.toLocaleString()}원~`
                    : "가격 정보 없음",
                time: `${kitchen.minReservationTime}분`,
                tags: kitchen.category ? [convertCategoryToKorean(kitchen.category)] : [],
                isLiked: true,
                review: kitchen.avgStar,
                reviewCount: kitchen.reviewCount,
            }));

            setLikedStores(transformed);
        } catch (err) {
            console.error("찜 목록 불러오기 실패", err);
        }
    };

    const handleLikeToggle = async (id) => {
        try {
            const res = await api.post(`/api/user/kitchen/${id}/likes`);
            const confirmedLiked = res.data.liked;
            if (!confirmedLiked) {
                setLikedStores((prev) =>
                    prev.filter((store) => store.id !== id)
                );
            }
        } catch (err) {
            alert("찜 처리 실패");
        }
    };

    useEffect(() => {
        fetchLikedKitchens();
    }, []);

    return (
        <Container>
            <Sidebar activeMenu="찜 목록" />
            <Content>
                <Title>찜 목록</Title>
                <Grid>
                    {likedStores.map((store) => (
                        <StoreCard
                            key={`${store.id}-${store.isLiked}`}
                            store={store}
                            onLikeToggle={handleLikeToggle}
                        />
                    ))}
                </Grid>
            </Content>
        </Container>
    );
};

export default LikedList;
