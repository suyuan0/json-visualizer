import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { locales } from "@/config";
import { translation } from "@/app/i18n";

const roboto = Roboto({
  weight: "400",
  display: "swap",
  subsets: ["latin"]
});

// export const metadata: Metadata = {
//   title: "JSON visualizer",
//   description: "json visualizer"
// };

export async function generateMetadata({ params }: ServerComParams): Promise<Metadata> {
  const { lng } = await params;
  const { t } = await translation(lng);

  return {
    title: t("metadata.title"),
    description: t("metadata.description")
  };
}

export async function generateStaticParams() {
  return locales.map(lng => ({ lng }));
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<any>;
}>) {
  const { lng } = await params;
  return (
    <html lang={lng} suppressHydrationWarning>
      <body className={`antialiased ${roboto.className}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
