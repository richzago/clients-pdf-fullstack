import { useContext, useState } from "react";

import { AuthContext } from "../../../contexts/AuthContext";
import type { IClientsList } from "../../../interfaces/client";

import UpdateClientForm from "../../forms/updateClient";
import Modal from "../../ui/Modal";

import { Container, MainDiv } from "./style";
import ConfirmDialog from "../../ui/Modal/ConfirmDialog";

export const DashboardClient = () => {
  const { clients, listClients, deleteClient } = useContext(AuthContext);

  const [isListClientsShowing, setIsListClientsShowing] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [editBusy, setEditBusy] = useState(false);

  const [editingClient, setEditingClient] = useState<IClientsList | null>(null);

  const [deletingClient, setDeletingClient] = useState<IClientsList | null>(
    null,
  );

  const toggleListClients = async () => {
    if (!isListClientsShowing) {
      setIsLoading(true);

      try {
        await listClients();
      } finally {
        setIsLoading(false);
      }
    }

    setIsListClientsShowing((previous) => !previous);
  };

  const handleCloseEdit = () => {
    setEditingClient(null);
    setEditBusy(false);
  };

  return (
    <Container aria-labelledby="client-title">
      <div className="section-header">
        <div>
          <h3 id="client-title">Your account</h3>

          <p className="description">View and manage your profile.</p>
        </div>

        <button
          type="button"
          className="toggle-button"
          onClick={toggleListClients}
          disabled={isLoading}
          aria-expanded={isListClientsShowing}
        >
          Client
        </button>
      </div>

      {isListClientsShowing && (
        <MainDiv>
          {clients.length === 0 ? (
            <p className="empty-state">No client information available.</p>
          ) : (
            <ul className="clients-list">
              {clients.map((client) => (
                <li key={client.id} className="client-card">
                  <h4>Name: {client.name}</h4>

                  <div className="client-info">
                    <p>E-mail: {client.email}</p>
                    <p>Telephone: {client.telephone}</p>

                    <p>Contacts linked: {client.contact?.length ?? 0}</p>
                  </div>

                  <div className="client-dates">
                    <p>Created at: {client.createdAt}</p>
                    <p>Updated at: {client.updatedAt}</p>
                  </div>

                  <div className="card-actions">
                    <button
                      type="button"
                      className="edit-button"
                      onClick={() => {
                        setEditBusy(false);
                        setEditingClient(client);
                      }}
                    >
                      Edit Client
                    </button>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => setDeletingClient(client)}
                    >
                      Delete Client
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </MainDiv>
      )}

      {editingClient && (
        <Modal
          title="Edit Client"
          onClose={() => {
            if (!editBusy) {
              handleCloseEdit();
            }
          }}
          busy={editBusy}
        >
          <UpdateClientForm
            client={editingClient}
            onClose={handleCloseEdit}
            onUpdated={listClients}
            onBusyChange={setEditBusy}
          />
        </Modal>
      )}

      {deletingClient && (
        <ConfirmDialog
          title="Delete Client?"
          itemName={deletingClient.name}
          confirmLabel="Confirm Delete Client"
          onClose={() => setDeletingClient(null)}
          onConfirm={() => deleteClient(deletingClient.id)}
        />
      )}
    </Container>
  );
};
