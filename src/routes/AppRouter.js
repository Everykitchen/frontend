import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import MyPage from "../pages/MyPage";
import { Reservations } from "../pages/mypage/index";
import KitchenDetailPage from "../pages/kitchenDetail/KitchenDetailPage";

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/mypage/reservations" element={<Reservations />} />
            <Route path="/kitchen-detail" element={<KitchenDetailPage />} />
        </Routes>
    );
};

export default AppRouter;
