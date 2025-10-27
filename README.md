# 🛍️ Frontend - Projeto Fullstack Loja


## 📋 O que é este projeto?

Este é o frontend de uma **aplicação de e-commerce de roupas** construída com **React 18 + TypeScript + Vite**.

A aplicação oferece:
- 🛒 Catálogo de produtos com filtros e busca
- 🛍️ Carrinho de compras funcional
- 👤 Autenticação e perfil de usuário
- 📦 Gerenciamento de pedidos
- 🏠 Página inicial responsiva
- 🌙 Suporte a tema claro/escuro

## 🎯 Estado Atual do Projeto

### ✅ Completo
- **Arquitetura Enterprise**: Estrutura escalável e manutenível
- **Type-Safe**: 100% TypeScript strict mode
- **Validações**: ESLint + TypeScript (0 erros)
- **Build**: Vite otimizado (5.00s)
- **Design System**: Biblioteca de componentes UI reutilizável
- **Styling**: Tailwind CSS v4 + Dark Mode
- **GraphQL**: Integração completa com Apollo Client
- **Autenticação**: Context API + JWT

### 🚀 Pronto para
- Integração com backend GraphQL
- Testes E2E
- Deploy em produção
- Expansão com novas features

## 🎨 O que foi feito

- ✅ Migração para Tailwind CSS (design clean e responsivo)
- ✅ Biblioteca de UI reutilizável (Button, Input, Card, Container, Badge)
- ✅ Refatoração completa para arquitetura feature-based
- ✅ Implementação de 6 features principais (auth, products, cart, profile, orders, home)
- ✅ Centralização de tipos, constantes e serviços
- ✅ Otimização de imports com path aliases (@/)
- ✅ Dark mode funcional

## 📁 Estrutura do Projeto

A aplicação segue um padrão **feature-based** com organização escalável:

```
src/
├── core/              # Contextos e lógica centralizada (Auth, Theme)
├── features/          # Features organizadas por domínio
│   ├── auth/         # Autenticação (Login, Register)
│   ├── products/     # Produtos (Listagem, Detalhe, Filtros)
│   ├── cart/         # Carrinho de compras
│   ├── profile/      # Perfil e endereços
│   ├── orders/       # Pedidos
│   └── home/         # Página inicial
├── shared/            # Código compartilhado
│   ├── components/    # UI base, layout, componentes comuns
│   └── hooks/         # Hooks customizados (useAuth, useTheme, etc)
├── services/          # Serviços (Apollo Client, Auth, Storage)
├── types/             # Tipos TypeScript organizados por domínio
├── constants/         # Constantes (mensagens, enums, API)
├── utils/             # Utilitários (validadores, formatadores)
├── graphql/           # Queries e mutations GraphQL
└── config/            # Configurações da aplicação
```

**Veja mais detalhes em:** [ARCHITECTURE.md](./Docs/ARCHITECTURE.md)

## 📦 Componentes UI Disponíveis

- **Button** — Botão com variantes (primary, secondary, danger, ghost) e tamanhos (sm, md, lg)
- **Input** — Input com label, validação e estilos de foco/erro
- **Card** — Card, CardBody, CardTitle para blocos de conteúdo
- **Container** — Container responsivo centralizado
- **Badge** — Badge/Selo com variantes
- **Label**, **Field**, **Separator** — Componentes auxiliares

## 🎨 Estilo e Padrões

- **Tailwind CSS v4** — Importado diretamente em `src/index.css`
- **Sem CSS local** — Preferimos classes utilitárias do Tailwind
- **Componentes reutilizáveis** — Use `Container` e componentes de `ui/` para consistência
- **Dark Mode** — Totalmente funcional via ThemeContext

## 💡 Exemplos Rápidos

### Button
```tsx
import { Button } from '@/ui/Button';

<Button>Comprar</Button>
<Button variant="secondary" size="sm">Detalhes</Button>
<Button variant="danger" className="w-full">Remover</Button>
```

