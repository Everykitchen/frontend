import styled from "styled-components";
import { FaRegHeart, FaHeart, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Card = styled.div`
    width: 240px;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background: white;
    position: relative;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
    }
    cursor: pointer;
`;

const Image = styled.img`
    width: 100%;
    height: 160px;
    object-fit: cover;
`;

const LikeButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 20px;
    color: #f0b52f;
    z-index: 2;
`;

const Info = styled.div`
    padding: 12px;
`;

const TopRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
`;

const Location = styled.div`
    font-size: 12px;
    color: gray;
`;

const Rating = styled.div`
    font-size: 12px;
    color: #333;
    display: flex;
    align-items: center;
    gap: 4px;
    margin: 0;
`;

const StarIcon = styled(FaStar)`
    color: #ffc107;
    font-size: 14px;
`;

const Title = styled.div`
    font-size: 14px;
    font-weight: bold;
    margin: 4px 0;
`;

const Price = styled.div`
    font-size: 12px;
    color: #333;
`;

const Tags = styled.div`
    margin-top: 8px;
    display: flex;
    gap: 6px;
`;

const Tag = styled.span`
    font-size: 11px;
    background-color: ${(props) => props.color || "#eee"};
    padding: 2px 6px;
    border-radius: 6px;
    color: white;
`;

const StoreCard = ({ store, onLikeToggle }) => {
    const navigate = useNavigate();

    if (!store?.id) {
        console.warn("StoreCard: store.id가 undefined입니다", store);
        return null;
    }

    const handleLikeToggle = (e) => {
        e.stopPropagation(); // 카드 클릭 이벤트 버블링 방지
        onLikeToggle?.(store.id);
    };

    const handleCardClick = () => {
        navigate(`/kitchen/${store.id}`);
    };

    return (
        <Card onClick={handleCardClick}>
            <Image
                src={store.imageUrl || "https://via.placeholder.com/240x160"}
            />
            <LikeButton onClick={handleLikeToggle}>
                {store.isLiked ? <FaHeart /> : <FaRegHeart />}
            </LikeButton>

            <Info>
                <TopRow>
                    <Location>{store.location}</Location>
                    <Rating>
                        <StarIcon />
                        {store.review || 0} ({store.reviewCount || 0})
                    </Rating>
                </TopRow>

                <Title>{store.name}</Title>
                <Price>
                    {store.price} / {store.time}
                </Price>

                <Tags>
                    {store.tags.map((tag, idx) => (
                        <Tag
                            key={idx}
                            color={tag === "쿠킹" ? "#4CAF50" : "#FF9800"}
                        >
                            {tag}
                        </Tag>
                    ))}
                </Tags>
            </Info>
        </Card>
    );
};

export default StoreCard;
