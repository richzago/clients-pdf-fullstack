import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 16px;
  background-color: rgba(0, 0, 0, 0.7);
`;

export const DialogBox = styled.div`
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;

  padding: 24px;

  background-color: #111c31;
  color: #f8fafc;

  border: 1px solid #334155;
  border-radius: 12px;

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;

    margin-bottom: 24px;
  }

  h2 {
    margin: 0;
    font-size: 22px;
  }

  .modal-close {
    width: 32px;
    height: 32px;

    background: transparent;
    color: #94a3b8;

    border: none;
    border-radius: 6px;
    font-size: 24px;
    cursor: pointer;
  }

  .modal-close:hover {
    background-color: #1e293b;
    color: white;
  }

  button:focus-visible {
    outline: 2px solid #60a5fa;
    outline-offset: 2px;
  }

  .confirm-copy {
    margin: 0 0 20px;
    color: #cbd5e1;
    line-height: 1.6;
    overflow-wrap: anywhere;
  }

  .confirm-error {
    color: #fca5a5;
    font-size: 13px;
  }

  .dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }

  .dialog-actions button {
    padding: 10px 16px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
  }

  .cancel-button {
    background-color: #1e293b;
    color: #f8fafc;
    border: 1px solid #475569;
  }

  .danger-button {
    background-color: #b91c1c;
    color: #ffffff;
    border: 1px solid #b91c1c;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    padding: 20px;

    h2 {
      font-size: 20px;
    }

    .dialog-actions {
      flex-direction: column;
    }
  }
`;
