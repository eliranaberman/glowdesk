
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useEffect, Suspense } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { allRoutes } from "./routes";

console.log("🔄 App component is being loaded");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  useEffect(() => {
    console.log("🔄 App component mounted");
    console.log("Current pathname:", window.location.pathname);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="rtl text-right">
          <Toaster />
          <Sonner />
          <HelmetProvider>
            <Suspense fallback={<div className="p-8 text-center">Loading application...</div>}>
              <BrowserRouter>
                <AuthProvider>
                  <Routes>
                    {allRoutes.map((route) => (
                      <Route key={route.path} path={route.path} element={route.element} />
                    ))}
                  </Routes>
                </AuthProvider>
              </BrowserRouter>
            </Suspense>
          </HelmetProvider>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
