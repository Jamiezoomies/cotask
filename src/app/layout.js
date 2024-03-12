import { Inter } from "next/font/google";
import { Navbar } from "./components/navbar"
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CoTask",
  description: "Task Together, Triumph Together",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div><Navbar/></div>
        <div className={inter.className}>{children}</div>
      </body>
    </html>
  );
}
