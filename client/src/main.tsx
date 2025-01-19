import App from "@/App";
import { Toaster } from "@/components/ui/toaster";
import { SocketProvider } from "@/context/socketProviders";
import { ThemeProvider } from "@/context/themeProviders";
import { UserDetailsProvider } from "@/context/userContext";
import { UserPostIdSaveAndLikeProvider } from "@/context/userPostIdForSaveAndLike";
import "@/css/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
				<UserDetailsProvider>
					<SocketProvider>
						<UserPostIdSaveAndLikeProvider>
							<App />
						</UserPostIdSaveAndLikeProvider>
					</SocketProvider>
				</UserDetailsProvider>
				<Toaster />
			</ThemeProvider>
		</QueryClientProvider>
		{/* </BrowserRouter> */}
	</React.StrictMode>,
);
