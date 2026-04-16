# AGENTS.md — Guia para Geração de Código

Este documento descreve a arquitetura, padrões e convenções do projeto **Skeleton App**. Use-o como referência ao gerar novos códigos.

---

## 🏗️ Arquitetura

Este é um **monolito moderno** com Next.js (App Router). Toda a aplicação — frontend, API e lógica de negócio — reside em um único projeto.

### Camadas

```
┌────────────────────────────┐
│         App Router         │ ← Páginas e API Routes
├────────────────────────────┤
│        Components          │ ← UI reutilizável
├────────────────────────────┤
│          Hooks             │ ← Lógica de estado/client
├────────────────────────────┤
│         Services           │ ← Regras de negócio
├────────────────────────────┤
│          Models            │ ← Schemas do MongoDB
├────────────────────────────┤
│           Lib              │ ← Utilitários (DB, Auth, etc)
├────────────────────────────┤
│          Types             │ ← Tipagens globais
└────────────────────────────┘
```

---

## 📂 Responsabilidades de Cada Pasta

| Pasta | Responsabilidade |
|-------|-----------------|
| `src/app/` | Rotas de página e API (App Router do Next.js). Cada subpasta é uma rota. |
| `src/app/api/` | API Routes — endpoints REST. Não colocar lógica de negócio aqui, apenas validação de entrada e chamada ao service. |
| `src/components/` | Componentes React reutilizáveis. Organizados por domínio (auth/, dashboard/). |
| `src/hooks/` | Custom hooks para lógica compartilhada no client-side. |
| `src/lib/` | Funções utilitárias puras: conexão DB, JWT, hash de senhas, tema MUI. |
| `src/models/` | Schemas do Mongoose. Cada arquivo exporta um model. |
| `src/services/` | Camada de negócio. Recebe dados já validados, executa lógica e interage com models. |
| `src/types/` | Interfaces e tipos TypeScript globais. |

---

## 📏 Padrões de Código

### TypeScript
- **Sempre** usar TypeScript. Nunca `any` sem justificativa.
- Interfaces e types em `src/types/`. Types locais podem ficar no próprio arquivo.
- Usar `interface` para objetos, `type` para unions/intersections.

### Nomenclatura
| Elemento | Convenção | Exemplo |
|----------|-----------|---------|
| Arquivos de componente | PascalCase | `Sidebar.tsx` |
| Arquivos de lib/service | camelCase | `userService.ts` |
| Interfaces | PascalCase com prefixo I (opcional) | `IUser`, `UserResponse` |
| DTOs | PascalCase + sufixo DTO | `CreateUserDTO` |
| Hooks | camelCase com prefixo use | `useAuth.ts` |
| API Routes | `route.ts` dentro da pasta da rota | `app/api/auth/login/route.ts` |

### Componentes React
- Usar `'use client'` apenas quando necessário (interatividade, hooks de estado).
- Preferir Server Components quando possível.
- Componentes devem ser pequenos e focados.

### API Routes
- **Não colocar lógica de negócio** nas routes.
- Fluxo: `Route → Validação → Service → Response`
- Sempre retornar o formato `{ success: boolean, data?, error?, message? }`.

### Services
- Aceitam DTOs tipados.
- Acessam models diretamente.
- Tratam erros de negócio com `throw new Error()`.
- Nunca importam `NextRequest` ou `NextResponse`.

### Models (Mongoose)
- Um model por arquivo.
- Nome do arquivo em PascalCase: `User.ts`.
- Sempre verificar `mongoose.models.X` antes de `mongoose.model()` para evitar recompilação.

---

## 🎨 UI/UX

- **Framework**: Material UI (MUI) com tema dark customizado.
- **Tema**: Definido em `src/lib/theme.ts`. Todas as cores e estilos devem usar o tema, nunca valores hardcoded.
- **Responsividade**: Usar breakpoints do MUI (`xs`, `sm`, `md`, `lg`, `xl`).
- **Ícones**: Usar `@mui/icons-material`.

---

## 🔐 Autenticação

- JWT armazenado em cookie httpOnly.
- `jose` para gerar/verificar tokens (compatível com Edge Runtime).
- `bcryptjs` para hash de senhas.
- Proxy (antigo Middleware) em `src/proxy.ts` protege rotas `/dashboard/*`.
- Hook `useAuth` no client para obter estado do usuário.

---

## 🗄️ Banco de Dados

- **MongoDB** via Mongoose.
- Conexão singleton em `src/lib/mongodb.ts`.
- Usar `await dbConnect()` no início de cada service function.

---

## ➕ Como Adicionar Novos Recursos

### Nova Página
1. Criar pasta em `src/app/<rota>/`
2. Adicionar `page.tsx` (e `layout.tsx` se necessário)
3. Se protegida, adicionar o path no proxy (`src/proxy.ts`)

### Novo Endpoint API
1. Criar `src/app/api/<recurso>/route.ts`
2. Criar service em `src/services/<recurso>Service.ts`
3. Criar model em `src/models/<Recurso>.ts`
4. Adicionar types em `src/types/index.ts`

### Novo Componente
1. Criar em `src/components/<domínio>/<NomeComponente>.tsx`
2. Usar `'use client'` se necessário
3. Importar estilos do tema MUI

### Novo Hook
1. Criar em `src/hooks/use<Nome>.ts`
2. Exportar como named export

---

## ⚠️ Regras Importantes

1. **Nunca** expor passwords em responses da API.
2. **Sempre** validar input nas API routes antes de chamar services.
3. **Sempre** usar `await dbConnect()` antes de acessar o banco.
4. **Nunca** usar `import` de módulos server-only em componentes client.
5. **Sempre** tratar erros com try/catch nas API routes.
6. Manter o `proxy.ts` atualizado ao criar novas rotas protegidas.
