import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Shield, AlertCircle } from "lucide-react";

interface ReauthDialogProps {
  open: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  userEmail: string;
}

export function ReauthDialog({ open, onSuccess, onCancel, userEmail }: ReauthDialogProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Mock authentication - in production, verify password with backend
    setTimeout(() => {
      if (password.length > 0) {
        setPassword("");
        setIsLoading(false);
        onSuccess();
      } else {
        setError("Senha incorreta. Tente novamente.");
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <DialogTitle>Reautenticação Necessária</DialogTitle>
              <DialogDescription>
                Área sensível - confirme sua identidade
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <Alert className="border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              A Central Jurídica contém documentos confidenciais. Por segurança, confirme sua senha para continuar.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reauth-email">Email</Label>
              <Input
                id="reauth-email"
                type="email"
                value={userEmail}
                disabled
                className="bg-slate-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reauth-password">Senha</Label>
              <Input
                id="reauth-password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isLoading}>
                {isLoading ? "Verificando..." : "Confirmar Acesso"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
