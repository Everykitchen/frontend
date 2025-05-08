import styled from "styled-components";
import Sidebar from "../../components/UserSideBar";
import PendingReview from "../../components/review/ReviewPending";
import ReviewCard from "../../components/review/ReviewCard";
import ReviewModal from "../../components/review/ReviewModal";
import { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

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

const Section = styled.div`
    margin-bottom: 60px;
`;

const SectionTitle = styled.h3`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #444;
`;

const Reviews = () => {
    const [unwrittenReviews, setUnwrittenReviews] = useState([]);
    const [writtenReviews, setWrittenReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await api.get("/api/user/reviews");
                setUnwrittenReviews(response.data.unwrittenReviews);
                setWrittenReviews(response.data.writtenReviews);
            } catch (err) {
                console.error("리뷰 목록 불러오기 실패:", err);
            }
        };

        fetchReviews();
    }, []);

    // 미작성 후기 클릭 시
    const handleOpenModal = (item) => {
        setSelectedReview({
            id: item.reservationId,
            name: item.kitchenName,
            date: item.date,
            time: `${item.startTime} ~ ${item.endTime} (${item.clientNumber}인)`,
            image: item.kitchenImageUrl,
        });
        setShowModal(true);
    };

    // 후기 작성 제출
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedReview) return;

        try {
            await api.post(`/api/user/reviews/write/${selectedReview.id}`, {
                star: rating,
                review: content,
            });

            alert("후기가 성공적으로 제출되었습니다!");
            setRating(0);
            setContent("");
            setShowModal(false);

            // 후기 목록 최신화
            const response = await api.get("/api/user/reviews");
            setUnwrittenReviews(response.data.unwrittenReviews);
            setWrittenReviews(response.data.writtenReviews);
        } catch (error) {
            console.error("후기 작성 실패:", error);
            alert("후기 작성 중 문제가 발생했습니다.");
        }
    };

    return (
        <Container>
            <Sidebar />
            <Content>
                <Title>후기 관리</Title>

                <Section>
                    <SectionTitle>
                        미작성 후기 ({unwrittenReviews.length})
                    </SectionTitle>
                    {unwrittenReviews.map((item) => (
                        <div
                            key={item.reservationId}
                            onClick={() => handleOpenModal(item)}
                        >
                            <PendingReview
                                item={{
                                    id: item.reservationId,
                                    name: item.kitchenName,
                                    date: item.date,
                                    time: `${item.startTime} ~ ${item.endTime} (${item.clientNumber}인)`,
                                    dDay: item.daysLeft,
                                }}
                            />
                        </div>
                    ))}
                </Section>

                <Section>
                    <SectionTitle>
                        작성한 후기 ({writtenReviews.length})
                    </SectionTitle>
                    {writtenReviews.map((review) => (
                        <ReviewCard
                            key={review.reviewId}
                            review={{
                                id: review.reviewId,
                                name: review.kitchenName,
                                date: review.date,
                                time: `${review.startTime} ~ ${review.endTime} (${review.clientNumber}인)`,
                                rating: review.rating,
                                content: review.review,
                            }}
                        />
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

export default Reviews;
