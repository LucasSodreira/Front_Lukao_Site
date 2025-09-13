# Frontend da Loja — Guia rápido de arquitetura e estilo

Este documento resume a reestilização feita no frontend, a organização do projeto e como evoluir daqui em diante.

## O que foi feito

- Migração completa de estilos para Tailwind CSS (fundo branco e visual clean, focado em e-commerce de roupas).
- Criação de biblioteca de UI reutilizável (Button, Input, Card, Container, Badge).
- Navbar e Footer novos, com layout responsivo e tipografia limpa.
- Refatoração das páginas para usar os novos componentes e Tailwind:
  - Home, Produtos, Detalhe do Produto, Carrinho, Login, Cadastro, Perfil.
- Organização das pastas para facilitar manutenção e reuso.

## Estrutura relevante

- `src/ui/`
  - `Button.tsx` — botão com variantes (primary, secondary, danger, ghost) e tamanhos (sm, md, lg).
  - `Input.tsx` — input com label, validação e estilos de foco/erro.
  - `Card.tsx` — `Card`, `CardBody`, `CardTitle` para blocos de conteúdo.
  - `Container.tsx` — container responsivo centralizado.
  - `Badge.tsx` — selo com variantes.
- `src/components/`
  - `Navbar.tsx` — navegação no topo.
  - `Footer.tsx` — rodapé.
  - `ProductCard.tsx` — card de produto para listagens.
- `src/pages/`
  - `Home.tsx`, `Products.tsx`, `ProductDetail.tsx`, `Cart.tsx`, `Login.tsx`, `Register.tsx`, `Profile.tsx`.
- `src/index.css` — importa Tailwind e define base mínima (fundo branco).
- `vite.config.ts` — plugin `@tailwindcss/vite` habilitado.

## Estilo e padrões

- Utilizamos Tailwind v4 (import direto em `src/index.css`: `@import "tailwindcss";`).
- Evitamos CSS local; preferimos classes utilitárias do Tailwind.
- Para blocos de layout, use `Container` e os componentes de `ui/` para consistência.

## Exemplos rápidos

- Button:
  
  ```tsx
  import Button from '@/ui/Button';
  
  <Button>Comprar</Button>
  <Button variant="secondary" size="sm">Detalhes</Button>
  <Button variant="danger" full>Remover</Button>
  ```

- Card:
  
  ```tsx
  import { Card, CardBody, CardTitle } from '@/ui/Card';
  
  <Card>
    <CardBody>
      <CardTitle>Título</CardTitle>
      <p>Conteúdo</p>
    </CardBody>
  </Card>
  ```

- Input com label e erro:
  
  ```tsx
  import Input from '@/ui/Input';
  
  <Input label="Email" type="email" name="email" />
  <Input label="Senha" type="password" name="password" error="Campo obrigatório" />
  ```

Observação: o alias `@/` é apenas ilustrativo. Use caminhos relativos conforme o projeto.

## GraphQL e autenticação

- Cliente Apollo em `src/graphql/client.ts`.
- URL padrão: `http://localhost:8080/graphql`.
- Token JWT lido de `localStorage` como `authToken`.
- Contexto de autenticação: `src/context/AuthContext.tsx` (login, logout, `isAuthenticated`).

## Como rodar

No Windows (cmd.exe):

```cmd
cd c:\Users\lucas\OneDrive\Desktop\projeto-fullstack_loja\projeto_loja_front
npm install
npm run dev
```

Build de produção:

```cmd
npm run build
npm run preview
```

## Como evoluir

- Ações reais de “Adicionar ao Carrinho” com mutations e estados de loading.
- Filtros e ordenação no catálogo (preço, categoria, busca).
- Skeletons de loading e melhorias de acessibilidade (aria-labels, foco, etc.).
- Temas (ex.: modo escuro) usando data-attributes do Tailwind.

## Dicas de contribuição

- Crie novos componentes em `src/ui/` para elementos reutilizáveis.
- Para novas páginas, use `Container` e `Card` para manter consistência visual.
- Prefira classes Tailwind no JSX; evite CSS adicional quando possível.

---

Qualquer dúvida, abra este README e siga os exemplos e estrutura acima para manter a consistência do projeto.
