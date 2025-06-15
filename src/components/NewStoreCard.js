import styled from "styled-components";
import { FaRegHeart, FaHeart, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Card = styled.div`
    width: 300px; 
    border-radius: 13px;
    overflow: hidden;
    box-shadow: 0 0 13px rgba(0, 0, 0, 0.1);
    background: white;
    position: relative;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    &:hover {
        transform: translateY(-6px);
        box-shadow: 0 6px 19px rgba(0, 0, 0, 0.15);
    }
`;

const Image = styled.img`
    width: 100%;
    height: 200px;
    object-fit: cover;
`;

const LikeButton = styled.button`
    position: absolute;
    top: 13px;
    right: 13px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 27px; 
    color: #f0b52f;
    z-index: 2;
`;

const Info = styled.div`
    padding: 16px;
`;

const TopRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
`;

const Location = styled.div`
    font-weight: 400;
    font-size: 15px; 
    color: gray;
`;

const Rating = styled.div`
    font-size: 15px;
    color: #333;
    display: flex;
    align-items: center;
    gap: 5px;
    margin: 0;
`;

const StarIcon = styled(FaStar)`
    color: #ffc107;
    font-size: 18px; 
`;

const Title = styled.div`
    font-size: 18px; 
    font-weight: 700;
    margin: 6px 0;
`;

const Price = styled.div`
    font-weight: 500;
    font-size: 15px;
    color: #333;
    display: flex;
    align-items: center;
    gap: 4px;
`;

const TimeUnit = styled.span`
    color: #666;
    font-weight: 400;
`;

const Tags = styled.div`
    margin-top: 10px;
    display: flex;
    gap: 7px;
`;

const Tag = styled.span`
    font-weight: 400;
    font-size: 15px; 
    background-color: ${(props) => props.color || "#eee"};
    padding: 4px 7px;
    border-radius: 8px;
    color: white;
`;

const NewStoreCard = ({ store, onLikeToggle }) => {
    const navigate = useNavigate();

    if (!store?.id) {
        console.warn("StoreCard: store.id가 undefined입니다", store);
        return null;
    }

    const handleLikeToggle = (e) => {
        e.stopPropagation();
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
                    {store.price} <TimeUnit>/ {store.time}</TimeUnit>
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

export default NewStoreCard; 