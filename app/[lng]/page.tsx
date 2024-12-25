import Link from "next/link";
import { translation } from "@/app/i18n";
import LanguageChange from "@/components/LanguageChange";

export default async function Home({ params }: ServerComParams) {
  const { lng } = await params;

  const { t } = await translation(lng);
  return (
    <div>
      <LanguageChange lng={lng} />
      <Link href={`${lng}/editor`}>{t("welcome")}</Link>
    </div>
  );
}
