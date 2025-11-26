import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Building2 } from "lucide-react";

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-slate-200">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-slate-900">Work On</h1>
          <p className="text-slate-600 mt-2">Central de Informações Corporativas</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email corporativo</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu.email@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11"
            />
          </div>

          <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700">
            Entrar
          </Button>
        </form>

        <div className="mt-6 text-center">
          <a href="#" className="text-blue-600 hover:underline">
            Esqueceu sua senha?
          </a>
        </div>

        <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-slate-600 mb-2">Usuários de teste:</p>
          <div className="space-y-1 text-slate-700">
            <p>• admin@empresa.com (Admin)</p>
            <p>• juridico@empresa.com (Jurídico)</p>
            <p>• gestor@empresa.com (Gestor)</p>
            <p>• colaborador@empresa.com (Colaborador)</p>
            <p>• estagiario@empresa.com (Estagiário)</p>
          </div>
        </div>
      </div>
    </div>
  );
}