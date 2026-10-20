import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "CodeAlpha Ecommerce",
  description: "CodeAlpha Ecommerce",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <Providers>
          <Navbar />
          <main className="page-shell mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
