import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import HostSideBar from "../../components/HostSideBar";

const Container = styled.div`
    display: flex;
`;

const Content = styled.div`
    flex: 1;
    padding: 40px;
    margin-top: 30px;
`;

const TitleWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
`;

const Title = styled.h2`
    font-size: 24px;
    font-weight: bold;
`;

const RegisterButton = styled.button`
    background-color: #ffbc39;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 6px;
    padding: 8px 16px;
    cursor: pointer;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 16px;
`;

const TableHead = styled.thead`
    background-color: #f5f5f5;
`;

const TableRow = styled.tr`
    border-bottom: 1px solid #ddd;
`;

const TableHeader = styled.th`
    padding: 12px;
    text-align: left;
`;

const TableCell = styled.td`
    padding: 12px;
    font-size: 14px;
`;

const IconButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    margin: 0 4px;
`;

const KitchenManage = () => {
    const [kitchenList, setKitchenList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // axios.get("/api/kitchens").then((res) => setKitchenList(res.data));
        const dummyData = [
            {
                id: 1,
                name: "파이브잇 쿠킹스튜디오 홍대점",
                address: "경기도 용인시 홍대구 죽전로 152",
                review: "4.5 (1,230)",
            },
            {
                id: 2,
                name: "파이브잇 쿠킹스튜디오 강남점",
                address: "서울 강남구 테헤란로 100",
                review: "4.8 (980)",
            },
        ];
        setKitchenList(dummyData);
    }, []);

    const handleEditClick = (kitchenId) => {
        // axios.get(`/api/kitchen/${kitchenId}`).then((res) => {
        //     navigate("/host-mypage/kitchen-form", {
        //         state: { isEdit: true, editData: res.data },
        //     });
        // });

        const selectedKitchen = kitchenList.find(
            (kitchen) => kitchen.id === kitchenId
        );
        navigate("/host-mypage/kitchen-form", {
            state: { isEdit: true, editData: selectedKitchen },
        });
    };

    return (
        <Container>
            <HostSideBar />
            <Content>
                <TitleWrapper>
                    <Title>주방 관리</Title>
                    <RegisterButton
                        onClick={() => navigate("/host-mypage/kitchen-form")}
                    >
                        주방 등록
                    </RegisterButton>
                </TitleWrapper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeader>주방명</TableHeader>
                            <TableHeader>주소</TableHeader>
                            <TableHeader>리뷰(개)</TableHeader>
                            <TableHeader>수정</TableHeader>
                            <TableHeader>삭제</TableHeader>
                        </TableRow>
                    </TableHead>
                    <tbody>
                        {kitchenList.map((kitchen) => (
                            <TableRow key={kitchen.id}>
                                <TableCell>{kitchen.name}</TableCell>
                                <TableCell>{kitchen.address}</TableCell>
                                <TableCell>{kitchen.review}</TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() =>
                                            handleEditClick(kitchen.id)
                                        }
                                    >
                                        ✏️
                                    </IconButton>
                                </TableCell>
                                <TableCell>
                                    <IconButton>🗑️</IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </tbody>
                </Table>
            </Content>
        </Container>
    );
};

export default KitchenManage;
