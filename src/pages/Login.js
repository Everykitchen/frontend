import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import NavBar from "../components/NavBar";

const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 240px;
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
    border-radius: 15px;
    background: none;
    cursor: pointer;

    &.active {
        background-color: #ffbc39;
        color: white;
    }
`;

const LoginBox = styled.div`
    border: 1px solid #d9d9d9;
    padding: 30px;
    border-radius: 15px;
`;

const LoginForm = styled.form`
    display: flex;
    flex-direction: column;
    width: 300px;
`;

const Input = styled.input`
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #d9d9d9;
    border-radius: 15px;
`;

const LoginButton = styled.button`
    background-color: #ffbc39;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 15px;
    cursor: pointer;
`;

const LoginLinks = styled.div`
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    width: 361px;
`;

const SetColorLink = styled(Link)`
    color: #868686;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("로그인 시도:", email, password); // 나중에 백이랑 연결 필요
    };

    return (
        <div>
            <NavBar />
            <LoginContainer>
                <UserTypeToggle>
                    <ToggleButton className="host-btn">HOST</ToggleButton>
                    <ToggleButton className="user-btn active">
                        USER
                    </ToggleButton>
                </UserTypeToggle>
                <LoginBox>
                    <LoginForm onSubmit={handleSubmit}>
                        <Input
                            type="email"
                            placeholder="이메일"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <LoginButton type="submit">Sign In</LoginButton>
                    </LoginForm>
                </LoginBox>
                <LoginLinks>
                    <SetColorLink to="/signup">회원가입</SetColorLink>
                    <SetColorLink to="/forgot-password">
                        비밀번호를 잊으셨나요?
                    </SetColorLink>
                </LoginLinks>
            </LoginContainer>
        </div>
    );
}

export default Login;