### Card
```tsx
import { Card, CardBody, CardTitle } from '@/ui/Card';

<Card>
  <CardBody>
    <CardTitle>Título</CardTitle>
    <p>Conteúdo</p>
  </CardBody>
</Card>
```

### Input com Label e Erro
```tsx
import { Input } from '@/ui/Input';

<Input label="Email" type="email" name="email" />
<Input label="Senha" type="password" name="password" error="Campo obrigatório" />
```

### Hook de Autenticação
```tsx
import { useAuth } from '@/shared/hooks';

export const MyComponent = () => {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  return <div>{user?.name}</div>;
};
```

## 🔗 GraphQL e Autenticação

- **Cliente Apollo** — Configurado em `src/services/apollo-client.ts`
- **URL padrão** — `http://localhost:8080/graphql`
- **Token JWT** — Armazenado e lido de `localStorage` como `authToken`
- **Contexto** — `src/core/context/AuthProvider.tsx` (login, logout, isAuthenticated)
- **Queries** — Centralizadas em `src/graphql/queries.ts`

## 🚀 Como Rodar

### Windows (PowerShell)
```powershell
cd c:\Users\lucas\OneDrive\Desktop\projeto-fullstack_loja\projeto_loja_front
npm install
npm run dev
```

### Desenvolvimento
```bash
npm run dev      # Inicia servidor em http://localhost:5173
npm run lint     # Executa ESLint
npm run build    # Build de produção
```

## 📈 Como Evoluir o Projeto

### Adicionar Nova Feature
1. Criar `src/features/nova-feature/` com estrutura: `pages/`, `components/`, `hooks/`, `services/`
2. Criar componentes e hooks específicos da feature
3. Exportar tudo no `index.ts` da feature
4. Importar e usar em `App.tsx`

### Adicionar Novo Componente UI
1. Criar em `src/shared/components/ui/`
2. Adicionar ao `src/shared/components/ui/index.ts`
3. Usar em toda aplicação com `import { Novo } from '@/shared/components/ui'`

### Adicionar Validador
1. Criar em `src/utils/validators/`
2. Exportar do `src/utils/index.ts`
3. Usar: `import { validateEmail } from '@/utils'`

### Melhores Práticas
- ✅ Use path aliases `@/` ao invés de caminhos relativos
- ✅ Mantenha componentes pequenos e focados
- ✅ Centralize tipos em `src/types/domain/`
- ✅ Use TypeScript strict mode
- ✅ Escreva testes para lógica complexa
- ✅ Prefira composição sobre herança

## 🧪 Validações

```bash
# ESLint (0 erros)
npm run lint

# TypeScript (0 erros)
npm run build

# Tudo junto
npm run build && npm run lint
```

## 📊 Tecnologias Utilizadas

| Tech | Versão | Uso |
|------|--------|-----|
| React | 18+ | UI Framework |
| TypeScript | 5+ | Type Safety |
| Vite | 7+ | Build Tool |
| Apollo Client | 3+ | GraphQL Client |
| React Router | 6+ | Roteamento |
| Tailwind CSS | 4+ | Styling |
| CVA | Latest | Component Variants |

## 📝 Documentação Adicional

- **[ARCHITECTURE.md](./Docs/ARCHITECTURE.md)** — Estrutura detalhada do projeto
- **[PROJECT_STRUCTURE.md](./Docs/PROJECT_STRUCTURE.md)** — Árvore completa de diretórios

## ⚙️ Configurações Importantes

### TypeScript
- Modo strict habilitado
- Path aliases configurados (`@/` → `./src/`)
- Tipos organizados por domínio

### Vite
- Fast Refresh habilitado
- Otimizações para produção
- CSS modules + Tailwind

### Tailwind CSS
- v4 com import direto
- Dark mode funcional
- Sem CSS local

