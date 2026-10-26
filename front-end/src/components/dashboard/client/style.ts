import styled from "styled-components";

export const Container = styled.section`
  width: 100%;
  min-width: 0;
  padding: 24px;

  background-color: #111c31;
  border: 1px solid #334155;
  border-radius: 12px;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;

    margin-bottom: 20px;
  }

  h3 {
    margin: 0;
    color: #f8fafc;
    font-size: 22px;
  }

  .description {
    margin: 6px 0 0;
    color: #94a3b8;
    font-size: 14px;
  }

  .toggle-button {
    padding: 10px 16px;

    background-color: #2563eb;
    color: white;

    border: none;
    border-radius: 6px;

    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }

  .toggle-button:hover {
    background-color: #1d4ed8;
  }

  button:focus-visible {
    outline: 2px solid #60a5fa;
    outline-offset: 2px;
  }

  @media (max-width: 600px) {
    padding: 16px;
  }
`;

export const MainDiv = styled.div`
  .clients-list {
    display: flex;
    flex-direction: column;
    gap: 12px;

    max-height: 460px;
    overflow-y: auto;

    margin: 0;
    padding: 0 4px 0 0;
    list-style: none;
  }

  .client-card {
    padding: 16px;

    background-color: #0f172a;
    border: 1px solid #334155;
    border-radius: 8px;
  }

  h4 {
    margin: 0 0 12px;
    color: #f8fafc;
    font-size: 17px;
    overflow-wrap: anywhere;
  }

  .client-info {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .client-info p {
    margin: 0;
    color: #cbd5e1;
    font-size: 13px;
    overflow-wrap: anywhere;
  }

  .client-dates {
    margin-top: 16px;
  }

  .client-dates p {
    margin: 4px 0;
    color: #94a3b8;
    font-size: 11px;
  }

  .card-actions {
    display: flex;
    gap: 8px;
    margin-top: 20px;
  }

  .card-actions button {
    flex: 1;
    padding: 10px 12px;

    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
  }

  .edit-button {
    background-color: #1e3a5f;
    color: #bfdbfe;
    border: 1px solid #2563eb;
  }

  .edit-button:hover {
    background-color: #1e40af;
    color: white;
  }

  .delete-button {
    background-color: #3b1f2b;
    color: #fca5a5;
    border: 1px solid #7f1d1d;
  }

  .delete-button:hover {
    background-color: #7f1d1d;
    color: white;
  }

  .empty-state {
    color: #94a3b8;
    font-size: 14px;
  }

  @media (max-width: 400px) {
    .card-actions {
      flex-direction: column;
    }
  }
`;
