export const metadata = {
  title: 'Mindora Collection',
  description: 'Sistema de gestión Mindora',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
