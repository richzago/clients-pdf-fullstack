import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import api from "../../../services/api";

import { IContact, IContactDataUpdate } from "../../../interfaces/client";

interface UpdateContactFormProps {
  contact: IContact;
  onClose: () => void;
  onUpdated: () => Promise<void>;
}

type FormData = Pick<IContact, "name" | "email" | "telephone">;

const UpdateContactForm = ({
  contact,
  onClose,
  onUpdated,
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

  const onSubmitFunction = async (data: FormData) => {
    const changes: IContactDataUpdate = {};

    // Nome
    if (dirtyFields.name) {
      const name = data.name.trim();

      if (name && name !== contact.name) {
        changes.name = name;
      }
    }

    // Email
    if (dirtyFields.email) {
      const email = data.email.trim();

      if (email && email !== contact.email) {
        changes.email = email;
      }
    }

    // Telefone
    if (dirtyFields.telephone) {
      const telephone = data.telephone.trim();

      if (telephone && telephone !== contact.telephone) {
        changes.telephone = telephone;
      }
    }

    // Nenhuma alteração válida
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

      toast.success("Contact updated successfully!");

      await onUpdated();
      onClose();
    } catch (error) {
      console.error("Contact update error:", error);
      toast.error("Failed to update contact.");
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

export default UpdateContactForm;
