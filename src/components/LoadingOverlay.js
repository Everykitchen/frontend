import styled from "styled-components";

const LoadingOverlayWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    opacity: ${({ $show }) => ($show ? 1 : 0)};
    visibility: ${({ $show }) => ($show ? 'visible' : 'hidden')};
    transition: opacity 0.3s, visibility 0.3s;
`;

const LoadingSpinner = styled.div`
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #FF7926;
    border-radius: 50%;
    animation: spin 1s linear infinite;

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

const LoadingOverlay = ({ show }) => {
    return (
        <LoadingOverlayWrapper $show={show}>
            <LoadingSpinner />
        </LoadingOverlayWrapper>
    );
};

export default LoadingOverlay; 