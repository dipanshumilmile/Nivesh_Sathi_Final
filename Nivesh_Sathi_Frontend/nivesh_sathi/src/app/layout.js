import "./globals.css";
import NavbarWrapper from "../components/navbar/NavbarWrapper";

export const metadata = {
  title: "NiveshSathi",
  description: "AI-powered wealth management for Indian middle-class investors",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavbarWrapper />
        {children}
      </body>
    </html>
  );
}
