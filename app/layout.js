import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = { title: "BookNook" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}