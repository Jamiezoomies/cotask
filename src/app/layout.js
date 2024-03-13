import { Inter } from "next/font/google";
import { Navbar } from "./components/navbar"
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    template: " %s | CoTask",
    default: "CoTask",
  },
  description: "Task Together, Triumph Together",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div><Navbar/></div>
        <div className={inter.className}>
          <div className="mt-16">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
