import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import type { AuthResponse } from '../types';
import { SIGN_UP } from '../graphql/queries';
import { Card, CardBody, CardTitle } from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  type SignUpResult = { signUp: AuthResponse };
  const [signUp] = useMutation<SignUpResult>(SIGN_UP);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        
        // Redirecionar para login para buscar dados do usuário
        navigate('/login');
      }
    } catch (err) {
      console.error('Erro ao criar conta:', err);
      setError('Erro ao criar conta. Verifique seus dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid place-items-center">
      <Card className="w-full max-w-md">
        <CardBody>
          <CardTitle>Cadastrar-se</CardTitle>
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <Input label="Nome" name="name" value={formData.name} onChange={handleChange} required />
            <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
            <Input label="Telefone (opcional)" type="tel" name="phone" value={formData.phone} onChange={handleChange} />
            <Input label="Senha" type="password" name="password" value={formData.password} onChange={handleChange} required />
            {error && <div className="text-sm text-red-600">{error}</div>}
            <Button type="submit" disabled={loading} full>
              {loading ? 'Criando conta...' : 'Cadastrar'}
            </Button>
          </form>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            Já tem conta? <Link className="font-medium text-gray-900 dark:text-white" to="/login">Entrar</Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

export default Register;
