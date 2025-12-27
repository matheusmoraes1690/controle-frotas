import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { supabase, isSupabaseConfigured, supabaseUrl } from '../lib/supabase';

export default function ForgotPasswordPage() {
  const [, setLocation] = useLocation();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isSupabaseConfigured) {
      setError('Autenticação não está configurada.');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Forgot password - Supabase URL:', supabaseUrl);
      const redirectTo = `${window.location.origin}/reset-password`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (resetError) {
        if (/failed to fetch/i.test(resetError.message) || /falha ao buscar/i.test(resetError.message)) {
          setError(`Falha ao conectar ao servidor de autenticação (Supabase). Verifique VITE_SUPABASE_URL (atual: ${supabaseUrl || 'vazio'}), VITE_SUPABASE_ANON_KEY e sua conexão com a internet.`);
        } else {
          setError(resetError.message);
        }
        return;
      }

      setSuccess('Se esse e-mail estiver cadastrado, você receberá um link para redefinir a senha.');
    } catch (err) {
      console.error('Forgot password error:', err);
      const message = err instanceof Error ? err.message : String(err);
      if (/failed to fetch/i.test(message) || /falha ao buscar/i.test(message)) {
        setError(`Falha ao conectar ao servidor de autenticação (Supabase). Verifique VITE_SUPABASE_URL (atual: ${supabaseUrl || 'vazio'}), VITE_SUPABASE_ANON_KEY e sua conexão com a internet.`);
      } else {
        setError('Erro ao solicitar redefinição de senha');
      }
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
              Voltar para o login
            </button>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Redefinir senha</h2>
            <p className="text-muted-foreground">Informe seu e-mail para receber o link de redefinição</p>
          </div>

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
              <Label htmlFor="forgot-email" className="text-sm font-semibold">E-mail</Label>
              <Input
                id="forgot-email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-xl border-2 border-transparent bg-muted/50 focus:border-foreground focus:bg-card transition-all text-base"
              />
            </div>

            <button
              type="submit"
              className="w-full h-14 bg-primary text-primary-foreground rounded-xl font-bold text-base hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar link'
              )}
            </button>

            <p className="text-center text-sm text-muted-foreground">
              Lembrou a senha?{' '}
              <Link href="/login" className="font-semibold text-foreground hover:underline">
                Entrar
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
