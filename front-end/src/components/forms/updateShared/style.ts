import styled from "styled-components";

export const FormStyle = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;

  .field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  label {
    color: #e2e8f0;
    font-size: 14px;
    font-weight: 500;
  }

  input {
    width: 100%;
    padding: 12px;

    background-color: #0f172a;
    color: #f8fafc;

    border: 1px solid #475569;
    border-radius: 6px;

    font-size: 15px;
  }

  input:focus-visible {
    outline: 2px solid #60a5fa;
    outline-offset: 2px;
  }

  .form-actions {
    display: flex;
    gap: 12px;
    margin-top: 8px;
  }

  .form-actions button {
    flex: 1;
    padding: 12px;

    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
  }

  .save-button {
    background-color: #2563eb;
    color: white;
    border: 1px solid #2563eb;
  }

  .save-button:hover {
    background-color: #1d4ed8;
  }

  .cancel-button {
    background-color: #1e293b;
    color: #f8fafc;
    border: 1px solid #475569;
  }

  .cancel-button:hover {
    background-color: #334155;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 400px) {
    .form-actions {
      flex-direction: column;
    }
  }
`;
