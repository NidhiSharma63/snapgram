import App from "@/App";
import {Toaster} from "@/components/ui/toaster";
import {ThemeProvider} from "@/context/themeProviders";
import {UserDetailsProvider} from "@/context/userContext";
import {UserPostIdSaveAndLikeProvider} from "@/context/userPostIdForSaveAndLike";
import "@/css/index.css";
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  },
});
const client = new ApolloClient({
  uri: "http://localhost:5000",
  cache: new InMemoryCache(),
});
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <BrowserRouter> */}
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={client}>
        <ThemeProvider defaultTheme="light" storageKey="snap-gram-theme">
          <UserDetailsProvider>
            <UserPostIdSaveAndLikeProvider>
              <App />
            </UserPostIdSaveAndLikeProvider>
          </UserDetailsProvider>
          <Toaster />
        </ThemeProvider>
      </ApolloProvider>
    </QueryClientProvider>

    {/* </BrowserRouter> */}
  </React.StrictMode>
);
