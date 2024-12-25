import Link from "next/link";

import { Trans } from "react-i18next/TransWithoutContext";
import { locales } from "@/config";
import { translation } from "@/app/i18n";

interface LanguageChangeProps {
  lng: string;
}

export default async function LanguageChange({ lng }: LanguageChangeProps) {
  const { t } = await translation(lng);
  return (
    <div>
      <Trans i18nKey="languageSwitcher" t={t}>
        Switch from <strong>{lng}</strong> to:{" "}
      </Trans>
      {locales
        .filter(l => lng !== l)
        .map((l, index) => {
          return (
            <span key={l}>
              {index > 0 && " | "}
              <Link href={`/${l}`}>{l}</Link>
            </span>
          );
        })}
    </div>
  );
}
