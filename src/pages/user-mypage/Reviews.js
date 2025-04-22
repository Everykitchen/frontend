import styled from "styled-components";
import Sidebar from "../../components/UserSideBar";
import PendingReview from "../../components/review/PendingReview";
import ReviewCard from "../../components/review/ReviewCard";
import ReviewModal from "../../components/review/ReviewModal";
import { useState } from "react";

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
    border-bottom: 2px solid #ffbc39;
    padding-bottom: 8px;
`;

const Section = styled.div`
    margin-bottom: 60px;
`;

const SectionTitle = styled.h3`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #444;
`;

const ReviewPage = () => {
    const pendingReviews = [
        {
            id: 1,
            name: "파이브잇 쿠킹스튜디오",
            date: "2025.3.13",
            time: "15:00 ~ 17:00 (4인)",
            dDay: 5,
        },
    ];

    const writtenReviews = [
        {
            id: 1,
            name: "마이키친 렌탈스튜디오",
            date: "2025.2.5",
            time: "11:00 ~ 13:00 (2인)",
            rating: 5,
            content:
                "정말 친절하시고 스튜디오도 깔끔했어요! 다음에도 또 이용할게요.",
        },
    ];

    const [rating, setRating] = useState(0);
    const [content, setContent] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);

    const handleOpenModal = (item) => {
        setSelectedReview(item);
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`후기 제출됨! 별점: ${rating}, 내용: ${content}`);
        setRating(0);
        setContent("");
        setShowModal(false);
    };

    return (
        <Container>
            <Sidebar />
            <Content>
                <Title>후기 관리</Title>

                <Section>
                    <SectionTitle>
                        미작성 후기 ({pendingReviews.length})
                    </SectionTitle>
                    {pendingReviews.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleOpenModal(item)}
                        >
                            <PendingReview item={item} />
                        </div>
                    ))}
                </Section>

                <Section>
                    <SectionTitle>
                        작성한 후기 ({writtenReviews.length})
                    </SectionTitle>
                    {writtenReviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </Section>
            </Content>

            {showModal && (
                <ReviewModal
                    review={selectedReview}
                    rating={rating}
                    setRating={setRating}
                    content={content}
                    setContent={setContent}
                    handleSubmit={handleSubmit}
                    onClose={() => setShowModal(false)}
                />
            )}
        </Container>
    );
};

export default ReviewPage;
