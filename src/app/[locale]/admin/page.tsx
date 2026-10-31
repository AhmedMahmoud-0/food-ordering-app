import EditUserForm from "@/components/edit-user-form";
import { Pages, Routes } from "@/constants/enums";
import { Locale } from "@/i18n.config";
import getTrans from "@/lib/translation";
import { authOptions } from "@/server/auth";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function AdminPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const translations = await getTrans(locale);
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`);
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect(`/${locale}/${Routes.PROFILE}`);
  }

  return (
    <main>
      <section className="py-8 md:py-10">
        <div className="container admin-shell">
          <div className="mb-7">
            <span className="section-eyebrow">{translations.admin.tabs.profile}</span>
            <h1 className="section-title">{translations.profile.title}</h1>
          </div>
          <EditUserForm user={session.user} translations={translations} />
        </div>
      </section>
    </main>
  );
}

export default AdminPage;
