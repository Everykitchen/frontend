import { useEffect, useState } from "react";
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
    th:nth-child(1) {
        width: 20%;
    }

    td:nth-child(2),
    td:nth-child(4) {
        width: 6%;
    }
    th:nth-child(3) {
        width: 40%;
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

const DeleteButton = styled.button`
    background: #e74c3c;
    color: white;
    border: none;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
`;

const Input = styled.input`
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
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
    const [facilityStates, setFacilityStates] = useState(
        formData.kitchenFacility.length > 0
            ? formData.kitchenFacility.map((f) => ({
                  facilityType: f.facilityType || f.facilityName || "",
                  count: f.count || f.amount || 1,
                  description: f.description || f.detail || "",
              }))
            : [
                  {
                      facilityType: "인덕션",
                      count: 1,
                      description: "예: SK매직 인덕션, 4구",
                  },
                  {
                      facilityType: "오븐",
                      count: 1,
                      description: "예: LG 오븐, 230도 가능",
                  },
                  {
                      facilityType: "조리대",
                      count: 1,
                      description: "예: 1800X900 조리대",
                  },
              ]
    );

    useEffect(() => {
        const facilitiesToSave = facilityStates
            .filter((f) => f.facilityType)
            .map((f) => ({
                facilityType: f.facilityType,
                count: f.count,
                description: f.description,
            }));
        setFormData((prev) => ({
            ...prev,
            kitchenFacility: facilitiesToSave,
        }));
    }, [facilityStates]);

    const handleInputChange = (index, field, value) => {
        const updated = [...facilityStates];
        updated[index][field] = field === "count" ? parseInt(value, 10) : value;
        setFacilityStates(updated);
    };

    const handleAddFacility = () => {
        setFacilityStates((prev) => [
            ...prev,
            { facilityType: "", count: 1, description: "" },
        ]);
    };

    const handleDeleteFacility = (index) => {
        const updated = [...facilityStates];
        updated.splice(index, 1);
        setFacilityStates(updated);
    };

    const syncFormData = () => {
        const facilitiesToSave = facilityStates
            .filter((f) => f.facilityType)
            .map((f) => ({
                facilityType: f.facilityType,
                count: f.count,
                description: f.description,
            }));
        setFormData((prev) => ({
            ...prev,
            kitchenFacility: facilitiesToSave,
        }));
    };

    return (
        <Container>
            <SectionTitle>
                보유하신 주방 설비에 대한 정보를 작성해주세요.
                <AddButton onClick={handleAddFacility}>+ 항목추가</AddButton>
            </SectionTitle>

            <Table>
                <thead>
                    <tr>
                        <th>종류</th>
                        <th>수량</th>
                        <th>상세 설명</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {facilityStates.map((facility, index) => (
                        <tr key={index}>
                            <td>
                                <Input
                                    type="text"
                                    value={facility.facilityType}
                                    onChange={(e) =>
                                        handleInputChange(
                                            index,
                                            "facilityType",
                                            e.target.value
                                        )
                                    }
                                />
                            </td>
                            <td>
                                <Input
                                    type="number"
                                    value={facility.count}
                                    onChange={(e) =>
                                        handleInputChange(
                                            index,
                                            "count",
                                            e.target.value
                                        )
                                    }
                                />
                            </td>
                            <td>
                                <Input
                                    type="text"
                                    value={facility.description}
                                    onChange={(e) =>
                                        handleInputChange(
                                            index,
                                            "description",
                                            e.target.value
                                        )
                                    }
                                />
                            </td>
                            <td>
                                <DeleteButton
                                    onClick={() => handleDeleteFacility(index)}
                                >
                                    삭제
                                </DeleteButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <ButtonContainer>
                <NavButton
                    onClick={() => {
                        syncFormData();
                        prevStep();
                    }}
                >
                    이전
                </NavButton>
                <NavButton
                    onClick={() => {
                        syncFormData();
                        nextStep();
                    }}
                >
                    다음
                </NavButton>
            </ButtonContainer>
        </Container>
    );
};

export default StepFacility;
