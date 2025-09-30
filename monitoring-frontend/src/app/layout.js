import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
   title: "Monitoring SaaS – Website Uptime & Performance Monitoring",
  description:
    "Track website uptime, response times, and incidents with real-time alerts. A powerful monitoring SaaS built with MERN stack.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}

        <Toaster
          position="top-right"
          toastOptions={{
            className: "rounded-md shadow-md",
            success: {
              style: { background: "#ecfdf5", color: "#065f46" },
            },
            error: {
              style: { background: "#fef2f2", color: "#991b1b" },
            },
          }}
        />
      </body>
    </html>
  );
}
