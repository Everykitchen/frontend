import styled from "styled-components";

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 16px 20px;
    margin-bottom: 12px;
    background-color: #fff;
    cursor: pointer;
`;

const Info = styled.div`
    display: flex;
    flex-direction: column;
`;

const Name = styled.div`
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 6px;
`;

const Time = styled.div`
    font-size: 14px;
    color: #666;
`;

const Dday = styled.div`
    font-size: 14px;
    font-weight: bold;
    color: #ff6b00;
`;

const PendingReview = ({ item }) => {
    return (
        <Wrapper>
            <Info>
                <Name>{item.name}</Name>
                <Time>
                    {item.date} {item.time}
                </Time>
            </Info>
            <Dday>후기 작성({item.dDay}일 남음)</Dday>
        </Wrapper>
    );
};

export default PendingReview;
