import styled from "styled-components";

const Button = styled.button`
  background-color: #ffbc39;
  color: white;
  padding: 8px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s;
  width: ${(props) => props.fullwidth ? "100%" : "auto"};

  &:hover {
    background-color: #e6a82f;
  }

  &:disabled {
    background-color: #ffd98b;
    cursor: not-allowed;
  }
`;

export default Button;
