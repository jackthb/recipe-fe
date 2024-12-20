import styled from "styled-components";

export const Button = styled.button<{ variant?: 'primary' | 'danger' }>`
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
  background: ${props => 
    props.variant === 'danger' 
      ? '#dc3545' 
      : props.variant === 'primary' 
        ? '#007bff' 
        : '#6c757d'};
  color: white;
  
  &:hover {
    background: ${props => 
      props.variant === 'danger' 
        ? '#c82333' 
        : props.variant === 'primary' 
          ? '#0056b3' 
          : '#5a6268'};
  }
`;


export const CreateButton = styled(Button)`
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  
  &:hover {
    background: #218838;
  }
`;

export const RemoveButton = styled.button`
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  font-size: 20px;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  transition: scale 0.2s;

  &:hover {
    scale: 1.2;
    font-weight: bold;
  }
`;