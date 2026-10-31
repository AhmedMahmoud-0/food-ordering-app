import Link from "@/components/link";
import { buttonVariants } from "@/components/ui/button";
import { Pages, Routes } from "@/constants/enums";
import { Locale } from "@/i18n.config";
import { getUsers } from "@/server/db/users";
import getTrans from "@/lib/translation";
import { Edit, Mail, UsersRound } from "lucide-react";
import DeleteUserButton from "./_components/DeleteUserButton";

async function UsersPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const users = await getUsers();
  const translations = await getTrans(locale);

  return (
    <main>
      <section className="py-8 md:py-10">
        <div className="container admin-shell">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <span className="section-eyebrow">{translations.admin.tabs.users}</span>
              <h1 className="section-title">{translations.admin.tabs.users}</h1>
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border/80 bg-card px-3.5 py-2 text-xs font-extrabold text-muted-foreground shadow-sm">
              <UsersRound className="size-4 text-primary" />
              {users.length}
            </span>
          </div>

          {users.length > 0 && (
            <ul className="grid gap-3">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="group flex min-w-0 flex-col justify-between gap-4 rounded-2xl border border-border/80 bg-card p-4 shadow-[0_8px_24px_rgba(52,35,22,0.035)] transition-all hover:border-primary/20 hover:shadow-[0_14px_30px_rgba(52,35,22,0.07)] sm:flex-row sm:items-center sm:px-5"
                >
                  <div className="flex min-w-0 items-center gap-3.5">
                    <span className="element-center size-12 shrink-0 rounded-2xl bg-gradient-to-br from-primary/15 to-secondary text-sm font-black uppercase text-primary ring-1 ring-primary/10">
                      {user.name?.trim().charAt(0) || "?"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="break-words text-sm font-extrabold text-foreground sm:text-base">
                        {user.name || "—"}
                      </h3>
                      <p className="mt-1 flex min-w-0 items-center gap-2 break-all text-xs font-medium text-muted-foreground sm:text-sm">
                        <Mail className="size-3.5 shrink-0" />
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 border-t border-border/70 pt-3 sm:border-0 sm:pt-0">
                    <Link
                      href={`/${locale}/${Routes.ADMIN}/${Pages.USERS}/${user.id}/${Pages.EDIT}`}
                      className={`${buttonVariants({ variant: "outline", size: "icon" })} size-10 rounded-xl border-border/80 bg-background text-muted-foreground shadow-none hover:border-primary/25 hover:bg-primary/5 hover:text-primary`}
                    >
                      <Edit className="size-4" />
                    </Link>
                    <DeleteUserButton userId={user.id} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}

export default UsersPage;
