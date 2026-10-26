import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import api from "../../../services/api";

import type {
  IClientDataUpdate,
  IClientsList,
} from "../../../interfaces/client";

import { FormStyle } from "../updateShared/style";

interface UpdateClientFormProps {
  client: IClientsList;
  onClose: () => void;
  onUpdated: () => Promise<void>;
  onBusyChange?: (busy: boolean) => void;
}

type FormData = Pick<IClientsList, "name" | "email" | "telephone">;

const UpdateClientForm = ({
  client,
  onClose,
  onUpdated,
  onBusyChange,
}: UpdateClientFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { dirtyFields, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      name: client.name,
      email: client.email,
      telephone: client.telephone,
    },
  });

  useEffect(() => {
    onBusyChange?.(isSubmitting);
  }, [isSubmitting, onBusyChange]);

  const onSubmitFunction = async (data: FormData) => {
    const changes: IClientDataUpdate = {};

    // Nome: somente se foi modificado e não está vazio.
    if (dirtyFields.name) {
      const name = data.name.trim();

      if (name && name !== client.name) {
        changes.name = name;
      }
    }

    // Email: somente se foi modificado e não está vazio.
    if (dirtyFields.email) {
      const email = data.email.trim();

      if (email && email !== client.email) {
        changes.email = email;
      }
    }

    // Telefone: somente se foi modificado e não está vazio.
    if (dirtyFields.telephone) {
      const telephone = data.telephone.trim();

      if (telephone && telephone !== client.telephone) {
        changes.telephone = telephone;
      }
    }

    // Impede PATCH sem alterações válidas.
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
      await api.patch(`/clients/${client.id}`, changes, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await onUpdated();

      toast.success("Client updated successfully!");
      onClose();
    } catch (error) {
      console.error("Client update error:", error);
      toast.error("Failed to update client.");
    }
  };

  return (
    <FormStyle noValidate onSubmit={handleSubmit(onSubmitFunction)}>
      <div className="field">
        <label htmlFor="edit-client-name">Name</label>

        <input
          id="edit-client-name"
          type="text"
          placeholder="Name"
          {...register("name")}
        />
      </div>

      <div className="field">
        <label htmlFor="edit-client-email">Email</label>

        <input
          id="edit-client-email"
          type="email"
          placeholder="Email"
          {...register("email")}
        />
      </div>

      <div className="field">
        <label htmlFor="edit-client-phone">Phone</label>

        <input
          id="edit-client-phone"
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

export default UpdateClientForm;
