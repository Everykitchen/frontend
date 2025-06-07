import { Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// 공통 페이지
import Main from "../pages/Main";
import Login from "../pages/Login";
import ForgotEmail from "../pages/ForgotEmail";
import ForgotPassword from "../pages/ForgotPassword";
import SearchResult from "../pages/SearchResult";
import KitchenDetailPage from "../pages/kitchenDetail/KitchenDetailPage";
import KitchenMap from "../pages/kitchenMap/KitchenMap";

// 회원가입 관련
import {
    SignupChoicePage,
    UserSignupPage,
    UserSignupSuccess,
    HostSignupPage,
    HostSignupSuccess,
} from "../pages/signup/SignupIndex";

// 사용자 마이페이지
import {
    MyPage,
    Reservations,
    ReservationDetail,
    Reviews,
    Likes,
    IngredientSettlement,
    UserChatHistory,
    UserChattingRoom,
} from "../pages/user-mypage/MyPageIndex";

// 호스트 마이페이지
import {
    HostMyPage,
    KitchenManage,
    HostReservations,
    HostReservationDetail,
    ReservationCalendar,
    HostSales,
    ChatHistory,
    ChattingRoom,
    KitchenForm,
} from "../pages/host-mypage/HostMyPageIndex";

const AppRouter = () => {
    const location = useLocation();

    return (
        <Routes key={location.pathname} location={location}>
            {/* 공통 */}
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-email" element={<ForgotEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/search" element={<SearchResult />} />
            <Route path="/kitchen/:id" element={<KitchenDetailPage />} />
            <Route path="/map" element={<KitchenMap />} />

            {/* 회원가입 */}
            <Route path="/signup" element={<SignupChoicePage />} />
            <Route path="/signup/user" element={<UserSignupPage />} />
            <Route
                path="/signup/user/success"
                element={<UserSignupSuccess />}
            />
            <Route path="/signup/host" element={<HostSignupPage />} />
            <Route
                path="/signup/host/success"
                element={<HostSignupSuccess />}
            />

            {/* 사용자 마이페이지 */}
            <Route
                path="/mypage"
                element={
                    <ProtectedRoute allowedRole="USER">
                        <MyPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/mypage/reservations"
                element={
                    <ProtectedRoute allowedRole="USER">
                        <Reservations />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/mypage/reservations/:id"
                element={
                    <ProtectedRoute allowedRole="USER">
                        <ReservationDetail />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/mypage/chats"
                element={
                    <ProtectedRoute allowedRole="USER">
                        <UserChatHistory />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/mypage/chats/:id"
                element={
                    <ProtectedRoute allowedRole="USER">
                        <UserChattingRoom />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/mypage/reviews"
                element={
                    <ProtectedRoute allowedRole="USER">
                        <Reviews />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/mypage/likes"
                element={
                    <ProtectedRoute allowedRole="USER">
                        <Likes />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/mypage/ingredient-settlement/:id"
                element={
                    <ProtectedRoute allowedRole="USER">
                        <IngredientSettlement />
                    </ProtectedRoute>
                }
            />

            {/* 호스트 마이페이지 */}
            <Route
                path="/host-mypage"
                element={
                    <ProtectedRoute allowedRole="HOST">
                        <HostMyPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/host-mypage/kitchen-management"
                element={
                    <ProtectedRoute allowedRole="HOST">
                        <KitchenManage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/host-mypage/kitchen-form"
                element={
                    <ProtectedRoute allowedRole="HOST">
                        <KitchenForm />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/host-mypage/kitchen-form/:kitchenId"
                element={
                    <ProtectedRoute allowedRole="HOST">
                        <KitchenForm />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/host-mypage/reservations"
                element={
                    <ProtectedRoute allowedRole="HOST">
                        <HostReservations />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/host-mypage/reservations/:reservationId"
                element={
                    <ProtectedRoute allowedRole="HOST">
                        <HostReservationDetail />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/host-mypage/reservations/calendar"
                element={
                    <ProtectedRoute allowedRole="HOST">
                        <ReservationCalendar />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/host-mypage/sales"
                element={
                    <ProtectedRoute allowedRole="HOST">
                        <HostSales />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/host-mypage/chats"
                element={
                    <ProtectedRoute allowedRole="HOST">
                        <ChatHistory />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/host-mypage/chats/:id"
                element={
                    <ProtectedRoute allowedRole="HOST">
                        <ChattingRoom />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

export default AppRouter;
