import styled from "styled-components";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20vh;
`;

const UserTypeToggle = styled.div`
    display: flex;
    margin-bottom: 20px;
`;

const ToggleButton = styled.button`
    width: 170px;
    padding: 10px 20px;
    margin: 0px 10px;
    border: 1px solid #ffbc39;
    border-radius: 10px;
    background: none;
    color: #ffbc39;
    font-weight: bold;
    cursor: pointer;

    &.active {
        background-color: #ffbc39;
        color: white;
    }
`;

const LoginBox = styled.div`
    border: 1px solid #d9d9d9;
    padding: 20px 30px;
    border-radius: 15px;
`;

const LoginForm = styled.form`
    display: flex;
    flex-direction: column;
    width: 300px;
`;

const Label = styled.div`
    width: 120px;
    margin: 10px 0px;
`;

const Input = styled.input`
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #d9d9d9;
    border-radius: 10px;
`;

const LoginButton = styled.button`
    background-color: #ffbc39;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    margin: 5px 0px 20px;
`;

const LoginCheck = styled.span`
    color: red;
    font-size: 16px;
    text-align: center;
`;

const LoginLinks = styled.div`
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    width: 361px;
`;

const SetLink = styled(Link)`
    color: #868686;
    text-decoration: underline;
    padding: 0px 10px;

    &:hover {
        text-decoration: underline;
    }
`;

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post(`/user/${email}`, {
                email,
                password,
            });

            if (response.status === 200) {
                navigate("/main");
            }
        } catch (error) {
            if (
                error.response &&
                error.response.data &&
                error.response.data.result
            ) {
                const { resultCode, resultMessage } =
                    error.response.data.result;
                setError(resultMessage);
            } else {
                setError("서버 오류가 발생했습니다.");
            }
        }
    };

    return (
        <div>
            <LoginContainer>
                <UserTypeToggle>
                    <ToggleButton className="host-btn">HOST</ToggleButton>
                    <ToggleButton className="user-btn active">
                        USER
                    </ToggleButton>
                </UserTypeToggle>
                <LoginBox>
                    <LoginForm onSubmit={handleSubmit}>
                        <Label>이메일</Label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Label>비밀번호</Label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <LoginButton type="submit">Sign In</LoginButton>
                        {error && <LoginCheck>{error}</LoginCheck>}
                    </LoginForm>
                </LoginBox>
                <LoginLinks>
                    <SetLink to="/signup">회원가입</SetLink>
                    <SetLink to="/forgot-password">비밀번호 찾기</SetLink>
                </LoginLinks>
            </LoginContainer>
        </div>
    );
}

export default Login;
