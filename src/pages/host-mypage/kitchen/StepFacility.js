import styled from "styled-components";

const Container = styled.div`
    padding: 40px;
    max-width: 900px;
    margin: 0 auto;
`;

const SectionTitle = styled.h3`
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 16px;
    padding-bottom: 6px;
    border-bottom: 2px solid #f0ad4e;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;

    th,
    td {
        border: 1px solid #eee;
        padding: 12px 8px;
        text-align: center;
    }

    th {
        background-color: #fdfaf5;
        font-size: 14px;
        font-weight: 600;
    }
`;

const AddButton = styled.button`
    background: #ffbc39;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    float: right;
`;

const Input = styled.input`
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 30px;
`;

const NavButton = styled.button`
    background-color: #ffbc39;
    color: white;
    border: none;
    padding: 10px 24px;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
`;

const StepFacility = ({ formData, setFormData, nextStep, prevStep }) => {
    const facilities = [
        { type: "인덕션", quantity: 2, detail: "길이 1.5m" },
        { type: "오븐", quantity: 2, detail: "2단 오븐, 230도 설정 가능" },
        { type: "조리대", quantity: 2, detail: "길이 1.5m" },
    ];

    return (
        <Container>
            <SectionTitle>
                보유하신 주방 설비에 대한 정보를 작성해주세요.
                <AddButton>+ 항목추가</AddButton>
            </SectionTitle>

            <Table>
                <thead>
                    <tr>
                        <th>종류</th>
                        <th>보유 여부</th>
                        <th>수량</th>
                        <th>상세 설명</th>
                    </tr>
                </thead>
                <tbody>
                    {facilities.map((facility, index) => (
                        <tr key={index}>
                            <td>{facility.type}</td>
                            <td>
                                <input type="checkbox" />
                            </td>
                            <td>
                                <Input
                                    type="number"
                                    value={facility.quantity}
                                />
                            </td>
                            <td>
                                <Input
                                    type="text"
                                    defaultValue={facility.detail}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <ButtonContainer>
                <NavButton onClick={prevStep}>이전</NavButton>
                <NavButton onClick={nextStep}>다음</NavButton>
            </ButtonContainer>
        </Container>
    );
};

export default StepFacility;
