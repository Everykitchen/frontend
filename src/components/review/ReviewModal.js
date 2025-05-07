import styled from "styled-components";

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
`;

const ModalContent = styled.div`
    background: white;
    padding: 50px 40px;
    border-radius: 16px;
    width: 460px;
    max-width: 90%;
    position: relative;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
`;

const CloseButton = styled.button`
    position: absolute;
    top: 20px;
    right: 20px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
`;

const Title = styled.h2`
    font-size: 26px;
    font-weight: 700;
    margin-bottom: 6px;
`;

const Subtitle = styled.p`
    font-size: 14px;
    color: #ff6b00;
    margin-bottom: 30px;
`;

const StudioName = styled.h3`
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 16px;
`;

const InfoSplitSection = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 30px;
`;

const Left = styled.div`
    flex: 1;
`;

const StudioImage = styled.img`
    width: 100%;
    height: 150px;
    object-fit: covr;
    border-radius: 10px;
`;

const Right = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: left;
`;

const StudioDate = styled.p`
    font-size: 14px;
    color: #666;
    margin-bottom: 12px;
    padding-left: 4px;
`;

const RatingNumber = styled.p`
    font-size: 22px;
    font-weight: 700;
    margin: 0 0 6px auto;
    padding-left: 4px;
`;

const Stars = styled.div`
    display: flex;
    justify-content: flex-left;
    gap: 6px;
`;

const Star = styled.span`
    font-size: 24px;
    color: ${(props) => (props.active ? "#ffbc39" : "#ccc")};
    cursor: pointer;
`;

const Label = styled.label`
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 8px;
    display: block;
`;

const TextArea = styled.textarea`
    width: 100%;
    height: 150px;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 12px;
    font-size: 14px;
    resize: none;
    margin-bottom: 24px;
    ::placeholder {
        color: #bbb;
    }
`;

const SubmitButton = styled.button`
    width: 100%;
    padding: 14px 0;
    font-size: 16px;
    font-weight: bold;
    background-color: #ffbc39;
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: background-color 0.2s;
    &:hover {
        background-color: #f0a500;
    }
`;

const ReviewModal = ({
    review,
    rating,
    setRating,
    content,
    setContent,
    handleSubmit,
    onClose,
}) => {
    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={onClose}>×</CloseButton>
                <Title>후기 작성</Title>
                <Subtitle>주방에 대한 별점과 후기를 남겨주세요.</Subtitle>

                <StudioName>{review?.name}</StudioName>

                <InfoSplitSection>
                    <Left>
                        <StudioImage
                            src={review?.image || "/default-kitchen.jpg"}
                            alt="studio"
                        />
                    </Left>
                    <Right>
                        <div>
                            <StudioDate>
                                {review?.date} <br />
                                {review?.time}
                            </StudioDate>
                            <RatingNumber>{rating}</RatingNumber>
                            <Stars>
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <Star
                                        key={num}
                                        active={num <= rating}
                                        onClick={() => setRating(num)}
                                    >
                                        ★
                                    </Star>
                                ))}
                            </Stars>
                        </div>
                    </Right>
                </InfoSplitSection>

                <Label>후기 작성</Label>
                <TextArea
                    placeholder="후기를 입력해주세요"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <SubmitButton onClick={handleSubmit}>작성 완료</SubmitButton>
            </ModalContent>
        </ModalOverlay>
    );
};

export default ReviewModal;
