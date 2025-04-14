import FilterBar from "../components/FilterBar";
import StoreCard from "../components/StoreCard";
import styled from "styled-components";

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

const MainPage = () => {
    const storeList = [
        {
            id: 1,
            imageUrl: "https://via.placeholder.com/240x160",
            location: "서울 은평구",
            name: "파이브잇 쿠킹스튜디오",
            price: "10,000원~",
            time: "1시간 (2시간부터)",
            tags: ["베이킹", "쿠킹"],
        },
        {
            id: 2,
            imageUrl: "https://via.placeholder.com/240x160",
            location: "서울 마포구",
            name: "요리공간 오늘의식탁",
            price: "15,000원~",
            time: "1시간 (1시간부터)",
            tags: ["쿠킹"],
        },
        {
            id: 3,
            imageUrl: "https://via.placeholder.com/240x160",
            location: "서울 강남구",
            name: "달달쿠킹랩",
            price: "12,000원~",
            time: "1시간 (2시간부터)",
            tags: ["베이킹"],
        },
        {
            id: 4,
            imageUrl: "https://via.placeholder.com/240x160",
            location: "서울 종로구",
            name: "마이키친",
            price: "11,000원~",
            time: "1시간 (1시간부터)",
            tags: ["쿠킹"],
        },
        {
            id: 5,
            imageUrl: "https://via.placeholder.com/240x160",
            location: "서울 종로구",
            name: "마이키친",
            price: "11,000원~",
            time: "1시간 (1시간부터)",
            tags: ["쿠킹"],
        },
        {
            id: 6,
            imageUrl: "https://via.placeholder.com/240x160",
            location: "서울 종로구",
            name: "마이키친",
            price: "11,000원~",
            time: "1시간 (1시간부터)",
            tags: ["쿠킹"],
        },
        {
            id: 7,
            imageUrl: "https://via.placeholder.com/240x160",
            location: "서울 종로구",
            name: "마이키친",
            price: "11,000원~",
            time: "1시간 (1시간부터)",
            tags: ["쿠킹"],
        },
    ];

    return (
        <PageContainer>
            <FilterBar />
            <StoreList>
                {storeList.map((store) => (
                    <StoreCard key={store.id} store={store} />
                ))}
            </StoreList>
        </PageContainer>
    );
};

export default MainPage;
