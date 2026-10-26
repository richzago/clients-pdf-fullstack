import styled from "styled-components";

export const Container = styled.header`
  width: 100%;
  padding: 16px 24px;

  background-color: #111c31;
  border-bottom: 1px solid #334155;

  .header-content {
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
  }

  h1 {
    margin: 0;

    color: #f8fafc;
    font-size: 22px;
    font-weight: 600;
  }

  p {
    margin: 4px 0 0;

    color: #94a3b8;
    font-size: 13px;
  }

  @media (max-width: 480px) {
    padding: 12px 16px;

    h1 {
      font-size: 20px;
    }
  }
`;
