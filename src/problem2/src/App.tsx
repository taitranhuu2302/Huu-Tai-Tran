import { QueryClient, QueryClientProvider } from "react-query";
import SwapForm from "./components/SwapForm";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <SwapForm />
      </div>
    </QueryClientProvider>
  );
}

export default App;
