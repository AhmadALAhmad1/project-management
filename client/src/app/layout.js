import "./globals.css";

export const metadata = {
  title: "Management Project",
  description: "Managing project with clients",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang='en'
    >
      <body>{children}</body>
    </html>
  );
}
