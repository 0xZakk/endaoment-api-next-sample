// Create a new DAF in Endaoment
// - multi-part form rendered for creating a new fund
import { CreateDafForm } from "@/components/forms/create-daf";
import { createDaf } from "@/utils/endaoment/actions";

export default function FundCreate() {
  return (
    <CreateDafForm action={createDaf} />
  );
}
