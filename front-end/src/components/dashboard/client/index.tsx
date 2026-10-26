import { useContext, useState } from "react";

import { Container, MainDiv } from "./style";
import ClientUpdateForm from "../../forms/updateClient";

import { AuthContext } from "../../../contexts/AuthContext";
import { IClientsList } from "../../../interfaces/client";

export const DashboardClient = () => {
  const { clients, listClients, deleteClient } = useContext(AuthContext);

  // Controla a exibição da lista de clientes
  const [isListClientsShowing, setIsListClientsShowing] = useState(false);

  // Armazena o cliente selecionado para edição
  const [editingClient, setEditingClient] = useState<IClientsList | null>(null);

  // Exibe ou oculta a lista
  const toggleListClients = async () => {
    if (!isListClientsShowing) {
      await listClients();
    }

    setIsListClientsShowing((previous) => !previous);
  };

  // Abre o modal com os dados do cliente selecionado
  const handleEditClick = (client: IClientsList) => {
    setEditingClient(client);
  };

  // Fecha o modal
  const handleCloseModal = () => {
    setEditingClient(null);
  };

  return (
    <Container>
      <MainDiv>
        <h3>Your information, Delete and Edit. Just click in Client!</h3>

        <button type="button" onClick={toggleListClients}>
          Client
        </button>

        {isListClientsShowing &&
          clients.map((client) => (
            <li key={client.id}>
              <p>Name: {client.name}</p>
              <p>Telephone: {client.telephone}</p>
              <p>E-mail: {client.email}</p>
              <p>Created at: {client.createdAt}</p>
              <p>Updated At: {client.updatedAt}</p>

              {client.contact && client.contact.length > 0 ? (
                <>
                  <p>Contacts:</p>

                  <ul>
                    {client.contact.map((contact) => (
                      <li key={contact.id}>
                        <p>Name: {contact.name}</p>
                        <p>E-mail: {contact.email}</p>
                        <p>Telephone: {contact.telephone}</p>
                        <p>Created at: {contact.createdAt}</p>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>Contact: This client doesn't have any contacts</p>
              )}

              <button type="button" onClick={() => deleteClient(client.id)}>
                Delete Client
              </button>

              <button type="button" onClick={() => handleEditClick(client)}>
                Edit Client
              </button>
            </li>
          ))}
      </MainDiv>

      {/* Modal de edição */}
      {editingClient && (
        <div
          className="modal_1"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div
            className="modal_2"
            style={{
              background: "white",
              padding: "20px",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <ClientUpdateForm
              client={editingClient}
              onClose={handleCloseModal}
              onUpdated={listClients}
            />
          </div>
        </div>
      )}
    </Container>
  );
};
