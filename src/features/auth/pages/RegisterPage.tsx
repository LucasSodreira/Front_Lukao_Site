import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import type { AuthResponse } from '@/types';
import { SIGN_UP } from '@/graphql/queries';
import { Card, CardBody, CardTitle } from '@/ui/Card';
import Input from '@/ui/Input';
import { Button } from '@/ui/Button';
import { MESSAGES } from '@/constants';
import { validateEmail, validatePassword } from '@/utils/validators';
import { logger, InputSanitizer, rateLimiter, ErrorHandler } from '@/utils';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  type SignUpResult = { signUp: AuthResponse };
  const [signUp] = useMutation<SignUpResult>(SIGN_UP);
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name) {
      errors.name = MESSAGES.ERRORS.REQUIRED_FIELD;
    }

    if (!formData.email) {
      errors.email = MESSAGES.ERRORS.REQUIRED_FIELD;
    } else if (!validateEmail(formData.email)) {
      errors.email = MESSAGES.ERRORS.INVALID_EMAIL;
    }

    if (!formData.password) {
      errors.password = MESSAGES.ERRORS.REQUIRED_FIELD;
    } else if (!validatePassword(formData.password)) {
      errors.password = MESSAGES.ERRORS.PASSWORD_TOO_SHORT;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let sanitizedValue = value;

    // Sanitizar baseado no tipo de campo
    switch (name) {
      case 'email':
        sanitizedValue = InputSanitizer.sanitizeEmail(value);
        break;
      case 'phone':
        sanitizedValue = InputSanitizer.sanitizePhone(value);
        break;
      case 'name':
        sanitizedValue = InputSanitizer.sanitizeText(value);
        break;
      default:
        sanitizedValue = value;
    }

    setFormData({
      ...formData,
      [name]: sanitizedValue
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Rate limiting - máximo 3 tentativas em 15 minutos
    const rateLimitKey = `register:${formData.email}`;
    if (!rateLimiter.canExecute(rateLimitKey, 3, 900000)) {
      const timeLeft = rateLimiter.getTimeUntilReset(rateLimitKey);
      const minutes = Math.ceil(timeLeft / 60);
      setError(`Muitas tentativas. Tente novamente em ${minutes} minuto${minutes > 1 ? 's' : ''}.`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await signUp({
        variables: {
          input: {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone || undefined
          }
        }
      });

      if (data?.signUp) {
        // Salvar tokens
        localStorage.setItem('authToken', data.signUp.accessToken);
        localStorage.setItem('refreshToken', data.signUp.refreshToken);
        
        // Reset rate limit em caso de sucesso
        rateLimiter.reset(rateLimitKey);
        
        // Redirecionar para login para buscar dados do usuário
        navigate('/login');
      }
    } catch (err) {
      logger.error('Erro ao criar conta', { email: formData.email, error: err });
      setError(ErrorHandler.getUserFriendlyMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid place-items-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardBody>
          <CardTitle className="text-center mb-6">Cadastrar-se</CardTitle>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Nome completo"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                className={fieldErrors.name ? 'border-destructive' : ''}
              />
              {fieldErrors.name && (
                <p className="text-sm text-destructive mt-1">{fieldErrors.name}</p>
              )}
            </div>

            <div>
              <Input
                placeholder="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className={fieldErrors.email ? 'border-destructive' : ''}
              />
              {fieldErrors.email && (
                <p className="text-sm text-destructive mt-1">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <Input
                placeholder="Telefone (opcional)"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div>
              <Input
                placeholder="Senha"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className={fieldErrors.password ? 'border-destructive' : ''}
              />
              {fieldErrors.password && (
                <p className="text-sm text-destructive mt-1">{fieldErrors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              full
              disabled={loading}
              className="mt-6"
            >
              {loading ? 'Criando conta...' : 'Cadastrar'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Já tem conta?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-primary hover:underline font-medium"
            >
              Entrar
            </button>
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

export default RegisterPage;
