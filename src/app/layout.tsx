import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jornada com Deus",
  description: "Um momento diário para fortalecer sua caminhada com Deus.",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
