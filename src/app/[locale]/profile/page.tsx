import EditUserForm from "@/components/edit-user-form";
import { Pages, Routes } from "@/constants/enums";
import { Locale } from "@/i18n.config";
import getTrans from "@/lib/translation";
import { authOptions } from "@/server/auth";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { UserRound } from "lucide-react";

async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const session = await getServerSession(authOptions);
  const { locale } = await params;
  const translations = await getTrans(locale);

  if (!session) {
    redirect(`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`);
  }
  if (session && session.user.role === UserRole.ADMIN) {
    redirect(`/${locale}/${Routes.ADMIN}`);
  }

  return (
    <main>
      <section className="page-section">
        <div className="container max-w-6xl">
          <div className="mb-8 flex flex-col gap-3 border-b border-border/70 pb-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="section-eyebrow inline-flex items-center gap-2">
                <UserRound className="size-4" />
                {translations.navbar.profile}
              </span>
              <h1 className="section-title">{translations.profile.title}</h1>
            </div>
            <div className="rounded-full border border-border/80 bg-card px-4 py-2 text-sm font-semibold text-muted-foreground shadow-sm">
              {session.user.email}
            </div>
          </div>
          <EditUserForm user={session.user} translations={translations} />
        </div>
      </section>
    </main>
  );
}

export default ProfilePage;
