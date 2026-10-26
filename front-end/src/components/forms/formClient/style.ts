import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;

  width: 100%;
  padding: 48px 16px;
`;

export const FormStyle = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;

  width: 100%;
  max-width: 420px;
  padding: 32px;

  background-color: #111c31;
  border: 1px solid #334155;
  border-radius: 12px;

  h2 {
    margin: 0;
    color: #f8fafc;
    font-size: 26px;
  }

  .subtitle {
    margin: -12px 0 4px;
    color: #94a3b8;
    font-size: 14px;
  }

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

  input::placeholder {
    color: #94a3b8;
  }

  input:focus-visible {
    outline: 2px solid #60a5fa;
    outline-offset: 2px;
  }

  input[aria-invalid="true"] {
    border-color: #fca5a5;
  }

  .error {
    margin: 0;
    color: #fca5a5;
    font-size: 13px;
  }

  .submit-button,
  .back-button {
    width: 100%;
    padding: 12px;

    border-radius: 6px;
    font-size: 15px;
    font-weight: 600;

    cursor: pointer;
    transition: background-color 0.2s;
  }

  .submit-button {
    background-color: #2563eb;
    color: #ffffff;
    border: 1px solid #2563eb;
  }

  .submit-button:hover {
    background-color: #1d4ed8;
  }

  .back-button {
    background-color: transparent;
    color: #f8fafc;
    border: 1px solid #475569;
  }

  .back-button:hover {
    background-color: #1e293b;
  }

  .submit-button:focus-visible,
  .back-button:focus-visible {
    outline: 2px solid #60a5fa;
    outline-offset: 2px;
  }

  @media (max-width: 480px) {
    padding: 24px;

    h2 {
      font-size: 24px;
    }
  }
`;
