import { useContext, useEffect, useRef, useState } from "react";

import { AuthContext } from "../../../contexts/AuthContext";
import type { IContact } from "../../../interfaces/client";

import UpdateContactForm from "../../forms/updateContact";
import Modal from "../../ui/Modal";
import ConfirmDialog from "../../ui/Modal/ConfirmDialog";

import { Container, MainDiv } from "./style";

interface DashboardContactProps {
  autoLoad?: boolean;
}

export const DashboardContact = ({
  autoLoad = false,
}: DashboardContactProps) => {
  const { contacts, listContacts, deleteContact } = useContext(AuthContext);

  // No dashboard, a lista pode começar aberta.
  const [isListContactsShowing, setIsListContactsShowing] = useState(autoLoad);

  const [isLoading, setIsLoading] = useState(autoLoad);

  // Evita executar a busca inicial repetidamente.
  const initialLoadStarted = useRef(false);

  const [editBusy, setEditBusy] = useState(false);

  const [editingContact, setEditingContact] = useState<IContact | null>(null);

  const [deletingContact, setDeletingContact] = useState<IContact | null>(null);

  // Busca inicial dos contatos.
  useEffect(() => {
    if (!autoLoad || initialLoadStarted.current) {
      return;
    }

    initialLoadStarted.current = true;

    void listContacts().finally(() => {
      setIsLoading(false);
    });
  }, [autoLoad, listContacts]);

  // Mantém o botão de abrir e fechar a lista.
  const toggleListContacts = async () => {
    if (!isListContactsShowing) {
      setIsLoading(true);

      try {
        await listContacts();
      } finally {
        setIsLoading(false);
      }
    }

    setIsListContactsShowing((previous) => !previous);
  };

  const handleCloseEdit = () => {
    setEditingContact(null);
    setEditBusy(false);
  };

  return (
    <Container aria-labelledby="contacts-title">
      <div className="section-header">
        <div>
          <h3 id="contacts-title">Contacts</h3>

          <p>View, edit and manage your contacts.</p>
        </div>

        <button
          type="button"
          className="toggle-button"
          onClick={toggleListContacts}
          disabled={isLoading}
          aria-expanded={isListContactsShowing}
          aria-controls="contacts-panel"
        >
          Search Contacts!
        </button>
      </div>

      {isListContactsShowing && (
        <MainDiv id="contacts-panel">
          {isLoading ? (
            <p className="empty-state" role="status">
              Loading contacts...
            </p>
          ) : contacts.length === 0 ? (
            <p className="empty-state">There are no contacts to show</p>
          ) : (
            <ul className="contacts-list" aria-label="Contacts list">
              {contacts.map((contact) => (
                <li key={contact.id} className="contact-card">
                  <h4>Name: {contact.name}</h4>

                  <div className="contact-info">
                    <p>Telephone: {contact.telephone}</p>
                    <p>E-mail: {contact.email}</p>
                  </div>

                  <div className="contact-dates">
                    <p>Created at: {contact.createdAt}</p>
                    <p>Updated at: {contact.updatedAt}</p>
                  </div>

                  <div className="card-actions">
                    <button
                      type="button"
                      className="edit-button"
                      onClick={() => {
                        setEditBusy(false);
                        setEditingContact(contact);
                      }}
                    >
                      Edit Contact
                    </button>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => setDeletingContact(contact)}
                    >
                      Delete Contact
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </MainDiv>
      )}

      {editingContact && (
        <Modal
          title="Edit Contact"
          onClose={() => {
            if (!editBusy) {
              handleCloseEdit();
            }
          }}
          busy={editBusy}
        >
          <UpdateContactForm
            contact={editingContact}
            onClose={handleCloseEdit}
            onUpdated={listContacts}
            onBusyChange={setEditBusy}
          />
        </Modal>
      )}

      {deletingContact && (
        <ConfirmDialog
          title="Delete Contact?"
          itemName={deletingContact.name}
          confirmLabel="Confirm Delete Contact"
          onClose={() => setDeletingContact(null)}
          onConfirm={() => deleteContact(deletingContact.id)}
        />
      )}
    </Container>
  );
};
