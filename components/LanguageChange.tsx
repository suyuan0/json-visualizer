"use client";

import { useState, useRef, Fragment, useEffect } from "react";
import { usePathname, useParams, useRouter, useSelectedLayoutSegments } from "next/navigation";
import { locales } from "@/config";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";

export default function LanguageChange() {
  const urlSegments = useSelectedLayoutSegments();
  const router = useRouter();
  const params = useParams();
  const [locale] = useState(params?.lng);

  const handleLocaleChange = (newLocale: string) => {
    const newUrl = `/${newLocale}/${urlSegments.join("/")}`;
    return newUrl;
  };

  const handleLinkClick = (newLocale: string) => {
    const resolvedUrl = handleLocaleChange(newLocale);
    router.push(resolvedUrl);
  };

  return (
    <div className="relative inline-block text-left mr-5">
      <DropdownMenu>
        <DropdownMenuTrigger>{(locale as string).split("-")[0]}</DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-0 w-auto">
          <DropdownMenuGroup>
            {locales.map(v => (
              <DropdownMenuItem key={v} onClick={() => handleLinkClick(v)}>
                {v.split("-")[0]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
