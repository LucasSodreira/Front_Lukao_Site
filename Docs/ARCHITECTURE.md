# Estrutura do Projeto Frontend - Padrões Empresariais

Este documento descreve a arquitetura e organização do projeto frontend seguindo padrões profissionais de nível empresarial.

## 📁 Estrutura de Diretórios

```
src/
├── core/                      # Núcleo da aplicação
│   ├── context/              # Contextos React globais
│   │   ├── AuthContext.tsx   # Provider de autenticação
│   │   ├── auth-context.ts   # Definição do contexto
│   │   ├── ThemeContext.tsx  # Provider de tema
│   │   └── theme.ts          # Definição do contexto de tema
│   └── providers/            # Provedores customizados
│
├── features/                  # Módulos/Features da aplicação (organizados por domínio)
│   ├── auth/                 # Feature de autenticação
│   │   ├── components/       # Componentes da feature
│   │   ├── hooks/            # Hooks específicos da feature
│   │   └── services/         # Serviços da feature
│   ├── products/             # Feature de produtos
│   ├── cart/                 # Feature de carrinho
│   ├── profile/              # Feature de perfil
│   ├── orders/               # Feature de pedidos
│   └── home/                 # Feature home
│
├── shared/                    # Recursos compartilhados entre features
│   ├── components/           # Componentes reutilizáveis
│   │   ├── common/          # Componentes comuns (Modal, Alert, etc)
│   │   ├── layout/          # Componentes de layout (Navbar, Footer, etc)
│   │   └── ui/              # Componentes UI base (Button, Input, etc)
│   └── hooks/               # Hooks customizados compartilhados
│       ├── useAuth.ts
│       ├── useTheme.ts
│       ├── useForm.ts
│       └── useAsync.ts
│
├── config/                    # Configurações da aplicação
│   ├── environment.ts        # Variáveis de ambiente
│   └── index.ts
│
├── constants/                 # Constantes da aplicação
│   ├── api.ts                # Constantes de API
│   ├── messages.ts           # Mensagens padrão
│   ├── enums.ts              # Enums e tipos constantes
│   ├── pagination.ts         # Configurações de paginação
│   └── index.ts
│
├── services/                  # Serviços da aplicação
│   ├── apollo-client.ts      # Configuração do Apollo Client
│   ├── auth.service.ts       # Serviço de autenticação
│   ├── storage.service.ts    # Serviço de armazenamento local
│   └── index.ts
│
├── repositories/             # Camada de dados (GraphQL queries)
│   └── (será preenchido conforme necessário)
│
├── types/                     # Tipos TypeScript organizados por domínio
│   ├── domain/               # Tipos de domínio
│   │   ├── user.ts
│   │   ├── product.ts
│   │   ├── cart.ts
│   │   ├── order.ts
│   │   ├── address.ts
│   │   └── index.ts
│   ├── api/                  # Tipos de API
│   │   └── index.ts
│   └── index.ts
│
├── utils/                     # Utilitários gerais
│   ├── formatters/           # Formatadores de dados
│   ├── validators/           # Validadores
│   ├── guards/               # Type guards
│   └── index.ts
│
├── graphql/                   # Queries e mutations do GraphQL
│   ├── client.ts
│   ├── queries.ts
│   └── (será mantido no lugar)
│
├── pages/                     # Páginas/Rotas principais
│   └── (será mantido no lugar)
│
├── assets/                    # Arquivos estáticos
│
├── App.tsx                    # Componente raiz
├── main.tsx                   # Ponto de entrada
└── index.css                  # Estilos globais
```

## 🎯 Princípios Arquiteturais

### 1. **Separation of Concerns**
- Cada camada tem responsabilidade clara
- Features são independentes e reutilizáveis
- Serviços gerenciam lógica de negócio

### 2. **Feature-Based Organization**
- Cada feature (auth, products, etc) é um módulo independente
- Facilita manutenção e escalabilidade
- Permite desenvolvimento paralelo

### 3. **Shared Resources**
- Componentes reutilizáveis em `shared/`
- Hooks customizados compartilhados
- Tipos e constantes centralizadas

### 4. **Type Safety**
- TypeScript strict mode
- Tipos organizados por domínio
- Type guards para validação em runtime

## 📦 Convenções de Naming

