import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/features/admin/components/Sidebar';
import Container from '@/shared/components/Container';

interface CreateAccountForm {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface PasswordValidation {
  minLength: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  isValid: boolean;
}

const CreateAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateAccountForm>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    minLength: false,
    hasUppercase: false,
    hasNumber: false,
    isValid: false,
  });
  const [errors, setErrors] = useState<Partial<CreateAccountForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validatePassword = (password: string): PasswordValidation => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    return {
      minLength,
      hasUppercase,
      hasNumber,
      isValid: minLength && hasUppercase && hasNumber,
    };
  };

  const handleInputChange = (field: keyof CreateAccountForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    
    // Validar senha em tempo real
    if (field === 'password') {
      setPasswordValidation(validatePassword(value));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateAccountForm> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nome completo é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (!passwordValidation.isValid) {
      newErrors.password = 'A senha não atende aos requisitos mínimos';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Integrar com o backend
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Criando conta:', formData);
      navigate('/admin/dashboard');
    } catch {
      setSubmitError('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full font-display bg-background-light dark:bg-background-dark">
      <Sidebar />
      <main className="flex-1 p-8">
        <Container maxWidth="4xl">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="text-[#636f88] dark:text-gray-400 text-sm font-medium leading-normal hover:text-gray-900 dark:hover:text-gray-200"
            >
              Usuários
            </button>
            <span className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal">/</span>
            <span className="text-gray-900 dark:text-gray-100 text-sm font-medium leading-normal">
              Adicionar Administrador
            </span>
          </div>

          {/* PageHeading */}
          <div className="flex flex-wrap justify-between gap-3 mb-8">
            <div className="flex min-w-72 flex-col gap-2">
              <h1 className="text-[#111318] dark:text-gray-100 text-3xl font-black leading-tight tracking-tight">
                Criar Novo Administrador
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal">
                Preencha os campos abaixo para criar uma nova conta de administrador.
              </p>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white dark:bg-gray-900/50 rounded-xl shadow-sm border border-gray-200/80 dark:border-gray-800">
            {/* SectionHeader */}
            <div className="border-b border-gray-200/80 dark:border-gray-800">
              <h3 className="text-gray-900 dark:text-gray-200 text-lg font-bold leading-tight tracking-[-0.015em] px-6 py-4">
                Informações da Conta
              </h3>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {submitError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-800 dark:text-red-400 text-sm">{submitError}</p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Full Name Field */}
                <div className="flex flex-col">
                  <label
                    className="text-gray-900 dark:text-gray-200 text-sm font-medium leading-normal pb-2"
                    htmlFor="fullName"
                  >
                    Nome Completo
                  </label>
                  <input
                    className={`form-input flex w-full resize-none rounded-lg text-[#111318] dark:text-gray-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border ${
                      errors.fullName ? 'border-red-500' : 'border-[#dcdfe5] dark:border-gray-700'
                     } bg-white dark:bg-gray-800 focus:border-primary dark:focus:border-primary h-12 placeholder:text-[#636f88] dark:placeholder:text-gray-500 px-4 text-sm font-normal leading-normal`}
                    id="fullName"
                    placeholder="Digite o nome completo"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                  )}
                </div>

                {/* Email Field */}
                <div className="flex flex-col">
                  <label
                    className="text-gray-900 dark:text-gray-200 text-sm font-medium leading-normal pb-2"
                    htmlFor="email"
                  >
                    Endereço de E-mail
                  </label>
                  <input
                    className={`form-input flex w-full resize-none rounded-lg text-[#111318] dark:text-gray-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border ${
                      errors.email ? 'border-red-500' : 'border-[#dcdfe5] dark:border-gray-700'
                     } bg-white dark:bg-gray-800 focus:border-primary dark:focus:border-primary h-12 placeholder:text-[#636f88] dark:placeholder:text-gray-500 px-4 text-sm font-normal leading-normal`}
                    id="email"
                    placeholder="exemplo@email.com"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Password Field */}
                <div className="flex flex-col">
                  <label
                    className="text-gray-900 dark:text-gray-200 text-sm font-medium leading-normal pb-2"
                    htmlFor="password"
                  >
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      className={`form-input flex w-full resize-none rounded-lg text-[#111318] dark:text-gray-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border ${
                        errors.password ? 'border-red-500' : 'border-[#dcdfe5] dark:border-gray-700'
                      } bg-white dark:bg-gray-800 focus:border-primary dark:focus:border-primary h-12 placeholder:text-[#636f88] dark:placeholder:text-gray-500 px-4 pr-10 text-sm font-normal leading-normal`}
                      id="password"
                      placeholder="Digite uma senha forte"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                    />
                    <button
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <span className="material-symbols-outlined text-xl">
                        {showPassword ? 'visibility' : 'visibility_off'}
                      </span>
                    </button>
                  </div>
                  <p className="text-[#636f88] dark:text-gray-500 text-xs mt-2">Mínimo 8 caracteres, com 1 letra maiúscula e 1 número.</p>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="flex flex-col">
                  <label
                    className="text-gray-900 dark:text-gray-200 text-sm font-medium leading-normal pb-2"
                    htmlFor="confirmPassword"
                  >
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <input
                      className={`form-input flex w-full resize-none rounded-lg text-[#111318] dark:text-gray-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border ${
                        errors.confirmPassword ? 'border-red-500' : 'border-[#dcdfe5] dark:border-gray-700'
                      } bg-white dark:bg-gray-800 focus:border-primary dark:focus:border-primary h-12 placeholder:text-[#636f88] dark:placeholder:text-gray-500 px-4 pr-10 text-sm font-normal leading-normal`}
                      id="confirmPassword"
                      placeholder="Repita a senha"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    />
                    <button
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <span className="material-symbols-outlined text-xl">
                        {showConfirmPassword ? 'visibility' : 'visibility_off'}
                      </span>
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200/80 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => navigate('/admin/dashboard')}
                  disabled={isSubmitting}
                  className="flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 px-6 h-10 text-sm font-semibold text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center rounded-lg bg-primary px-6 h-10 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Criando...
                    </>
                  ) : (
                    'Criar Conta'
                  )}
                </button>
              </div>
            </form>
          </div>
        </Container>
      </main>
    </div>
  );
};

export default CreateAccountPage;
