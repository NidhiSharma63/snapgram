import App from "@/App";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/context/themeProviders";
import "@/css/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import ReactDOM from "react-dom/client";


// Create a client
export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Number.POSITIVE_INFINITY,
			refetchOnWindowFocus: true,
		},
	},
});

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		{/* <BrowserRouter> */}
		<QueryClientProvider client={queryClient}>
			<ThemeProvider defaultTheme="light" storageKey="snap-gram-theme">
				<App />
				<Toaster />
			</ThemeProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
		{/* </BrowserRouter> */}
	</React.StrictMode>,
);
