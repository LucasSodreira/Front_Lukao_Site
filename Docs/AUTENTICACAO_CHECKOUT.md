# 🔐 Autenticação Obrigatória no Checkout

## ✅ Status: IMPLEMENTADO E ATIVO

Esta é a **versão OFICIAL e ÚNICA** do checkout. Não existe mais checkout anônimo.

## ✨ Arquitetura Atual

### Como Funciona Agora:

**Regra Única:**
- ✅ **Login é OBRIGATÓRIO** para fazer checkout
- ✅ Usuários sem login são **automaticamente redirecionados** para /login
- ✅ Após login/cadastro, usuário volta ao carrinho automaticamente
- ✅ Todos os pedidos ficam **vinculados ao usuário**
- ✅ Histórico completo disponível em /orders

### Não Existe Mais:
- ❌ Checkout anônimo (`guestCheckout`)
- ❌ Token de rastreamento público
- ❌ Pedidos sem usuário
- ❌ Modal de checkout para usuários deslogados

---

## 🔄 Fluxo de Compra (100% Autenticado)

```
1. Usuário DESLOGADO está navegando
   ↓
2. Adiciona produto ao carrinho ✓ (permitido sem login)
   ↓
3. Vai para /cart e vê o carrinho ✓
   ↓
4. Clica em "Finalizar Compra"
   ↓
5. 🔒 VERIFICAÇÃO DE AUTENTICAÇÃO (OBRIGATÓRIA)
   ├─ isAuthenticated = false
   └─ Redireciona AUTOMATICAMENTE para /login
        ├─ state: { from: '/cart' }
        └─ message: "Faça login para continuar com a compra"
             ↓
        ┌────┴────┐
        │         │
    LOGIN    CADASTRO
        │         │
        └────┬────┘
             ↓
   6. AuthContext atualiza: isAuthenticated = true ✅
             ↓
   7. Redireciona AUTOMATICAMENTE para state.from (/cart)
             ↓
   8. Usuário clica "Finalizar Compra" novamente
             ↓
   9. isAuthenticated = true → CheckoutModal abre ✅
      ├─ Dados do usuário PRÉ-CARREGADOS (nome, email, phone)
      ├─ Lista de endereços salvos disponível
      └─ Usuário seleciona endereço ou adiciona novo
             ↓
  10. Submete formulário → createOrder mutation 🔒
      ├─ JWT Token no header
      ├─ userId extraído do token
      └─ Pedido criado e vinculado ao usuário
             ↓
  11. Checkout com Stripe
             ↓
  12. Confirmação e histórico disponível em /orders 🔒
```

---

## 📝 Código Implementado

### Arquivo: `src/features/cart/pages/CartPage.tsx`

#### 1. Importar Hook de Autenticação e Mutations
```typescript
import { useAuth } from '@/shared/hooks';
import { useMutation } from '@apollo/client';
import { CREATE_ORDER, CREATE_PAYMENT_INTENT } from '@/graphql/checkoutQueries';

export const CartPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  const [createOrder] = useMutation(CREATE_ORDER);
  const [createPaymentIntent] = useMutation(CREATE_PAYMENT_INTENT);
  
  // ...
};
```

#### 2. Função de Verificação (OBRIGATÓRIA)
```typescript
const handleCheckoutClick = () => {
  // 🔒 VERIFICAÇÃO OBRIGATÓRIA
  if (!isAuthenticated) {
    // Redirecionar para login (SEMPRE)
    navigate('/login', { 
      state: { 
        from: '/cart',
        message: 'Faça login para continuar com a compra' 
      } 
    });
    return; // BLOQUEIA checkout sem login
  }
  
  // Só chega aqui se estiver autenticado ✅
  setIsCheckoutOpen(true);
};
```

#### 3. Botão com Verificação
```typescript
<Button 
  onClick={handleCheckoutClick} 
  className="flex-1"
  disabled={cart.items.length === 0}
>
  🔒 Finalizar Compra {!isAuthenticated && '(Login necessário)'}
</Button>
```

