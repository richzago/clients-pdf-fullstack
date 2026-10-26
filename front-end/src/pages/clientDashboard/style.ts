import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
`;

export const Main = styled.main`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px 48px;

  @media (max-width: 600px) {
    padding: 24px 16px;
  }
`;

export const PageTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  margin-bottom: 24px;

  h2 {
    margin: 0;
    color: #f8fafc;
    font-size: 28px;
  }

  p {
    margin: 4px 0 0;
    color: #94a3b8;
    font-size: 14px;
  }

  @media (max-width: 600px) {
    align-items: flex-start;

    h2 {
      font-size: 24px;
    }
  }
`;

export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
  gap: 24px;
  align-items: start;

  .sidebar,
  .content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-width: 0;
  }

  @media (max-width: 850px) {
    grid-template-columns: 1fr;
  }
`;
