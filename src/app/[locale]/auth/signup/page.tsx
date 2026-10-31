import { Pages, Routes } from "@/constants/enums";
import { Locale } from "@/i18n.config";
import getTrans from "@/lib/translation";
import Form from "./_components/Form";
import AuthLayout from "../_components/AuthLayout";

async function SignupPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const translations = await getTrans(locale);

  return (
    <AuthLayout
      title={translations.auth.register.title}
      prompt={translations.auth.register.authPrompt.message}
      switchLabel={translations.auth.register.authPrompt.loginLinkText}
      switchHref={`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`}
    >
      <Form translations={translations} />
    </AuthLayout>
  );
}

export default SignupPage;
