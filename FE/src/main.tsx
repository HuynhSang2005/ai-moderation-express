import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@mantine/notifications/styles.css';

import { Notifications } from '@mantine/notifications';
import App from './App';

const queryClient = new QueryClient();

const theme = createTheme({
  fontFamily: 'Inter, sans-serif',
  headings: {
    fontFamily: 'Inter, sans-serif',
  },
  defaultRadius: 'md',
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="auto">
          <Notifications position="top-right" />

        <App />
      </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