#### 4. CheckoutModal com Dados Pré-carregados
```typescript
{isCheckoutOpen && (
  <CheckoutModal
    isOpen={isCheckoutOpen}
    onClose={() => setIsCheckoutOpen(false)}
    onSubmit={handleCheckoutSubmit}
    user={user} // Dados pré-carregados 🔒
    cartTotal={cart.totalAmount}
    items={cart.items}
  />
)}
```

#### 5. Submeter Checkout (Autenticado)
```typescript
const handleCheckoutSubmit = async (data: CheckoutInput) => {
  try {
    // 1. Criar pedido (JWT no header automaticamente via Apollo)
    const { data: orderData } = await createOrder({
      variables: {
        input: {
          addressId: data.addressId,
          notes: data.notes
        }
      }
    });
    
    const orderId = orderData.createOrder.id;
    
    // 2. Criar Payment Intent
    const { data: paymentData } = await createPaymentIntent({
      variables: { orderId }
    });
    
    // 3. Navegar para página de pagamento
    navigate(`/checkout/${orderId}`, {
      state: {
        order: orderData.createOrder,
        clientSecret: paymentData.createPaymentIntent.clientSecret,
        paymentIntentId: paymentData.createPaymentIntent.paymentIntentId
      }
    });
  } catch (error) {
    console.error('Erro no checkout:', error);
    // Mostrar toast de erro
  }
};
```

---

## 🎯 Estados Possíveis

### Estado 1: Usuário Não Autenticado
```
└─ Clica "Finalizar Compra"
   ├─ isAuthenticated = false
   └─ Redireciona para /login
      ├─ Mostrar mensagem: "Faça login para continuar com a compra"
      └─ from: '/cart' (para retornar depois)
```

### Estado 2: Usuário Autenticado
```
└─ Clica "Finalizar Compra"
   ├─ isAuthenticated = true
   └─ Abre CheckoutModal
      ├─ Preenche dados
      └─ Continua compra normalmente
```

### Estado 3: Após Login/Cadastro
```
└─ Usuário faz login em /login
   └─ Redireciona para 'from' (/cart)
      └─ Carrinho ainda existe (preservado)
         └─ Pode clicar "Finalizar Compra" novamente
            └─ Abre CheckoutModal (agora autenticado)
```

---

## 🔗 Integração com LoginPage

### Exemplo de Retorno do Login

O LoginPage pode usar o `state.from` para retornar:

```typescript
// src/features/auth/pages/LoginPage.tsx

import { useNavigate, useLocation } from 'react-router-dom';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLoginSuccess = () => {
    // Voltar para onde veio, ou home se não vier de lugar nenhum
    const from = location.state?.from || '/';
    navigate(from);
  };
  
  return (
    // Seu formulário de login
  );
};
```

---


## 🎯 GraphQL Mutations Atualizadas


### ✅ Mutations Atuais (Todas Autenticadas):

#### 1. CREATE_ORDER (Substitui guestCheckout)
```graphql
mutation CreateOrder($input: CreateOrderInput!) {
  createOrder(input: $input) {
    id
    orderNumber
    status
    totalAmount
    shippingCost
    items {
      id
      productName
      quantity
      price
      totalPrice
    }
    shippingAddress {
      street
      city
      state
      zipCode
    }
    user {
      id
      name
      email
    }
    createdAt
  }
}

# Input:
{
  "input": {
    "addressId": "uuid-do-endereco-salvo",
    "notes": "Entregar no portão" # opcional
  }
}

# Headers:
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

#### 2. CREATE_PAYMENT_INTENT (Autenticado)
```graphql
mutation CreatePaymentIntent($orderId: ID!) {
  createPaymentIntent(orderId: $orderId) {
    clientSecret
    paymentIntentId
    amount
    currency
  }
}

# Headers:
{
  "Authorization": "Bearer <JWT_TOKEN>"
}

# Backend valida:
# - Token válido
# - Pedido existe
# - Pedido pertence ao userId do token ✅
```

#### 3. PROCESS_STRIPE_PAYMENT (Autenticado)
```graphql
mutation ProcessStripePayment($orderId: ID!, $paymentIntentId: String!) {
  processStripePayment(orderId: $orderId, paymentIntentId: $paymentIntentId) {
    success
    message
    orderId
    status
  }
}

