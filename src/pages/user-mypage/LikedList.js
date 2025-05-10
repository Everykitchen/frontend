import styled from "styled-components";
import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import Sidebar from "../../components/UserSideBar";
import StoreCard from "../../components/StoreCard";

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

    const fetchLikedKitchens = async () => {
        try {
            const response = await api.get("/api/user/like-kitchens");
            const kitchens = response.data.contents?.[0]?.myLikes || [];

            const transformed = kitchens.map((kitchen) => ({
                id: kitchen.kitchenId,
                imageUrl: kitchen.imageUrl,
                location: kitchen.location,
                name: kitchen.kitchenName,
                price: `${kitchen.minPrice.toLocaleString()}원~`,
                time: `${kitchen.minReservationTime}시간`,
                tags: [kitchen.category], // 카테고리를 태그로 사용
                isLiked: true,
                review: kitchen.avgStar,
                reviewCount: kitchen.reviewCount,
            }));

            setLikedStores(transformed);
        } catch (err) {
            console.error("찜 목록 불러오기 실패", err);
        }
    };

    useEffect(() => {
        fetchLikedKitchens();
    }, []);

    return (
        <Container>
            <Sidebar />
            <Content>
                <Title>찜 목록</Title>
                <Grid>
                    {likedStores.map((store) => (
                        <StoreCard key={store.id} store={store} />
                    ))}
                </Grid>
            </Content>
        </Container>
    );
};

export default LikedList;
