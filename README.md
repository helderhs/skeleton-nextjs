# 🧱 Skeleton App

Monolito moderno construído com **Next.js (App Router)**, **Material UI**, **MongoDB** e **TypeScript**. Pronto para autenticação, dashboard e integração com banco de dados.

---

## ✨ Funcionalidades

- ✅ Autenticação completa (cadastro, login, logout)
- ✅ Hash de senhas com bcrypt
- ✅ Sessão via JWT (cookies httpOnly)
- ✅ Middleware protegendo rotas privadas
- ✅ Dashboard com layout responsivo (sidebar + header)
- ✅ Tema dark premium com Material UI
- ✅ Conexão singleton com MongoDB
- ✅ Arquitetura escalável em camadas
- ✅ TypeScript bem tipado

---

## 🛠️ Tecnologias

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| Next.js | 15+ | Framework fullstack (App Router) |
| TypeScript | 5+ | Tipagem estática |
| Material UI | 6+ | Componentes de UI |
| MongoDB | - | Banco de dados NoSQL |
| Mongoose | 8+ | ODM para MongoDB |
| bcryptjs | - | Hash de senhas |
| jose | - | JWT (compatível com Edge Runtime) |

---

## 🚀 Como Rodar

### Pré-requisitos

- **Node.js** 18+
- **MongoDB** rodando localmente ou via Atlas
- **npm** 9+

### Instalação

```bash
# 1. Clone o repositório
git clone <url-do-repo>
cd skeleton

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite o .env.local com suas configurações

# 4. Rode o projeto
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

---

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
MONGODB_URI=mongodb://localhost:27017/skeleton
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NEXT_PUBLIC_APP_NAME=Skeleton App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

| Variável | Obrigatória | Descrição |
|----------|:-----------:|-----------|
| `MONGODB_URI` | ✅ | String de conexão com o MongoDB |
| `JWT_SECRET` | ✅ | Chave secreta para assinar tokens JWT |
| `NEXT_PUBLIC_APP_NAME` | ❌ | Nome da aplicação (exibido na UI) |
| `NEXT_PUBLIC_APP_URL` | ❌ | URL base da aplicação |

---

## 📜 Scripts Disponíveis

| Script | Comando | Descrição |
|--------|---------|-----------|
| Dev | `npm run dev` | Inicia o servidor de desenvolvimento |
| Build | `npm run build` | Gera o build de produção |
| Start | `npm start` | Inicia o servidor de produção |
| Lint | `npm run lint` | Executa o linter (ESLint) |

---

## 📂 Estrutura do Projeto

```
src/
├── app/                    # Rotas (App Router)
│   ├── api/                # API Routes
│   │   ├── auth/           # Endpoints de autenticação
│   │   └── users/          # CRUD de usuários
│   ├── dashboard/          # Páginas do dashboard
│   ├── login/              # Página de login
│   ├── register/           # Página de cadastro
│   └── forgot-password/    # Página de recuperação
├── components/             # Componentes reutilizáveis
│   ├── auth/               # Componentes de autenticação
│   ├── dashboard/          # Sidebar, Header, etc.
│   └── ThemeRegistry.tsx   # Provider do MUI
├── hooks/                  # Hooks customizados
├── lib/                    # Utilitários e configurações
│   ├── mongodb.ts          # Conexão singleton com MongoDB
│   ├── auth.ts             # Funções de JWT
│   ├── password.ts         # Hash de senhas
│   └── theme.ts            # Tema do Material UI
├── models/                 # Schemas do MongoDB (Mongoose)
├── services/               # Regras de negócio
├── types/                  # Tipagens globais
└── proxy.ts                # Proxy de proteção de rotas (antigo middleware)
```

---

## 📝 Licença

MIT
