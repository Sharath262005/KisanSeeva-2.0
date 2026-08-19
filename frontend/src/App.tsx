import AppRoutes from "./routes/AppRoutes";
import Chatbot from "./components/common/Chatbot";
import { useCapacitorBackButton } from "./hooks/useCapacitorBackButton";

function AppContent() {
  useCapacitorBackButton();

  return (
    <>
      <AppRoutes />
      <Chatbot />
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;
