import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // 로그인 안 한 경우 로그인 페이지로 이동
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // 권한이 없는 사용자 타입이면 메인으로 보내기 (혹은 403 페이지)
    if (allowedRole && role !== allowedRole) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
