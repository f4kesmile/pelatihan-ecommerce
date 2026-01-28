import { getStoreConfig } from "@/server/actions/store.actions";
import { RegisterForm } from "@/components/features/auth/register-form";

export default async function RegisterPage() {
  const config = await getStoreConfig();
  const storeName = config?.storeName || "E-COMMERCE";

  return <RegisterForm storeName={storeName} />;
}
