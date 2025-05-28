import { Routes, Route, useLocation } from "react-router-dom";
import Main from "../pages/Main";
import Login from "../pages/Login";
import ForgotEmail from "../pages/ForgotEmail";
import ForgotPassword from "../pages/ForgotPassword";
import KitchenDetailPage from "../pages/kitchenDetail/KitchenDetailPage";
import SignupChoicePage from "../pages/signup/SignupChoicePage";
import UserSignupPage from "../pages/signup/UserSignupPage";
import UserSignupSuccess from "../pages/signup/UserSignupSuccess";
import HostSignupPage from "../pages/signup/HostSignupPage";
import HostSignupSuccess from "../pages/signup/HostSignupSuccess";
import HostReservations from "../pages/host-mypage/hostReservations";
import HostReservationDetail from "../pages/host-mypage/HostReservationDetail";
import HostSales from "../pages/host-mypage/HostSales";
import ChatHistory from "../pages/host-mypage/ChatHistory";
import ChattingRoom from "../pages/host-mypage/ChattingRoom";
import IngredientSettlement from "../pages/user-mypage/IngredientSettlement";

import ProtectedRoute from "./ProtectedRoute";
import {
    MyPage,
    Reservations,
    ReservationDetail,
    Reviews,
    Likes,
} from "../pages/user-mypage/MyPageIndex";
import UserChatHistory from "../pages/user-mypage/ChatHistory";
import UserChattingRoom from "../pages/user-mypage/ChattingRoom";

import {
    HostMyPage,
    KitchenManage,
} from "../pages/host-mypage/HostMyPageIndex";
import KitchenForm from "../pages/host-mypage/kitchen/KitchenForm";

import KitchenMap from "../pages/kitchenMap/KitchenMap";
import ReservationCalendar from "../pages/host-mypage/ReservationCalendar";

const AppRouter = () => {
    const location = useLocation();

    return (
        <Routes key={location.pathname} location={location}>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-email" element={<ForgotEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
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
            <Route path="/kitchen/:id" element={<KitchenDetailPage />} />
            <Route path="/map" element={<KitchenMap />} />
            <Route
                path="/mypage/ingredient-settlement/:id"
                element={
                    <ProtectedRoute allowedRole="USER">
                        <IngredientSettlement />
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

        </Routes>
    );
};

export default AppRouter;
