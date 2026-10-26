import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import api from "../../../services/api";

import { IClientDataUpdate, IClientsList } from "../../../interfaces/client";

interface UpdateClientFormProps {
  client: IClientsList;
  onClose: () => void;
  onUpdated: () => Promise<void>;
}

type FormData = Pick<IClientsList, "name" | "email" | "telephone">;

const UpdateClientForm = ({
  client,
  onClose,
  onUpdated,
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

  const onSubmitFunction = async (data: FormData) => {
    const changes: IClientDataUpdate = {};

    // Atualiza somente o nome modificado e não vazio
    if (dirtyFields.name) {
      const name = data.name.trim();

      if (name && name !== client.name) {
        changes.name = name;
      }
    }

    // Atualiza somente o email modificado e não vazio
    if (dirtyFields.email) {
      const email = data.email.trim();

      if (email && email !== client.email) {
        changes.email = email;
      }
    }

    // Atualiza somente o telefone modificado e não vazio
    if (dirtyFields.telephone) {
      const telephone = data.telephone.trim();

      if (telephone && telephone !== client.telephone) {
        changes.telephone = telephone;
      }
    }

    // Impede PATCH sem alterações válidas
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

      toast.success("Client updated successfully!");

      await onUpdated();
      onClose();
    } catch (error) {
      console.error("Client update error:", error);
      toast.error("Failed to update client.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitFunction)}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "5px",
      }}
    >
      <input type="text" placeholder="Name" {...register("name")} />

      <input type="email" placeholder="Email" {...register("email")} />

      <input type="text" placeholder="Phone" {...register("telephone")} />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Updating..." : "Update"}
      </button>

      <button
        type="button"
        className="x"
        onClick={onClose}
        style={{
          position: "absolute",
          right: "-15px",
          top: "-18px",
          height: "15px",
          borderRadius: "15px",
          fontSize: "10px",
        }}
      >
        X
      </button>
    </form>
  );
};

export default UpdateClientForm;
