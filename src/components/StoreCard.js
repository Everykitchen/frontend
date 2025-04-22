import styled from "styled-components";

const Card = styled.div`
    width: 240px;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background: white;
`;

const Image = styled.img`
    width: 100%;
    height: 160px;
    object-fit: cover;
`;

const Info = styled.div`
    padding: 12px;
`;

const Location = styled.div`
    font-size: 12px;
    color: gray;
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

const StoreCard = ({ store }) => {
    return (
        <Card>
            <Image src={store.imageUrl} />
            <Info>
                <Location>{store.location}</Location>
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
