import styled from "styled-components";

const Card = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 16px;
    background-color: #fff;
`;

const TopInfo = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
`;

const Name = styled.div`
    font-size: 16px;
    font-weight: bold;
`;

const Date = styled.div`
    font-size: 14px;
    color: #888;
`;

const Stars = styled.div`
    color: #ffbc39;
    margin-bottom: 8px;
`;

const Content = styled.p`
    font-size: 14px;
    color: #333;
    line-height: 1.5;
`;

const ReviewCard = ({ review }) => {
    const renderStars = (count) => {
        return "★".repeat(count).padEnd(5, "☆");
    };

    return (
        <Card>
            <TopInfo>
                <Name>{review.name}</Name>
                <Date>
                    {review.date} {review.time}
                </Date>
            </TopInfo>
            <Stars>{renderStars(review.rating)}</Stars>
            <Content>{review.content}</Content>
        </Card>
    );
};

export default ReviewCard;
