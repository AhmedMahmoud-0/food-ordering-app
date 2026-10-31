import EditUserForm from "@/components/edit-user-form";
import { Pages, Routes } from "@/constants/enums";
import { Locale } from "@/i18n.config";
import getTrans from "@/lib/translation";
import { getUser, getUsers } from "@/server/db/users";
import { redirect } from "next/navigation";

export async function generateStaticParams() {
  const users = await getUsers();

  return users.map((user) => ({ userId: user.id }));
}

async function EditUserPage({
  params,
}: {
  params: Promise<{ userId: string; locale: Locale }>;
}) {
  const { locale, userId } = await params;
  const translations = await getTrans(locale);
  const user = await getUser(userId);

  if (!user) {
    redirect(`/${locale}/${Routes.ADMIN}/${Pages.USERS}`);
  }

  return (
    <main>
      <section className="py-8 md:py-10">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8">
            <span className="section-eyebrow">{translations.admin.tabs.users}</span>
            <h1 className="section-title">{translations.edit}</h1>
          </div>
          <EditUserForm translations={translations} user={user} />
        </div>
      </section>
    </main>
  );
}

export default EditUserPage;