# Headers:
{
  "Authorization": "Bearer <JWT_TOKEN>"
}

# Backend valida:
# - Token válido
# - Pedido pertence ao userId ✅
# - PaymentIntent válido no Stripe
```

#### 4. MY_ORDERS (Histórico)
```graphql
query MyOrders($page: Int, $limit: Int) {
  myOrders(page: $page, limit: $limit) {
    orders {
      id
      orderNumber
      status
      totalAmount
      createdAt
      items {
        productName
        quantity
        totalPrice
      }
    }
    totalPages
    currentPage
  }
}

# Headers:
{
  "Authorization": "Bearer <JWT_TOKEN>"
}

# Retorna APENAS pedidos do usuário autenticado
```

#### 5. GET_MY_ADDRESSES (Para Checkout)
```graphql
query GetMyAddresses {
  myAddresses {
    id
    street
    city
    state
    zipCode
    country
    isDefault
  }
}

# Headers:
{
  "Authorization": "Bearer <JWT_TOKEN>"
}

# Usado no CheckoutModal para listar endereços
```

---

## 🚀 Teste da Implementação

### Passo 1: Sem Login
```
1. Abrir incógnito/nova aba
2. Adicionar produto ao carrinho
3. Ir para /cart
4. Clicar "Finalizar Compra"
5. ❌ Esperado: Redirecionar para /login
```

### Passo 2: Com Login
```
1. Fazer login em /login
2. Ir para /products
3. Adicionar produto ao carrinho
4. Ir para /cart
5. Clicar "Finalizar Compra"
6. ✅ Esperado: Abre CheckoutModal
7. Preencher dados e continuar
```

### Passo 3: Login → Checkout
```
1. Começar sem login
2. Adicionar produto ao carrinho
3. Clicar "Finalizar Compra"
4. Ser redirecionado para /login
5. Fazer login
6. Ser redirecionado para /cart
7. Clicar "Finalizar Compra" novamente
8. ✅ Esperado: Abre CheckoutModal com sucesso
```

---

## 🔄 Fluxo de Dados

```
┌─────────────────────────┐
│   Carrinho (Produto)    │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  CartPage               │
│  ├─ isAuthenticated     │
│  └─ handleCheckoutClick │
└────────────┬────────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
 FALSE (Não)      TRUE (Sim)
    │                 │
    ▼                 ▼
┌─────────────┐  ┌──────────────┐
│ /login      │  │ CheckoutModal│
│ + message   │  │ (abrir)      │
│ + from      │  │              │
└─────────────┘  └──────────────┘
    │                 │
    ├─ Login OK       │
    │  └─ /cart ◄─────┘
    │
    └─ Register OK
       └─ /cart
          ├─ Clica "Finalizar Compra"
          │
          └─ isAuthenticated = TRUE
             └─ CheckoutModal abre ✓
```

---

## 📊 Arquivos Modificados

| Arquivo | Mudança | Status |
|---------|---------|--------|
| `src/features/cart/pages/CartPage.tsx` | Adicionar verificação de auth | ✅ |
| `src/shared/hooks/` | useAuth() já existe | ✓ |

---

## 🎓 Como Funciona o useAuth()

```typescript
// src/shared/hooks/useAuth.ts (ou index.ts)

import { useContext } from 'react';
import { AuthContext } from '@/core/context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  
  return context;
};

// Retorna:
{
  user: User | null,
  token: string | null,
  isAuthenticated: boolean,  // ← Usamos isto!
  login: (email, password) => Promise<void>,
  logout: () => void,
}
```

---

## 🚦 Estados no Ciclo de Vida

```javascript
// 1. Usuário entra no site
isAuthenticated = false

// 2. Vai para /login e faz login
isAuthenticated = true (após login bem-sucedido)

// 3. Volta para /cart
isAuthenticated = true (mantém)

// 4. Clica "Finalizar Compra"
handleCheckoutClick()
├─ if (!isAuthenticated) → FALSE ✓
└─ setIsCheckoutOpen(true) ✓

