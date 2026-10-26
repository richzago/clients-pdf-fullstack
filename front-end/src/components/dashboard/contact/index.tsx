import { useContext, useState } from "react";

import { AuthContext } from "../../../contexts/AuthContext";
import type { IContact } from "../../../interfaces/client";

import UpdateContactForm from "../../forms/updateContact";
import { Container, MainDiv } from "./style";

export const DashboardContact = () => {
  const { contacts, listContacts, deleteContact } = useContext(AuthContext);

  const [isListContactsShowing, setIsListContactsShowing] = useState(false);

  const [editingContact, setEditingContact] = useState<IContact | null>(null);

  const toggleListContacts = async () => {
    if (!isListContactsShowing) {
      await listContacts();
    }

    setIsListContactsShowing((previous) => !previous);
  };

  const handleEditClick = (contact: IContact) => {
    setEditingContact(contact);
  };

  const handleCloseModal = () => {
    setEditingContact(null);
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
          aria-expanded={isListContactsShowing}
        >
          Search Contacts!
        </button>
      </div>

      {isListContactsShowing && (
        <MainDiv>
          {contacts.length === 0 ? (
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
                      onClick={() => handleEditClick(contact)}
                    >
                      Edit Contact
                    </button>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => deleteContact(contact.id)}
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
        <div
          className="modal_1"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 100,
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
            <UpdateContactForm
              contact={editingContact}
              onClose={handleCloseModal}
              onUpdated={listContacts}
            />
          </div>
        </div>
      )}
    </Container>
  );
};
