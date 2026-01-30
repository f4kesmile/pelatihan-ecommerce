import { getStoreConfig } from "@/server/actions/store.actions";
import { LoginForm } from "@/components/features/auth/login-form";

export default async function LoginPage() {
  const config = await getStoreConfig();
  const storeName = config?.storeName || "E-COMMERCE";

  return <LoginForm storeName={storeName} storeLogo={config?.logoBase64} />;
}
