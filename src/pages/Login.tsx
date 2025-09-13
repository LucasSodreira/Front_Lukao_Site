import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card, CardBody, CardTitle } from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid place-items-center">
      <Card className="w-full max-w-md">
        <CardBody>
          <CardTitle>Entrar</CardTitle>
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <Input
              type="email"
              name="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              name="password"
              label="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <div className="text-sm text-red-600">{error}</div>}
            <Button type="submit" disabled={loading} full>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            Não tem conta? <Link className="font-medium text-gray-900 dark:text-white" to="/register">Cadastre-se</Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

export default Login;
