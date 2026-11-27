import Loader from "@/components/ui/loader";

export default function CartLoading() {
  return (
    <main>
      <section className="page-section" aria-busy="true" aria-live="polite">
        <div className="container">
          <div className="surface-card flex min-h-72 items-center justify-center p-8">
            <Loader className="size-8" />
          </div>
        </div>
      </section>
    </main>
  );
}
