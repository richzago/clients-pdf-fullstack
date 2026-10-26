import { useContext, useState } from "react";

import { AuthContext } from "../../../contexts/AuthContext";
import { IContact } from "../../../interfaces/client";

import UpdateContactForm from "../../forms/updateContact";
import { Container, MainDiv } from "./style";

export const DashboardContact = () => {
  const { contacts, listContacts, deleteContact } = useContext(AuthContext);

  // Controla a exibição da lista de contatos
  const [isListContactsShowing, setIsListContactsShowing] = useState(false);

  // Armazena o contato selecionado para edição
  const [editingContact, setEditingContact] = useState<IContact | null>(null);

  // Exibe ou oculta a lista
  const toggleListContacts = async () => {
    if (!isListContactsShowing) {
      await listContacts();
    }

    setIsListContactsShowing((previous) => !previous);
  };

  // Abre o modal com os dados do contato selecionado
  const handleEditClick = (contact: IContact) => {
    setEditingContact(contact);
  };

  // Fecha o modal de edição
  const handleCloseModal = () => {
    setEditingContact(null);
  };

  return (
    <Container>
      <MainDiv>
        <h3>List Contacts, Delete and Edit. Just click in Search Contacts!</h3>

        <button type="button" onClick={toggleListContacts}>
          Search Contacts!
        </button>

        {isListContactsShowing &&
          (contacts.length === 0 ? (
            <p>There are no contacts to show</p>
          ) : (
            contacts.map((contact) => (
              <li key={contact.id}>
                <p>Name: {contact.name}</p>
                <p>Telephone: {contact.telephone}</p>
                <p>E-mail: {contact.email}</p>
                <p>Created at: {contact.createdAt}</p>
                <p>Updated at: {contact.updatedAt}</p>

                <button type="button" onClick={() => deleteContact(contact.id)}>
                  Delete Contact
                </button>

                <button type="button" onClick={() => handleEditClick(contact)}>
                  Edit Contact
                </button>
              </li>
            ))
          ))}
      </MainDiv>

      {/* Modal de edição */}
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
