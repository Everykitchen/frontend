import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import HostSideBar from "../../components/HostSideBar";
import { ReactComponent as EditIcon } from "../../assets/icons/edit.svg";
import { ReactComponent as TrashIcon } from "../../assets/icons/trash.svg";
import informationIcon from "../../assets/icons/information.png";

const Container = styled.div`
    display: flex;
    min-height: 100vh;
`;

const Content = styled.div`
    flex: 1;
    padding: 40px 80px;
    margin-top: 30px;
`;

const TitleWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
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
    border-bottom: 1px solid #eee;
    vertical-align: middle;
`;

const TableHeader = styled.th`
    padding: 12px;
    text-align: left;
    &.center {
        text-align: center;
    }
    font-size: 16px;
    font-weight: 600;
`;

const TableCell = styled.td`
    padding: 14px;
    font-size: 14px;
    font-weight: 500;
    color: #333;
    &.center {
        text-align: center;
        vertical-align: middle;
    }
`;

const IconButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    width: 18px;
    height: 18px;
    margin: 0 4px;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin-left: auto;
    margin-right: auto;
`;

const InfoIconButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin-left: auto;
    margin-right: auto;
`;

const InfoIconImg = styled.img`
    width: 16px;
    height: 16px;
`;

const KitchenManage = () => {
    const [kitchenList, setKitchenList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/api/host/my-kitchens")
            .then((res) => setKitchenList(res.data))
            .catch((err) => console.error("주방 목록 불러오기 실패", err));
    }, []);

    const handleEditClick = (kitchenId) => {
        const selectedKitchen = kitchenList.find(
            (kitchen) => kitchen.kitchenId === kitchenId
        );
        navigate("/host-mypage/kitchen-form", {
            state: { isEdit: true, editData: selectedKitchen },
        });
    };

    const handleDeleteClick = async (kitchenId) => {
        if (!window.confirm("정말 이 주방을 삭제하시겠습니까?")) return;

        try {
            await api.delete(`/api/host/kitchen/${kitchenId}`);
            setKitchenList((prev) =>
                prev.filter((k) => k.kitchenId !== kitchenId)
            );
        } catch (err) {
            console.error("주방 삭제 실패", err);
            alert("주방 삭제에 실패했습니다.");
        }
    };

    const handleDetailClick = (kitchenId) => {
        navigate(`/kitchen/${kitchenId}`);
    };

    return (
        <Container>
            <HostSideBar activeMenu="주방 관리" />
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
                            <TableHeader className="center">
                                리뷰(개)
                            </TableHeader>
                            <TableHeader className="center">
                                상세정보
                            </TableHeader>
                            <TableHeader className="center">수정</TableHeader>
                            <TableHeader className="center">삭제</TableHeader>
                        </TableRow>
                    </TableHead>
                    <tbody>
                        {kitchenList.map((kitchen) => (
                            <TableRow key={kitchen.id}>
                                <TableCell>{kitchen.kitchenName}</TableCell>
                                <TableCell>{kitchen.location}</TableCell>
                                <TableCell className="center">
                                    {kitchen.reviewCount}
                                </TableCell>
                                <TableCell className="center">
                                    <InfoIconButton
                                        onClick={() =>
                                            handleDetailClick(kitchen.kitchenId)
                                        }
                                    >
                                        <InfoIconImg
                                            src={informationIcon}
                                            alt="상세조회"
                                        />
                                    </InfoIconButton>
                                </TableCell>
                                <TableCell className="center">
                                    <IconButton
                                        onClick={() =>
                                            handleEditClick(kitchen.kitchenId)
                                        }
                                    >
                                        <EditIcon width={16} height={16} />
                                    </IconButton>
                                </TableCell>
                                <TableCell className="center">
                                    <IconButton
                                        onClick={() =>
                                            handleDeleteClick(kitchen.kitchenId)
                                        }
                                    >
                                        <TrashIcon width={16} height={16} />
                                    </IconButton>
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
