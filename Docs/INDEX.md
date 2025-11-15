# 📚 Índice de Documentação

> Guias e documentação para entender e trabalhar com o projeto

---

## 🚀 Início Rápido

👉 **[README.md](../README.md)** — Visão geral do projeto e como começar

---

## 🏗️ Arquitetura & Estrutura

### 📖 Leitura Obrigatória

| Documento | Descrição |
|-----------|-----------|
| **[SETUP_MULTIPLOS_BUILDS.md](../SETUP_MULTIPLOS_BUILDS.md)** | Como funciona a configuração de dois builds (Loja + Admin) |
| **[MIGRACAO_PASTAS.md](../MIGRACAO_PASTAS.md)** | Guia para reorganizar arquivos existentes |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | Arquitetura detalhada e padrões do projeto |

---

## 🛠️ Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev:client          # Dev loja (5173)
npm run dev:admin           # Dev admin (5174)

# Build
npm run build:client        # Build loja
npm run build:admin         # Build admin
npm run build:all           # Build tudo

# Verificação
npm run lint                # ESLint check
```

### Estrutura de Pastas

```
src/
├── client/              # App Loja
├── admin/               # App Admin
├── features/            # Features compartilhadas
├── shared/              # Componentes e hooks compartilhados
├── core/                # Contextos globais
├── services/            # APIs e Storage
├── types/               # TypeScript types
├── constants/           # Constantes
├── utils/               # Utilitários
├── config/              # Configurações
└── index.css            # Estilos globais
```

---

## 🎯 Guias de Tarefa

### Adicionar Nova Feature

1. Criar pasta: `src/features/minha-feature/`
2. Estrutura:
   ```
   minha-feature/
   ├── pages/
   ├── components/
   ├── hooks/
   ├── services/
   └── index.ts
   ```
3. Exportar no `index.ts`
4. Importar em `src/client/App.tsx` ou `src/admin/App.tsx`

### Adicionar Novo Componente UI

1. Criar em: `src/shared/components/ui/MeuComponente.tsx`
2. Adicionar ao: `src/shared/components/ui/index.ts`
3. Usar em qualquer lugar: `import { MeuComponente } from '@/shared/components/ui'`

### Adicionar Validador

1. Criar em: `src/utils/validators/meuValidador.ts`
2. Exportar do: `src/utils/index.ts`
3. Usar: `import { meuValidador } from '@/utils'`

---

## 🔗 API & Integração

### Endpoints REST

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/auth/login` | POST | Login de usuário |
| `/api/auth/register` | POST | Registrar novo usuário |
| `/api/products` | GET | Listar produtos |
| `/api/orders` | GET | Listar pedidos |
| `/api/payments/intent` | POST | Criar PaymentIntent |
| `/api/payments/process` | POST | Processar pagamento |

### Autenticação

```tsx
import { useAuth } from '@/shared/hooks';

const Component = () => {
  const { user, login, logout, isAuthenticated } = useAuth();
  return <div>{user?.email}</div>;
};
```

### Variáveis de Ambiente

Arquivo: `.env.local` (baseado em `.env.example`)

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_ENV=development
```

---

## 🎨 Design System

### Componentes Disponíveis

- **Button** — Botão com variantes
- **Input** — Campo de entrada
- **Card** — Container de conteúdo
- **Container** — Layout centralizado
- **Badge** — Selo/Tag
- **Navbar** — Barra de navegação
- **Footer** — Rodapé

### Tailwind CSS

- Versão 4+
- Dark mode habilitado
- Sem CSS local
- Apenas classes utilitárias

---

## 🔐 Segurança

- ✅ JWT em cookies HttpOnly
- ✅ CSRF protection via headers
- ✅ Validação de entrada
- ✅ Sanitização de HTML (DOMPurify)
- ✅ Rate limiting
- ✅ Erro handling centralizado

---

## ❓ FAQ

**P: Como rodar loja e admin simultaneamente?**  
R: Abra dois terminais:
```bash
# Terminal 1
npm run dev:client

# Terminal 2
npm run dev:admin
```

**P: Como compartilhar código entre loja e admin?**  
R: Use as pastas `features/`, `shared/`, `core/`, `services/`, etc.

**P: Como fazer deploy?**  
R: Build individual:
```bash
npm run build:client    # Deploy em loja.com
npm run build:admin     # Deploy em admin.loja.com
```

**P: Posso ter contextos diferentes?**  
R: Sim, crie em `src/client/contexts/` ou `src/admin/contexts/` se precisar.

---

## 📞 Contato & Suporte

Para dúvidas sobre:
- **Arquitetura** → Veja `ARCHITECTURE.md`
- **Setup** → Veja `SETUP_MULTIPLOS_BUILDS.md`
- **Migração** → Veja `MIGRACAO_PASTAS.md`

---

**Última atualização:** 14/11/2025
