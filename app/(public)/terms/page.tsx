import { getStoreConfig } from "@/server/actions/store.actions";

export const dynamic = "force-dynamic";

export default async function TermsPage() {
  const config = await getStoreConfig();

  return (
    <div className="container max-w-4xl py-12 md:py-16 mx-auto">
      <div className="space-y-4 mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl text-center">
          {config?.termsTitle || "Terms and Conditions"}
        </h1>
        <p className="text-muted-foreground text-center">
          Last updated:{" "}
          {config?.updatedAt
            ? new Date(config.updatedAt).toLocaleDateString()
            : new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="prose prose-stone dark:prose-invert max-w-none">
        {config?.termsContent ? (
          <div className="whitespace-pre-wrap">{config.termsContent}</div>
        ) : (
          <p>No terms and conditions content available.</p>
        )}
      </div>
    </div>
  );
}
