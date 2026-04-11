import type { Metadata } from "next";
import "./globals.css"; 

export const metadata: Metadata = {
  title: "La Cuponera",
  description: "Las mejores ofertas y cupones",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}