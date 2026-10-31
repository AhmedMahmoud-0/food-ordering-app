import { Pages, Routes } from "@/constants/enums";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import Form from "./_components/Form";
import getTrans from "@/lib/translation";
import AuthLayout from "../_components/AuthLayout";

async function SigninPage() {
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);

  return (
    <AuthLayout
      title={translations.auth.login.title}
      prompt={translations.auth.login.authPrompt.message}
      switchLabel={translations.auth.login.authPrompt.signUpLinkText}
      switchHref={`/${locale}/${Routes.AUTH}/${Pages.Register}`}
    >
      <Form translations={translations} />
    </AuthLayout>
  );
}

export default SigninPage;
