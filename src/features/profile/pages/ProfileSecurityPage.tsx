import { useState, useEffect } from 'react';
import type { ChangePasswordRequest, UserSession, UserDevice } from '@/services/user.service';
import { userService } from '@/services/user.service';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';

const SecurityPage = () => {
  // Password Change State
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState<ChangePasswordRequest>({
    currentPassword: '',
    newPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // 2FA State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const [twoFactorError, setTwoFactorError] = useState<string | null>(null);

  // Sessions State
  const [sessions, setSessions] = useState<UserSession | null>(null);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionsError, setSessionsError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      setSessionsLoading(true);
      const [is2FAEnabled, sessionsData] = await Promise.all([
        userService.isTwoFactorEnabled(),
        userService.getSessions(),
      ]);
      setTwoFactorEnabled(is2FAEnabled);
      setSessions(sessionsData);
    } catch {
      setSessionsError('Erro ao carregar dados de segurança');
    } finally {
      setSessionsLoading(false);
    }
  };

  // Password Change Handlers
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value,
    }));
    setPasswordError(null);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(false);

    try {
      await userService.changePassword(passwordForm);
      setPasswordSuccess(true);
      setPasswordForm({ currentPassword: '', newPassword: '' });
      setShowPasswordForm(false);

      setTimeout(() => {
        setPasswordSuccess(false);
      }, 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao alterar senha';
      setPasswordError(message);
    } finally {
      setPasswordLoading(false);
    }
  };

  // 2FA Handlers
  const handleToggle2FA = async () => {
    setTwoFactorLoading(true);
    setTwoFactorError(null);

    try {
      if (twoFactorEnabled) {
        await userService.disableTwoFactor();
      } else {
        await userService.enableTwoFactor();
      }
      setTwoFactorEnabled(!twoFactorEnabled);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar autenticação de dois fatores';
      setTwoFactorError(message);
    } finally {
      setTwoFactorLoading(false);
    }
  };

  // Device Handlers
  const handleDisconnectDevice = async (deviceId: string) => {
    try {
      await userService.disconnectDevice(deviceId);
      await loadSecurityData();
    } catch {
      setSessionsError('Erro ao desconectar dispositivo');
    }
  };

  const handleDisconnectAllDevices = async () => {
    if (!window.confirm('Tem certeza? Você será desconectado de todos os dispositivos.')) {
      return;
    }

    try {
      await userService.disconnectAllDevices();
      await loadSecurityData();
    } catch {
      setSessionsError('Erro ao desconectar todos os dispositivos');
    }
  };

  const getDeviceIcon = (device: UserDevice) => {
    const type = device.type?.toLowerCase() || 'desktop';
    const iconMap: Record<string, string> = {
      desktop: 'desktop_windows',
      mobile: 'phone_iphone',
      tablet: 'tablet_mac',
    };
    return iconMap[type] || 'devices';
  };

  return (
    <div className="space-y-10">
      {/* Senha */}
      <div className="p-6 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Senha</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Para sua segurança, recomendamos que você escolha uma senha forte e a atualize regularmente.
            </p>
          </div>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="mt-4 sm:mt-0 shrink-0 flex h-12 items-center justify-center gap-x-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 text-base font-bold text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Alterar Senha
          </button>
        </div>

        {showPasswordForm && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {passwordError && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 text-sm">
                  Senha alterada com sucesso!
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-white mb-2">
                  Senha Atual
                </label>
                <Input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Digite sua senha atual"
                  disabled={passwordLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-white mb-2">
                  Nova Senha
                </label>
                <Input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Digite sua nova senha"
                  disabled={passwordLoading}
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordForm({ currentPassword: '', newPassword: '' });
                    setPasswordError(null);
                  }}
                  className="flex h-10 items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 text-sm font-bold text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  disabled={passwordLoading}
                >
                  Cancelar
                </button>
                <Button
                  type="submit"
                  disabled={passwordLoading || !passwordForm.currentPassword || !passwordForm.newPassword}
                  className="bg-primary hover:bg-primary/90"
                >
                  {passwordLoading ? 'Alterando...' : 'Confirmar Alteração'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Autenticação de Dois Fatores */}
      <div className="p-6 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              Autenticação de Dois Fatores
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Adicione uma camada extra de segurança à sua conta exigindo um código de verificação ao fazer login.
            </p>
            {twoFactorError && (
              <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                {twoFactorError}
              </div>
            )}
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-4">
            <span
              className={`text-sm font-medium ${
                twoFactorEnabled
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {twoFactorEnabled ? 'Ativado' : 'Desativado'}
            </span>
            <button
              onClick={handleToggle2FA}
              disabled={twoFactorLoading}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-background-dark disabled:opacity-50 ${
                twoFactorEnabled
                  ? 'bg-primary focus:ring-primary'
                  : 'bg-gray-300 dark:bg-gray-600 focus:ring-gray-400'
              }`}
            >
              <span className="sr-only">Ativar autenticação de dois fatores</span>
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Dispositivos Conectados */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">Dispositivos Conectados</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
          Aqui está uma lista de dispositivos que acessaram sua conta. Desconecte qualquer dispositivo que você não reconheça.
        </p>

        {sessionsError && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm mb-6">
            {sessionsError}
          </div>
        )}

        {sessionsLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : sessions && sessions.devices.length > 0 ? (
          <>
            <div className="divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {sessions.devices.map((device) => (
                <div key={device.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-3xl text-gray-500 dark:text-gray-400">
                      {getDeviceIcon(device)}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {device.browser && device.os
                          ? `${device.os} - ${device.browser}`
                          : device.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {device.location || device.ipAddress}
                        {device.isCurrentSession && (
                          <span className="text-green-600 dark:text-green-400 ml-2 font-medium">
                            Sessão atual
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  {!device.isCurrentSession && (
                    <button
                      onClick={() => handleDisconnectDevice(device.id)}
                      className="text-sm font-bold text-primary hover:underline transition-colors"
                    >
                      Desconectar
                    </button>
                  )}
                </div>
              ))}
            </div>

            {sessions.devices.length > 1 && (
              <button
                onClick={handleDisconnectAllDevices}
                className="mt-4 text-sm font-bold text-red-600 dark:text-red-400 hover:underline transition-colors"
              >
                Desconectar de todos os dispositivos
              </button>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">
            Nenhum dispositivo conectado
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityPage;