// 5. Faz logout
isAuthenticated = false (limpo)

// 6. Tenta clicar "Finalizar Compra" novamente
handleCheckoutClick()
├─ if (!isAuthenticated) → TRUE (redirect!)
└─ navigate('/login')
```

---

## 💾 Persistência de Dados

### Token Armazenado
```typescript
// src/core/context/AuthProvider.tsx

// Ao fazer login:
localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);

// Ao iniciar app:
const savedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
if (savedToken) {
  setToken(savedToken);
  fetchUserData(savedToken);
  // isAuthenticated = true ✓
}

// Ao fazer logout:
localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
// isAuthenticated = false
```

---

## 🎯 Casos de Uso

### Caso 1: Novo Usuário
```
1. Descobre loja
2. Adiciona produto
3. Vai para checkout
4. Vê aviso de login
5. Clica "Cadastro"
6. Faz cadastro
7. Volta ao carrinho
8. Completa compra
```

### Caso 2: Usuário Retornando
```
1. Volta para loja
2. Token ainda válido (localStorage)
3. Adiciona produtos
4. Checkout abre imediatamente ✓
```

### Caso 3: Token Expirado
```
1. Token ainda no localStorage
2. Mas já expirou no backend
3. API retorna 401
4. AuthProvider limpa token
5. isAuthenticated = false
6. Usuário é redirecionado para login
```

---

## 🔧 Melhorias Possíveis (Opcionais)

### 1. Toast de notificação ao redirecionar
```typescript
const handleCheckoutClick = () => {
  if (!isAuthenticated) {
    toast.info('Faça login para continuar com a compra');
    navigate('/login', { state: { from: '/cart' } });
    return;
  }
  setIsCheckoutOpen(true);
};
```

### 2. Indicador visual no botão
```typescript
<Button onClick={handleCheckoutClick} className="flex-1">
  {isAuthenticated ? (
    <>✓ Finalizar Compra</>
  ) : (
    <>🔒 Login Necessário</>
  )}
</Button>
```

### 3. Pré-carregar endereços no mount
```typescript
useEffect(() => {
  if (isAuthenticated && isCheckoutOpen) {
    // Carregar endereços antes de abrir modal
    refetch(); // useQuery(GET_MY_ADDRESSES)
  }
}, [isAuthenticated, isCheckoutOpen]);
```

### 4. Salvar carrinho no servidor (autenticado)
```typescript
// Sync cart com backend quando usuário faz login
useEffect(() => {
  if (isAuthenticated && localCart.length > 0) {
    syncCartToServer(localCart);
  }
}, [isAuthenticated]);
```

---

## ✅ Checklist de Implementação


### UI/UX (Recomendado)
- [ ] Toast de notificação ao redirecionar
- [ ] Loading state durante login
- [ ] Indicador visual no botão de checkout
- [ ] Mensagem clara: "Login necessário"
- [ ] Pré-carregar endereços ao abrir modal

### Testes (Recomendado)
- [ ] Teste: Usuário deslogado tenta checkout → redirect
- [ ] Teste: Usuário faz login → volta ao cart
- [ ] Teste: Checkout com sucesso (autenticado)
- [ ] Teste: Logout → checkout bloqueado novamente
- [ ] Teste: Token expirado → re-login automático

---

## 📞 Referências Técnicas

### Hooks Usados
```typescript
import { useAuth } from '@/shared/hooks';        // Autenticação
import { useNavigate } from 'react-router-dom';  // Navegação
import { useMutation } from '@apollo/client';    // GraphQL
```

### Contextos
```typescript
// src/core/context/AuthContext.ts
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}
```

### Mutations
```typescript
// src/graphql/checkoutQueries.ts
export const CREATE_ORDER = gql`...`;
export const CREATE_PAYMENT_INTENT = gql`...`;
export const PROCESS_STRIPE_PAYMENT = gql`...`;

// src/graphql/queries.ts
export const GET_MY_ADDRESSES = gql`...`;
export const MY_ORDERS = gql`...`;
```

---
