import { useState } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { DashboardHeader } from "./components/DashboardHeader";
import { DashboardSidebar } from "./components/DashboardSidebar";
import { DashboardMain } from "./components/DashboardMain";
import { ChatbotPanel } from "./components/ChatbotPanel";
import { UserSettings } from "./components/UserSettings";
import { AdminPanel } from "./components/AdminPanel";
import { LegalCenter } from "./components/LegalCenter";
import { ReauthDialog } from "./components/ReauthDialog";
import { Button } from "./components/ui/button";
import { MessageSquare } from "lucide-react";
import { Toaster } from "./components/ui/sonner";

type UserRole = "Admin" | "Jurídico" | "Gestor" | "Colaborador" | "Estagiário";
type ViewType = "dashboard" | "settings" | "admin" | "legal";

interface User {
  email: string;
  name: string;
  role: UserRole;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>(["rh", "vendas"]);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [showReauthDialog, setShowReauthDialog] = useState(false);
  const [isLegalAuthenticated, setIsLegalAuthenticated] = useState(false);

  const handleLogin = (email: string, password: string) => {
    // Mock authentication logic
    let role: UserRole = "Colaborador";
    let name = "Usuário";

    if (email.includes("admin")) {
      role = "Admin";
      name = "Ana Silva";
    } else if (email.includes("juridico")) {
      role = "Jurídico";
      name = "Dr. Ricardo Alves";
    } else if (email.includes("gestor")) {
      role = "Gestor";
      name = "Carlos Santos";
    } else if (email.includes("estagiario")) {
      role = "Estagiário";
      name = "Patricia Costa";
    } else if (email.includes("colaborador")) {
      role = "Colaborador";
      name = "Maria Oliveira";
    }

    setUser({ email, name, role });
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setCurrentView("dashboard");
    setSelectedDepartments(["rh", "vendas"]);
    setIsLegalAuthenticated(false);
  };

  const handleToggleDepartment = (deptId: string) => {
    if (selectedDepartments.includes(deptId)) {
      setSelectedDepartments(selectedDepartments.filter(id => id !== deptId));
    } else {
      setSelectedDepartments([...selectedDepartments, deptId]);
    }
  };

  const handleUpdateDepartments = (departments: string[]) => {
    setSelectedDepartments(departments);
  };

  const handleViewChange = (view: ViewType) => {
    // If trying to access legal center, require reauth
    if (view === "legal" && !isLegalAuthenticated) {
      setShowReauthDialog(true);
      return;
    }
    setCurrentView(view);
  };

  const handleReauthSuccess = () => {
    setIsLegalAuthenticated(true);
    setShowReauthDialog(false);
    setCurrentView("legal");
  };

  const handleReauthCancel = () => {
    setShowReauthDialog(false);
  };

  const handleOpenSettings = () => {
    setCurrentView("settings");
  };

  if (!isLoggedIn) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <DashboardSidebar
        selectedDepartments={selectedDepartments}
        onToggleDepartment={handleToggleDepartment}
        currentView={currentView}
        onViewChange={handleViewChange}
        userRole={user?.role || "Colaborador"}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          userName={user?.name || "Usuário"}
          userRole={user?.role || "Colaborador"}
          onLogout={handleLogout}
          onOpenSettings={handleOpenSettings}
        />

        {currentView === "dashboard" && (
          <DashboardMain
            selectedDepartments={selectedDepartments}
            userRole={user?.role || "Colaborador"}
          />
        )}

        {currentView === "settings" && (
          <UserSettings
            selectedDepartments={selectedDepartments}
            onUpdateDepartments={handleUpdateDepartments}
            onClose={() => setCurrentView("dashboard")}
          />
        )}

        {currentView === "admin" && user?.role === "Admin" && (
          <AdminPanel onClose={() => setCurrentView("dashboard")} />
        )}

        {currentView === "legal" && (user?.role === "Admin" || user?.role === "Jurídico") && (
          <LegalCenter 
            onClose={() => setCurrentView("dashboard")} 
            userName={user?.name || "Usuário"}
            userRole={user?.role || "Colaborador"}
          />
        )}
      </div>

      {/* Reauth Dialog */}
      <ReauthDialog
        open={showReauthDialog}
        onSuccess={handleReauthSuccess}
        onCancel={handleReauthCancel}
        userEmail={user?.email || ""}
      />

      {/* Floating Chatbot Button */}
      {!isChatbotOpen && currentView === "dashboard" && (
        <Button
          onClick={() => setIsChatbotOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-2xl z-40"
          size="icon"
        >
          <MessageSquare className="w-6 h-6" />
        </Button>
      )}

      {/* Chatbot Panel */}
      {isChatbotOpen && (
        <ChatbotPanel 
          onClose={() => setIsChatbotOpen(false)} 
          userRole={user?.role}
        />
      )}

      <Toaster />
    </div>
  );
}

export default App;
