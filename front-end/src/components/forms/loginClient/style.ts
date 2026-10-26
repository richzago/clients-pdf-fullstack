import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;

  width: 100%;
  padding: 64px 16px;
`;

export const FormLogin = styled.form`
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

  input:focus-visible {
    outline: 2px solid #60a5fa;
    outline-offset: 2px;
  }

  .password-field {
    position: relative;
  }

  .password-field input {
    padding-right: 48px;
  }

  .password-toggle {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);

    display: flex;
    align-items: center;
    justify-content: center;

    width: 32px;
    height: 32px;
    padding: 0;

    background: transparent;
    color: #94a3b8;

    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .password-toggle:hover {
    color: #f8fafc;
  }

  .password-toggle:focus-visible {
    outline: 2px solid #60a5fa;
  }

  .password-toggle svg {
    width: 20px;
    height: 20px;
  }

  .submit-button,
  .register-button {
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

  .register-button {
    background-color: transparent;
    color: #f8fafc;
    border: 1px solid #475569;
  }

  .register-button:hover {
    background-color: #1e293b;
  }

  .submit-button:focus-visible,
  .register-button:focus-visible {
    outline: 2px solid #60a5fa;
    outline-offset: 2px;
  }

  .register-text {
    margin: 0;
    color: #94a3b8;
    font-size: 14px;
    text-align: center;
  }

  .error {
    margin: 0;
    color: #fca5a5;
    font-size: 13px;
  }

  @media (max-width: 480px) {
    padding: 24px;

    h2 {
      font-size: 24px;
    }
  }
`;
