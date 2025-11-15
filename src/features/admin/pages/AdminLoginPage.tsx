import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/shared/hooks';
import { MESSAGES } from '@/constants';
import { validateEmail, validatePassword } from '@/utils/validators';
import { rateLimiter, InputSanitizer } from '@/utils';

export const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
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

    const rateLimitKey = `admin-login:${email}`;
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
      rateLimiter.reset(rateLimitKey);
      navigate(from, { replace: true });
    } catch {
      setError(MESSAGES.ERRORS.INVALID_CREDENTIALS);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 items-stretch">
          <div className="flex w-full flex-wrap">
            {/* Login Form Section */}
            <div className="flex w-full flex-col items-center justify-center p-6 lg:w-3/5 lg:p-12">
              <div className="flex w-full max-w-md flex-col items-start gap-6">
                {/* Logo */}
                <div className="mb-4">
                  <a className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white" href="#">
                    <span className="material-symbols-outlined text-primary text-3xl">store</span>
                    <span>BrandDash</span>
                  </a>
                </div>

                {/* Header */}
                <div className="layout-content-container flex w-full flex-col">
                  <h1 className="text-[#111318] tracking-light text-[32px] font-bold leading-tight text-left dark:text-white">
                    Bem-vindo de volta
                  </h1>
                  <p className="text-[#636f88] text-base font-normal leading-normal pt-1 dark:text-gray-400">
                    Acesse o painel de controle do seu e-commerce.
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="w-full p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
                  {/* Email Field */}
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-[#111318] text-base font-medium leading-normal pb-2 dark:text-gray-300">
                      E-mail
                    </p>
                    <div className="flex w-full flex-1 items-stretch rounded-lg">
                      <input
                        className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111318] focus:outline-0 focus:ring-2 focus:ring-primary/50 border ${
                          fieldErrors.email ? 'border-red-500' : 'border-[#dcdfe5]'
                        } bg-white focus:border-primary h-14 placeholder:text-[#636f88] p-[15px] pr-2 text-base font-normal leading-normal dark:bg-background-dark dark:border-gray-700 dark:text-white dark:placeholder-gray-500`}
                        placeholder="seuemail@exemplo.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(InputSanitizer.sanitizeEmail(e.target.value))}
                        disabled={loading}
                      />
                    </div>
                    {fieldErrors.email && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{fieldErrors.email}</p>
                    )}
                  </label>

                  {/* Password Field */}
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-[#111318] text-base font-medium leading-normal pb-2 dark:text-gray-300">
                      Senha
                    </p>
                    <div className="flex w-full flex-1 items-stretch rounded-lg">
                      <input
                        className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111318] focus:outline-0 focus:ring-2 focus:ring-primary/50 border ${
                          fieldErrors.password ? 'border-red-500' : 'border-[#dcdfe5]'
                        } bg-white focus:border-primary h-14 placeholder:text-[#636f88] p-[15px] text-base font-normal leading-normal rounded-r-none border-r-0 pr-2 dark:bg-background-dark dark:border-gray-700 dark:text-white dark:placeholder-gray-500`}
                        placeholder="••••••••"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        aria-label="Toggle password visibility"
                        className="text-[#636f88] flex border border-[#dcdfe5] bg-white items-center justify-center px-[15px] rounded-r-lg border-l-0 hover:bg-gray-50 dark:bg-background-dark dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <span className="material-symbols-outlined">
                          {showPassword ? 'visibility' : 'visibility_off'}
                        </span>
                      </button>
                    </div>
                    {fieldErrors.password && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{fieldErrors.password}</p>
                    )}
                  </label>

                  {/* Forgot Password Link */}
                  <div className="flex w-full items-center justify-between">
                    <div></div>
                    <a className="text-sm font-medium text-primary hover:underline" href="#">
                      Esqueceu sua senha?
                    </a>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-lg bg-primary px-6 py-4 text-base font-bold text-white transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{loading ? 'Entrando...' : 'Entrar'}</span>
                  </button>

                  {/* Divider */}
                  <div className="flex w-full items-center gap-4">
                    <hr className="w-full border-gray-300 dark:border-gray-700" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">OU</span>
                    <hr className="w-full border-gray-300 dark:border-gray-700" />
                  </div>

                  {/* Google Login Button */}
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:bg-background-dark dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <svg className="h-6 w-6" height="100" viewBox="0 0 48 48" width="100" xmlns="http://www.w3.org/2000/svg">
                      <path d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" fill="#FFC107" />
                      <path d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" fill="#FF3D00" />
                      <path d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" fill="#4CAF50" />
                      <path d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.012,35.426,44,30.038,44,24C44,22.659,43.862,21.35,43.611,20.083z" fill="#1976D2" />
                    </svg>
                    <span>Entrar com Google</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Image Section - Hidden on mobile */}
            <div className="hidden w-2/5 flex-1 lg:flex">
              <div
                className="h-full w-full bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCIhgYhUt5mLQAgSpE6_zuXiMnbqqnTx8XQCsePmbrMWU6d8M3b4qEYrK3gmeyiqtHikazfTjUdeivjbGehRhuNqnysXAHQBb9m9_Bt16tm-oSRiGfBRSj8GRVFig1XIF-mh4mJWFmoBBVZwvQYA1QLftgUOgjWEknDyD96juf-owz3-i09abAGFPYBPROhteSnUQ7mKkuyvoP1D3eHF_R3LT_HqXHXsWx7yxDg2pmlmZ_aQdEc9AfSkLMAzDZTcOAdZqORz1Abh-I")',
                }}
                data-alt="Close-up of a well-dressed man, focusing on the texture of a dark suit jacket and crisp white shirt."
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
