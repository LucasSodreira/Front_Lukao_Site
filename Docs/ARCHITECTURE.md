# 🏗️ Arquitetura do Projeto Frontend


## 📋 Visão Geral

Este é um **frontend de e-commerce** construído com **React 18 + TypeScript + Vite**, seguindo padrões de arquitetura profissional:

- **Feature-Based Organization** — Organizado por domínio de negócio
- **Enterprise Architecture** — Escalável, mantível e testável
- **Type-Safe** — TypeScript strict mode em 100%
- **Component-Driven** — Design system centralizado
- **Modular** — Features independentes e reutilizáveis

## 🎯 Princípios Arquiteturais

### 1. Separation of Concerns (SoC)
Cada camada tem responsabilidade clara:
- **UI Layer** — Componentes React
- **Logic Layer** — Hooks, services, state management
- **Data Layer** — Apollo Client, GraphQL
- **Cross-Cutting** — Utils, validators, formatters

### 2. Feature-Based Organization
Código organizando por **domínio de negócio** (features) ao invés de tipos de arquivo:

```
❌ Evitar (Anti-pattern)
src/
├── components/    # Mistura todos os componentes
├── pages/        # Mistura todas as páginas
├── hooks/        # Mistura todos os hooks
└── services/     # Mistura todos os serviços

✅ Preferir (Feature-Based)
src/features/
├── auth/         # Feature de autenticação
├── products/     # Feature de produtos
├── cart/         # Feature de carrinho
└── profile/      # Feature de perfil
```

**Benefícios:**
- Mais fácil encontrar código relacionado
- Features podem ser desenvolvidas em paralelo
- Remoção de features é trivial
- Escalabilidade melhorada

### 3. Shared Resources
Código compartilhado entre features centralizado em `src/shared/`:
- Componentes UI reutilizáveis
- Hooks customizados
- Tipos compartilhados
- Utilitários gerais

### 4. Type Safety
- TypeScript **strict mode** habilitado
- Tipos organizados por domínio
- Type guards para validação em runtime
- 100% de coverage esperado

## 📁 Estrutura Detalhada

