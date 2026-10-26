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
    gap: 16px;
  }

  h3 {
    margin: 0;
    color: #f8fafc;
    font-size: 22px;
  }

  .section-header p {
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

    .toggle-button {
      width: 100%;
    }
  }
`;

export const MainDiv = styled.div`
  margin-top: 20px;
  min-width: 0;

  .contacts-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr));

    align-content: start;
    gap: 12px;

    max-height: 520px;
    overflow-y: auto;

    margin: 0;
    padding: 4px 8px 4px 0;
    list-style: none;
  }

  .contact-card {
    display: flex;
    flex-direction: column;
    gap: 12px;

    min-width: 0;
    padding: 16px;

    background-color: #0f172a;
    border: 1px solid #334155;
    border-radius: 8px;
  }

  .contact-card h4 {
    margin: 0;

    color: #f8fafc;
    font-size: 16px;
    overflow-wrap: anywhere;
  }

  .contact-info p {
    margin: 4px 0;

    color: #e2e8f0;
    font-size: 13px;
    overflow-wrap: anywhere;
  }

  .contact-dates p {
    margin: 4px 0;

    color: #94a3b8;
    font-size: 11px;
    overflow-wrap: anywhere;
  }

  .card-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: auto;
  }

  .card-actions button {
    flex: 1;
    padding: 9px 12px;

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

  .card-actions button:focus-visible {
    outline: 2px solid #60a5fa;
    outline-offset: 2px;
  }

  .empty-state {
    padding: 24px;
    text-align: center;
    color: #94a3b8;
  }
`;
