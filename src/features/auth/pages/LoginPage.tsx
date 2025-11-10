/**
 * Página de Autenticação (exemplo de refatoração)
 * Localização: src/features/auth/pages/LoginPage.tsx
 * 
 * Antes estava em: src/pages/Login.tsx
 */

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/shared/hooks';
import { Card, CardBody, CardTitle } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { MESSAGES } from '@/constants';
import { validateEmail, validatePassword } from '@/utils/validators';
import { rateLimiter, InputSanitizer, logger } from '@/utils';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Pega a rota de origem se existir, para redirecionar após login
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!email) {
      errors.email = MESSAGES.ERRORS.REQUIRED_FIELD;
    } else if (!validateEmail(email)) {
      errors.email = MESSAGES.ERRORS.INVALID_EMAIL;
    }

    if (!password) {
      errors.password = MESSAGES.ERRORS.REQUIRED_FIELD;
    } else if (!validatePassword(password)) {
      errors.password = MESSAGES.ERRORS.PASSWORD_TOO_SHORT;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Rate limiting - máximo 5 tentativas em 15 minutos
    const rateLimitKey = `login:${email}`;
    if (!rateLimiter.canExecute(rateLimitKey, 5, 900000)) {
      const timeLeft = rateLimiter.getTimeUntilReset(rateLimitKey);
      const minutes = Math.ceil(timeLeft / 60);
      setError(`Muitas tentativas. Tente novamente em ${minutes} minuto${minutes > 1 ? 's' : ''}.`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
      // Reset rate limit em caso de sucesso
      rateLimiter.reset(rateLimitKey);
      // Redireciona para a rota original ou para home
      navigate(from, { replace: true });
    } catch {
      logger.error('Erro no login', { email });
      setError(MESSAGES.ERRORS.INVALID_CREDENTIALS);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid place-items-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardBody>
          <CardTitle className="text-center mb-6">Entrar</CardTitle>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(InputSanitizer.sanitizeEmail(e.target.value))}
                disabled={loading}
                className={fieldErrors.email ? 'border-destructive' : ''}
              />
              {fieldErrors.email && (
                <p className="text-sm text-destructive mt-1">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className={fieldErrors.password ? 'border-destructive' : ''}
              />
              {fieldErrors.password && (
                <p className="text-sm text-destructive mt-1">{fieldErrors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="mt-6 w-full"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Não tem conta?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-primary hover:underline font-medium"
            >
              Cadastre-se
            </button>
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

export default LoginPage;
