import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../hooks/use-auth';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Loader2, Truck, AlertCircle } from 'lucide-react';
import { Link } from 'wouter';

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { signIn, signUp, isLoading } = useAuth();
  
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ email: '', password: '', confirmPassword: '', username: '' });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    const result = await signIn(loginData.email, loginData.password);
    
    if (result.error) {
      setError(result.error);
    } else {
      setLocation('/');
    }
    
    setIsSubmitting(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (signupData.password !== signupData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    if (signupData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    setIsSubmitting(true);
    
    const result = await signUp(signupData.email, signupData.password, signupData.username);
    
    if (result.error) {
      setError(result.error);
    } else {
      setLocation('/');
    }
    
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-foreground relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col justify-center px-16 text-background">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-12">
            <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center">
              <Truck className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="text-3xl font-bold">FleetTrack</span>
          </div>
          
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Rastreamento <br />
            <span className="text-primary">inteligente</span> <br />
            de frotas
          </h1>
          
          <p className="text-lg text-background/70 max-w-md">
            Monitore sua frota em tempo real com precisão e eficiência. 
            Geofences, alertas e relatórios completos.
          </p>
          
          {/* Stats */}
          <div className="flex gap-12 mt-12">
            <div>
              <p className="text-4xl font-bold text-primary">99.9%</p>
              <p className="text-sm text-background/60">Uptime</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">2M+</p>
              <p className="text-sm text-background/60">Veículos rastreados</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">24/7</p>
              <p className="text-sm text-background/60">Suporte</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
              <Truck className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">FleetTrack</span>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Bem-vindo de volta</h2>
            <p className="text-muted-foreground">Acesse sua conta para continuar</p>
          </div>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 p-1.5 bg-muted/50 rounded-full mb-8">
              <TabsTrigger 
                value="login" 
                className="rounded-full data-[state=active]:bg-card data-[state=active]:shadow-md font-semibold"
              >
                Entrar
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                className="rounded-full data-[state=active]:bg-card data-[state=active]:shadow-md font-semibold"
              >
                Criar Conta
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-5">
                {error && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 text-primary">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-sm font-semibold">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="h-12 rounded-xl border-2 border-transparent bg-muted/50 focus:border-foreground focus:bg-card transition-all text-base"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-sm font-semibold">Senha</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    required
                    className="h-12 rounded-xl border-2 border-transparent bg-muted/50 focus:border-foreground focus:bg-card transition-all text-base"
                  />
                </div>

                <div className="flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-sm font-semibold text-muted-foreground hover:text-foreground hover:underline transition-colors"
                  >
                    Esqueci minha senha
                  </Link>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full h-14 bg-primary text-primary-foreground rounded-xl font-bold text-base hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    'Entrar'
                  )}
                </button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-5">
                {error && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 text-primary">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="signup-username" className="text-sm font-semibold">Nome de Usuário</Label>
                  <Input
                    id="signup-username"
                    type="text"
                    placeholder="Seu nome"
                    value={signupData.username}
                    onChange={(e) => setSignupData(prev => ({ ...prev, username: e.target.value }))}
                    className="h-12 rounded-xl border-2 border-transparent bg-muted/50 focus:border-foreground focus:bg-card transition-all text-base"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm font-semibold">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={signupData.email}
                    onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="h-12 rounded-xl border-2 border-transparent bg-muted/50 focus:border-foreground focus:bg-card transition-all text-base"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm font-semibold">Senha</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupData.password}
                      onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      className="h-12 rounded-xl border-2 border-transparent bg-muted/50 focus:border-foreground focus:bg-card transition-all text-base"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm" className="text-sm font-semibold">Confirmar</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      placeholder="••••••••"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                      className="h-12 rounded-xl border-2 border-transparent bg-muted/50 focus:border-foreground focus:bg-card transition-all text-base"
                    />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full h-14 bg-primary text-primary-foreground rounded-xl font-bold text-base hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Criando conta...
                    </>
                  ) : (
                    'Criar Conta'
                  )}
                </button>
              </form>
            </TabsContent>
          </Tabs>
          
          <p className="text-center text-sm text-muted-foreground mt-8">
            © 2024 FleetTrack. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
