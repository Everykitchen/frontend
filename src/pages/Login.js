import styled from "styled-components";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

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

const LoginLinksSection = styled.div`
    width: 400px;
    margin: 10px;
    display: flex;
    justify-content: flex;
`;

const LinkGroup = styled.div`
    display: flex;
    gap: 10px;
    margin-left: 30px;
`;

const SetLink = styled(Link)`
    color: #868686;
    text-decoration: underline;
    padding: 3px 10px;
    font-size: 15px;
    &:first-child {
        margin-right: 60px;
    }
`;

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("USER");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("/api/auth/login", {
                email,
                password,
            });

            const { accessToken, refreshToken } = response.data;

            if (accessToken) {
                const decoded = jwtDecode(accessToken);
                const tokenRole = decoded?.role;

                if (tokenRole !== role) {
                    setError(
                        "선택한 로그인 유형과 계정 유형이 일치하지 않습니다."
                    );
                    return;
                }

                localStorage.setItem("token", accessToken);
                localStorage.setItem("refreshToken", refreshToken);
                localStorage.setItem("role", tokenRole);

                window.location.href =
                    tokenRole === "HOST" ? "/host-mypage" : "/";
            } else {
                setError("이메일 또는 비밀번호가 올바르지 않습니다.");
            }
        } catch (error) {
            setError("로그인 중 오류가 발생했습니다.");
        }
    };

    return (
        <div>
            <LoginContainer>
                <UserTypeToggle>
                    <ToggleButton
                        className={role === "HOST" ? "active" : ""}
                        onClick={() => setRole("HOST")}
                    >
                        HOST
                    </ToggleButton>
                    <ToggleButton
                        className={role === "USER" ? "active" : ""}
                        onClick={() => setRole("USER")}
                    >
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
                            autoComplete="current-password"
                        />
                        <LoginButton type="submit">Sign In</LoginButton>
                        {error && <LoginCheck>{error}</LoginCheck>}
                    </LoginForm>
                </LoginBox>

                <LoginLinksSection>
                    <LinkGroup>
                        <SetLink to="/signup">회원가입 </SetLink>
                        <SetLink to="/forgot-email">이메일 찾기</SetLink>
                        <SetLink to="/forgot-password">비밀번호 찾기</SetLink>
                    </LinkGroup>
                </LoginLinksSection>
            </LoginContainer>
        </div>
    );
}

export default Login;
