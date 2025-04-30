import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedType }) => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");

    // 로그인 안 한 경우 로그인 페이지로 이동
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // 권한이 없는 사용자 타입이면 메인으로 보내기 (혹은 403 페이지)
    if (allowedType && userType !== allowedType) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