```
src/
├── core/
│   └── context/
│       ├── AuthContext.ts          # Context definition (read-only)
│       ├── AuthProvider.tsx        # Provider component with logic
│       ├── ThemeContext.tsx        # Theme provider
│       ├── theme.ts                # Theme configurations
│       └── index.ts
│
├── features/                        # ⭐ Módulos/Features por domínio
│   ├── auth/                       # Autenticação
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── index.ts
│   │   ├── components/
│   │   ├── hooks/
│   │   └── index.ts
│   │
│   ├── products/                   # Produtos
│   │   ├── pages/
│   │   │   ├── ProductsPage.tsx
│   │   │   ├── ProductDetailPage.tsx
│   │   │   └── index.ts
│   │   ├── components/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── FilterSidebar.tsx
│   │   │   ├── ActiveFilters.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useFilters.ts
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   ├── products.service.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── cart/                       # Carrinho
│   │   ├── pages/
│   │   │   ├── CartPage.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── profile/                    # Perfil
│   │   ├── pages/
│   │   │   ├── ProfilePage.tsx
│   │   │   └── index.ts
│   │   ├── components/
│   │   │   ├── AddressList.tsx
│   │   │   ├── AddressModal.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── orders/                     # Pedidos
│   │   ├── pages/
│   │   │   ├── OrdersPage.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── home/                       # Home
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   └── index.ts
│
├── shared/                         # ⭐ Código compartilhado
│   ├── components/
│   │   ├── ui/                    # Design system
│   │   │   ├── button.tsx
│   │   │   ├── button.variants.ts
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── field.tsx
│   │   │   ├── label.tsx
│   │   │   ├── separator.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── layout/               # Layout components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── common/               # Componentes comuns
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── hooks/                     # Hooks compartilhados
│   │   ├── useAuth.ts
│   │   ├── useTheme.ts
│   │   ├── useForm.ts
│   │   ├── useAsync.ts
│   │   └── index.ts
│   │
│   └── index.ts
│
├── services/                       # ⭐ Serviços/APIs
│   ├── apollo-client.ts           # GraphQL client
│   ├── auth.service.ts            # Lógica de autenticação
│   ├── storage.service.ts         # LocalStorage wrapper
│   └── index.ts
│
├── types/                          # ⭐ Tipos TypeScript
│   ├── domain/                    # Tipos de negócio
│   │   ├── user.ts
│   │   ├── product.ts
│   │   ├── cart.ts
│   │   ├── order.ts
│   │   ├── address.ts
│   │   └── index.ts
│   ├── api/
│   │   └── index.ts
│   └── index.ts
│
├── utils/                          # ⭐ Utilitários
│   ├── validators/
│   │   └── index.ts
│   ├── formatters/
│   │   └── index.ts
│   ├── guards/
│   │   └── index.ts
│   ├── lib/
│   │   └── utils.ts
│   └── index.ts
│
├── constants/                      # ⭐ Constantes
│   ├── messages.ts                # Mensagens
│   ├── pagination.ts              # Paginação
│   ├── enums.ts                   # Enumerações
│   ├── api.ts                     # URLs/Endpoints
│   └── index.ts
│
├── graphql/                        # ⭐ GraphQL
│   ├── client.ts                  # Configuração Apollo
│   ├── queries.ts                 # Queries e Mutations
│   └── index.ts
│
├── config/                         # ⭐ Configurações
│   ├── environment.ts
│   └── index.ts
│
├── App.tsx                         # Componente raiz
├── main.tsx                        # Entry point
├── App.css                         # Estilos globais
├── index.css                       # Tailwind v4
└── vite-env.d.ts
```

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
Hooks (useAuth, useTheme, useProducts)
    ↓
Services (AuthService, StorageService)
    ↓
Apollo Client / GraphQL / LocalStorage
```

**Exemplo Prático:**
```typescript
// 1. Componente chama hook
const MyComponent = () => {
  const { user, login } = useAuth();
  return <button onClick={() => login(email, password)}>Login</button>;
};

// 2. Hook chama service
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  
  const login = async (email: string, password: string) => {
    const userData = await authService.login(email, password);
    setUser(userData);
  };
  
  return { user, login };
};

// 3. Service faz request GraphQL
export const authService = {
  login: async (email: string, password: string) => {
    const { data } = await apolloClient.mutate({
      mutation: LOGIN_MUTATION,
      variables: { email, password }
    });
    return data.login;
  }
};
```

## 🛠️ Como Adicionar uma Nova Feature

### 1. Estrutura Base
```bash
src/features/nova-feature/
├── pages/
│   ├── NovaFeaturePage.tsx
│   └── index.ts
├── components/
│   ├── NovoComponente.tsx
│   └── index.ts
├── hooks/
│   ├── useNovaFeature.ts
│   └── index.ts
├── services/
│   ├── novaFeature.service.ts
│   └── index.ts
└── index.ts
```

### 2. Implementar Componentes
```typescript
// src/features/nova-feature/components/NovoComponente.tsx
import type { Props } from './types';

export const NovoComponente: React.FC<Props> = ({ prop1 }) => {
  const { data } = useNovaFeature();
  
  return <div>{data}</div>;
};
```

### 3. Implementar Hooks
```typescript
// src/features/nova-feature/hooks/useNovaFeature.ts
export const useNovaFeature = () => {
  const { loading, data } = useQuery(NOVA_FEATURE_QUERY);
  return { loading, data };
};
```

### 4. Implementar Serviços
```typescript
// src/features/nova-feature/services/novaFeature.service.ts
export const novaFeatureService = {
  fetch: async () => { },
  create: async (data) => { },
};
```

### 5. Exportar Feature
```typescript
// src/features/nova-feature/index.ts
export { NovaFeaturePage } from './pages';
export * from './components';
export * from './hooks';
export * from './services';
```

### 6. Usar em App.tsx
```typescript
import { NovaFeaturePage } from '@/features/nova-feature';

