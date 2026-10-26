import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-shrink: 0;

  button {
    padding: 10px 18px;

    background-color: #1e293b;
    color: #f8fafc;

    border: 1px solid #475569;
    border-radius: 6px;

    font-size: 14px;
    font-weight: 600;

    cursor: pointer;
    transition: background-color 0.2s;
  }

  button:hover {
    background-color: #334155;
  }

  button:focus-visible {
    outline: 2px solid #60a5fa;
    outline-offset: 2px;
  }
`;