### Componentes React
```typescript
// PascalCase para componentes
export const ProductCard: React.FC<Props> = ({ product }) => {
  // ...
};
```

### Funções e Variáveis
```typescript
// camelCase para funções e variáveis
export const formatCurrency = (value: number) => { };
const userPreferences = { };
```

### Tipos e Interfaces
```typescript
// PascalCase para tipos
interface UserPreferences {
  theme: Theme;
  language: Language;
}

type ProductSort = 'asc' | 'desc';
```

### Constantes
```typescript
// UPPER_SNAKE_CASE para constantes
export const API_TIMEOUT = 30000;
export const STORAGE_KEYS = { AUTH_TOKEN: 'authToken' };
```

## 🔄 Fluxo de Dados

```
UI (Components)
    ↓
Hooks (useAuth, useTheme, useForm)
    ↓
Services (AuthService, StorageService)
    ↓
Apollo Client / LocalStorage / API
```

## 🛠️ Como Adicionar uma Nova Feature

### 1. Criar estrutura de pastas
```bash
src/features/nova-feature/
├── components/
├── hooks/
└── services/
```

### 2. Criar componentes
```typescript
// src/features/nova-feature/components/NovoComponente.tsx
export const NovoComponente: React.FC<Props> = (props) => {
  // ...
};
```

### 3. Criar hooks se necessário
```typescript
// src/features/nova-feature/hooks/useNovaFeature.ts
export const useNovaFeature = () => {
  // ...
};
```

### 4. Criar serviços se necessário
```typescript
// src/features/nova-feature/services/novaFeature.service.ts
export const novaFeatureService = { };
```

### 5. Exportar do index
```typescript
// src/features/nova-feature/index.ts
export * from './components';
export * from './hooks';
export * from './services';
```

## 📚 Importações Recomendadas

```typescript
// ✅ Bom - usando path aliases
import { useAuth } from '@/shared/hooks';
import { MESSAGES } from '@/constants';
import type { User } from '@/types';

// ❌ Evitar - imports relativos longos
import { useAuth } from '../../../shared/hooks';
```

## 🔐 Autenticação

```typescript
import { useAuth, useIsAuthenticated } from '@/shared/hooks';

export const MyComponent = () => {
  const { user, login, logout } = useAuth();
  const isAuthenticated = useIsAuthenticated();

  // ...
};
```

## 🎨 Tema

```typescript
import { useTheme, useIsDarkMode } from '@/shared/hooks';

export const MyComponent = () => {
  const { theme, toggleTheme, setTheme } = useTheme();
  const isDark = useIsDarkMode();

  // ...
};
```

## 💾 Armazenamento Local

```typescript
import { storageService } from '@/services';

// Salvar
storageService.setItem('key', value);

// Recuperar
const value = storageService.getItem('key');

// Com valor padrão
const value = storageService.getItem('key', defaultValue);
```

## 🔄 Formulários

```typescript
import { useForm } from '@/shared/hooks';

export const MyForm = () => {
  const [state, handlers, handleSubmit] = useForm(
    { email: '', password: '' },
    async (values) => {
      // Submit logic
    }
  );

  // ...
};
```

## ✅ Validação

```typescript
import { validateEmail, validatePassword } from '@/utils/validators';
import { isUser, isProduct } from '@/utils/guards';

// Validadores
if (!validateEmail(email)) {
  // invalid email
}

// Type guards
if (isUser(data)) {
  // data is User
}
```

## 📝 Formatação

```typescript
import { formatCurrency, formatDate } from '@/utils/formatters';

const price = formatCurrency(100); // R$ 100,00
const date = formatDate('2024-01-01'); // 01/01/2024
```

## 🚀 Performance

- Lazy loading de componentes por feature
- Code splitting automático via Vite
- React.memo para componentes puros
- useMemo e useCallback conforme necessário

## 📊 Monitoramento

- Usar console durante desenvolvimento
- Em produção, considerar serviço de logging
- Rastrear erros de autenticação
- Monitorar performance de queries GraphQL

## 🔗 Links Úteis

- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [React Design Patterns](https://reactpatterns.com/)
- [Apollo Client Docs](https://www.apollographql.com/docs/react/)
- [Vite Guide](https://vitejs.dev/guide/)
