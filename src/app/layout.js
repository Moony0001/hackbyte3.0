import "./globals.css";
import Navbar from "./components/Navbar";
import { UserProvider } from "./context/UserContext";

export const metadata = {
  title: "Create Next App",
  description: "Bug dex",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body> 
        <UserProvider>
          <Navbar/>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