export const App = () => {
  return (
    <Routes>
      <Route path="/nova-feature" element={<NovaFeaturePage />} />
    </Routes>
  );
};
```

## 🎨 Path Aliases

Configurados em `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Como Usar

```typescript
// ✅ Bom - Sempre usar aliases
import { Button } from '@/shared/components/ui';
import { useAuth } from '@/shared/hooks';
import type { Product } from '@/types/domain';
import { API_BASE_URL } from '@/constants';
import { validateEmail } from '@/utils/validators';

// ❌ Evitar - Caminhos relativos
import { Button } from '../../../shared/components/ui';
import { useAuth } from '../../../../shared/hooks';
```

## 📚 Padrões de Importação

## 📚 Padrões de Importação

```typescript
// ✅ Componentes
import { Button, Card, Input } from '@/shared/components/ui';
import { Navbar, Footer } from '@/shared/components/layout';
import { ErrorBoundary } from '@/shared/components/common';

// ✅ Hooks
import { useAuth, useTheme, useForm } from '@/shared/hooks';
import { useFilters } from '@/features/products/hooks';

// ✅ Tipos
import type { Product, Cart, User } from '@/types/domain';

// ✅ Constantes
import { MESSAGES, API_BASE_URL, STORAGE_KEYS } from '@/constants';

// ✅ Utilitários
import { formatCurrency, validateEmail, isUser } from '@/utils';

// ✅ Serviços
import { authService, storageService } from '@/services';

// ✅ GraphQL
import { GET_PRODUCTS, LOGIN_MUTATION } from '@/graphql/queries';
```

## 🔐 Autenticação

```typescript
import { useAuth } from '@/shared/hooks';

export const MyComponent = () => {
  const { user, login, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div>Faça login para continuar</div>;
  }

  return (
    <div>
      Bem-vindo, {user?.name}!
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

## 🎨 Tema (Dark Mode)

```typescript
import { useTheme } from '@/shared/hooks';

export const MyComponent = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      {isDark ? '☀️ Claro' : '🌙 Escuro'}
    </button>
  );
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

// Remover
storageService.removeItem('key');

// Limpar tudo
storageService.clear();
```

## � Formulários

```typescript
import { useForm } from '@/shared/hooks';

export const MyForm = () => {
  const [state, handlers, handleSubmit] = useForm(
    { email: '', password: '' },
    async (values) => {
      // Lógica de submit
      console.log(values);
    }
  );

  return (
    <form onSubmit={handleSubmit}>
      <input {...handlers.email} />
      <button type="submit">Enviar</button>
    </form>
  );
};
```

## ✅ Validação

```typescript
import { validateEmail, validatePassword } from '@/utils/validators';
import { isUser, isProduct } from '@/utils/guards';

// Validadores
if (!validateEmail(email)) {
  console.log('Email inválido');
}

// Type guards
if (isUser(data)) {
  // data é do tipo User
  console.log(data.email);
}
```

## � Formatação

```typescript
import { formatCurrency, formatDate, formatPhoneNumber } from '@/utils/formatters';

const price = formatCurrency(100);      // R$ 100,00
const date = formatDate('2024-01-01');  // 01/01/2024
const phone = formatPhoneNumber('11999999999'); // (11) 99999-9999
```

## 🚀 Performance

### Code Splitting
- Vite faz automatic code splitting por route
- Lazy loading de features é automático

### React.memo
```typescript
// Use para componentes puros
export const ProductCard = React.memo(({ product }: Props) => {
  return <div>{product.name}</div>;
});
```

### useMemo e useCallback
```typescript
// Memoize valores computados
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(prop);
}, [prop]);

// Memoize callbacks
const handleClick = useCallback(() => {
  doSomething();
}, []);
```

## 🧪 Type Guards
