import { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function ResetPasswordPage() {
  const [, setLocation] = useLocation();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setError('Autenticação não está configurada.');
      setIsReady(false);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsReady(true);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsReady(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isSupabaseConfigured) {
      setError('Autenticação não está configurada.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setSuccess('Senha alterada com sucesso.');

      setTimeout(() => {
        setLocation('/login');
      }, 1200);
    } catch {
      setError('Erro ao redefinir senha');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <button
              type="button"
              onClick={() => setLocation('/login')}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Ir para o login
            </button>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Definir nova senha</h2>
            <p className="text-muted-foreground">Digite sua nova senha</p>
          </div>

          {!isReady && !error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 text-foreground mb-6">
              <p className="text-sm font-medium">Abra este link a partir do e-mail de redefinição.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 text-primary">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 text-foreground">
                <p className="text-sm font-medium">{success}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="reset-password" className="text-sm font-semibold">Nova senha</Label>
              <Input
                id="reset-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 rounded-xl border-2 border-transparent bg-muted/50 focus:border-foreground focus:bg-card transition-all text-base"
                disabled={!isReady || isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reset-confirm" className="text-sm font-semibold">Confirmar senha</Label>
              <Input
                id="reset-confirm"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-12 rounded-xl border-2 border-transparent bg-muted/50 focus:border-foreground focus:bg-card transition-all text-base"
                disabled={!isReady || isSubmitting}
              />
            </div>

            <button
              type="submit"
              className="w-full h-14 bg-primary text-primary-foreground rounded-xl font-bold text-base hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={!isReady || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar nova senha'
              )}
            </button>

            <p className="text-center text-sm text-muted-foreground">
              <Link href="/login" className="font-semibold text-foreground hover:underline">
                Voltar
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
