'use client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '../styles/globals.css';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' }, // синій
    secondary: { main: '#dc004e' }, // рожевий
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline /> {/* базові стилі MUI */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
