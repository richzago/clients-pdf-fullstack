import { DashboardClient } from "../../components/dashboard/client";
import { DashboardContact } from "../../components/dashboard/contact";
import LogoutClient from "../../components/dashboard/logout/logout";
import FormContactRegister from "../../components/forms/formContact";
import { Header } from "../../components/header";

import { Container, Main, PageTop, DashboardGrid } from "./style";

const ClientDashboardPage = () => {
  return (
    <Container>
      <Header />

      <Main>
        <PageTop>
          <div>
            <h2>Dashboard</h2>
            <p>Manage your account and contacts in one place.</p>
          </div>

          <LogoutClient />
        </PageTop>

        <DashboardGrid>
          <div className="sidebar">
            <FormContactRegister />
            <DashboardClient />
          </div>

          <div className="content">
            <DashboardContact autoLoad />
          </div>
        </DashboardGrid>
      </Main>
    </Container>
  );
};

export default ClientDashboardPage;
