import styled, { css } from "styled-components";

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
    padding: 30px;
    border-radius: 12px;
    width: 500px;
    max-width: 90%;
    position: relative;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
`;

const ModalTitle = styled.h2`
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 6px;
`;

const ModalSub = styled.p`
    font-size: 14px;
    color: #ff6b00;
    margin-bottom: 20px;
`;

const StudioName = styled.h3`
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
`;

const TimeText = styled.p`
    font-size: 14px;
    margin-bottom: 8px;
`;

const Label = styled.label`
    font-size: 14px;
    font-weight: bold;
`;

const TextArea = styled.textarea`
    resize: none;
    height: 100px;
    padding: 10px;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 14px;
    width: 100%;
`;

const StarContainer = styled.div`
    display: flex;
    gap: 6px;
`;

const Star = styled.span`
    font-size: 24px;
    color: #ccc;
    cursor: pointer;

    ${(props) =>
        props.active &&
        css`
            color: #ffbc39;
        `}
`;

const SubmitButton = styled.button`
    margin-top: 16px;
    padding: 10px;
    background-color: #ffbc39;
    border: none;
    border-radius: 6px;
    color: white;
    font-weight: bold;
    cursor: pointer;
    font-size: 14px;
    width: 100%;
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
                <CloseButton onClick={onClose}>&times;</CloseButton>
                <ModalTitle>후기 작성</ModalTitle>
                <ModalSub>주방에 대한 별점과 후기를 남겨주세요.</ModalSub>
                <StudioName>{review?.name}</StudioName>
                <TimeText>
                    {review?.date} <br /> {review?.time}
                </TimeText>
                <p
                    style={{
                        fontWeight: "bold",
                        fontSize: "24px",
                        margin: "12px 0 6px",
                    }}
                >
                    {rating}
                </p>
                <StarContainer>
                    {[1, 2, 3, 4, 5].map((num) => (
                        <Star
                            key={num}
                            active={num <= rating}
                            onClick={() => setRating(num)}
                        >
                            ★
                        </Star>
                    ))}
                </StarContainer>
                <Label style={{ marginTop: "20px" }}>후기 작성</Label>
                <TextArea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="후기를 입력해주세요"
                />
                <SubmitButton onClick={handleSubmit}>작성 완료</SubmitButton>
            </ModalContent>
        </ModalOverlay>
    );
};

export default ReviewModal;
