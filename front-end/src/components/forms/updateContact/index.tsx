import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import api from "../../../services/api";

import type { IContact, IContactDataUpdate } from "../../../interfaces/client";

import { FormStyle } from "../updateShared/style";

interface UpdateContactFormProps {
  contact: IContact;
  onClose: () => void;
  onUpdated: () => Promise<void>;
  onBusyChange?: (busy: boolean) => void;
}

type FormData = Pick<IContact, "name" | "email" | "telephone">;

const UpdateContactForm = ({
  contact,
  onClose,
  onUpdated,
  onBusyChange,
}: UpdateContactFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { dirtyFields, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      name: contact.name,
      email: contact.email,
      telephone: contact.telephone,
    },
  });

  // Informa ao modal quando existe uma atualização em andamento.
  useEffect(() => {
    onBusyChange?.(isSubmitting);
  }, [isSubmitting, onBusyChange]);

  const onSubmitFunction = async (data: FormData) => {
    const changes: IContactDataUpdate = {};

    // Somente o nome modificado e não vazio.
    if (dirtyFields.name) {
      const name = data.name.trim();

      if (name && name !== contact.name) {
        changes.name = name;
      }
    }

    // Somente o email modificado e não vazio.
    if (dirtyFields.email) {
      const email = data.email.trim();

      if (email && email !== contact.email) {
        changes.email = email;
      }
    }

    // Somente o telefone modificado e não vazio.
    if (dirtyFields.telephone) {
      const telephone = data.telephone.trim();

      if (telephone && telephone !== contact.telephone) {
        changes.telephone = telephone;
      }
    }

    if (Object.keys(changes).length === 0) {
      toast("No valid changes to save");
      return;
    }

    const token = localStorage.getItem("@TOKEN");

    if (!token) {
      toast.error("Session expired. Please log in again.");
      return;
    }

    try {
      await api.patch(`/contacts/${contact.id}`, changes, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await onUpdated();

      toast.success("Contact updated successfully!");
      onClose();
    } catch (error) {
      console.error("Contact update error:", error);
      toast.error("Failed to update contact.");
    }
  };

  return (
    <FormStyle noValidate onSubmit={handleSubmit(onSubmitFunction)}>
      <div className="field">
        <label htmlFor="edit-contact-name">Name</label>

        <input
          id="edit-contact-name"
          type="text"
          placeholder="Name"
          {...register("name")}
        />
      </div>

      <div className="field">
        <label htmlFor="edit-contact-email">Email</label>

        <input
          id="edit-contact-email"
          type="email"
          placeholder="Email"
          {...register("email")}
        />
      </div>

      <div className="field">
        <label htmlFor="edit-contact-phone">Phone</label>

        <input
          id="edit-contact-phone"
          type="tel"
          placeholder="Phone"
          {...register("telephone")}
        />
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="cancel-button"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </button>

        <button type="submit" className="save-button" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update"}
        </button>
      </div>
    </FormStyle>
  );
};

export default UpdateContactForm;
