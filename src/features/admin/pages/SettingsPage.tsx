import React, { useCallback, useEffect, useState } from 'react';
import Sidebar from '@/features/admin/components/Sidebar';
import Header from '@/features/admin/components/Header';
import { Container } from '@/ui/Container';
import { Input } from '@/ui/Input';
import { adminSettingsService, type StoreSettingsDto } from '@/services/admin-settings.service';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'integrations' | 'security'>('general');
  const [settings, setSettings] = useState<StoreSettingsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await adminSettingsService.getSettings();
      setSettings(data);
    } catch {
      setSettings(null);
      setErrorMessage('Não foi possível carregar as configurações. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const handleInputChange = <K extends keyof StoreSettingsDto>(field: K, value: StoreSettingsDto[K]) => {
    setSettings((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    setSaveMessage('');
    setErrorMessage('');

    try {
      const updated = await adminSettingsService.updateSettings(settings);
      setSettings(updated);
      setSaveMessage('Configurações salvas com sucesso!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch {
      setErrorMessage('Erro ao salvar configurações. Verifique os campos obrigatórios e tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderLoadingState = () => (
    <div className="bg-white rounded-lg border p-8 text-center text-gray-500">
      Carregando configurações...
    </div>
  );

  const renderEmptyState = () => (
    <div className="bg-white rounded-lg border p-8 text-center">
      <p className="text-gray-600 mb-4">{errorMessage || 'Não encontramos as configurações da loja.'}</p>
      <button
        onClick={() => void loadSettings()}
        className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90"
      >
        Tentar novamente
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="relative flex min-h-screen w-full">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <Container>
            <Header />
            {renderLoadingState()}
          </Container>
        </main>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="relative flex min-h-screen w-full">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <Container>
            <Header />
            {renderEmptyState()}
          </Container>
        </main>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <Container>
          <Header />

          <div className="mb-6">
            <h1 className="text-3xl font-black">Configurações</h1>
            <p className="text-sm text-gray-500">Gerencie configurações do painel e integrações.</p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-4 rounded-lg text-sm font-medium bg-red-50 text-red-700 border border-red-200">
              {errorMessage}
            </div>
          )}

          {saveMessage && (
            <div className="mb-4 p-4 rounded-lg text-sm font-medium bg-green-50 text-green-700 border border-green-200">
              {saveMessage}
            </div>
          )}

          <div className="flex gap-0 border-b mb-6 bg-white rounded-t-lg">
            {(['general', 'notifications', 'integrations', 'security'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'general' && 'Geral'}
                {tab === 'notifications' && 'Notificações'}
                {tab === 'integrations' && 'Integrações'}
                {tab === 'security' && 'Segurança'}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-b-lg border border-t-0 p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Nome da Loja</label>
                    <Input
                      type="text"
                      value={settings.storeName}
                      onChange={(e) => handleInputChange('storeName', e.target.value)}
                      placeholder="Nome da sua loja"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">E-mail Principal</label>
                    <Input
                      type="email"
                      value={settings.storeEmail}
                      onChange={(e) => handleInputChange('storeEmail', e.target.value)}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Telefone</label>
                    <Input
                      type="tel"
                      value={settings.storePhone ?? ''}
                      onChange={(e) => handleInputChange('storePhone', e.target.value)}
                      placeholder="(11) 0000-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">E-mail de Suporte</label>
                    <Input
                      type="email"
                      value={settings.supportEmail ?? ''}
                      onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                      placeholder="suporte@example.com"
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-bold mb-4">Configurações Regionais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Moeda</label>
                      <select
                        value={settings.currency}
                        onChange={(e) => handleInputChange('currency', e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="BRL">Real (R$)</option>
                        <option value="USD">Dólar ($)
                        </option>
                        <option value="EUR">Euro (€)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Idioma</label>
                      <select
                        value={settings.language}
                        onChange={(e) => handleInputChange('language', e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="pt-BR">Português (Brasil)</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Fuso Horário</label>
                      <select
                        value={settings.timezone}
                        onChange={(e) => handleInputChange('timezone', e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="America/Sao_Paulo">Brasília (UTC-3)</option>
                        <option value="America/Manaus">Manaus (UTC-4)</option>
                        <option value="America/Anchorage">UTC-5</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-bold mb-4">SEO</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Título SEO</label>
                      <Input
                        type="text"
                        value={settings.seoTitle ?? ''}
                        onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                        placeholder="Título para SEO"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Descrição SEO</label>
                      <textarea
                        value={settings.seoDescription ?? ''}
                        onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                        placeholder="Descrição para SEO"
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6 flex items-center justify-between">
                  <div>
                    <label className="font-semibold flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.maintenanceMode}
                        onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
                        className="rounded"
                      />
                      Modo de Manutenção
                    </label>
                    <p className="text-sm text-gray-500 mt-1">A loja não será acessível pelos clientes</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.notificationsEnabled}
                      onChange={(e) => handleInputChange('notificationsEnabled', e.target.checked)}
                      className="rounded"
                    />
                    <span className="font-semibold">Ativar Notificações</span>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                      className="rounded"
                    />
                    <span className="font-semibold">Notificações por E-mail</span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <p className="text-gray-500">Configure integrações com serviços de terceiros.</p>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-gray-600">Nenhuma integração configurada.</p>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <p className="text-gray-500">Configure opções de segurança da loja.</p>
                <div className="space-y-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.maintenanceMode}
                      onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
                      className="rounded"
                    />
                    <span className="font-semibold">Modo de Manutenção Ativado</span>
                  </label>
                </div>
              </div>
            )}

            <div className="border-t mt-8 pt-6 flex justify-end gap-3">
              <button
                onClick={() => void loadSettings()}
                disabled={isSaving}
                className="px-6 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => void handleSave()}
                disabled={isSaving}
                className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
              >
                {isSaving ? 'Salvando...' : 'Salvar Configurações'}
              </button>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
};

export default SettingsPage;