# FeliQuiz Backend API

Backend Node.js/Express para o FeliQuiz com autenticação JWT, dados mockados e APIs RESTful completas.

## 🚀 Tecnologias

- **Node.js** + **Express.js**
- **JWT** para autenticação
- **bcryptjs** para hash de senhas
- **CORS** e **Helmet** para segurança
- **Rate limiting** para proteção contra spam
- **Express Validator** para validação de dados

## 📁 Estrutura

```
backend/
├── src/
│   ├── routes/          # Rotas da API
│   │   ├── auth.js      # Autenticação (login, registro, reset)
│   │   ├── users.js     # Perfis de usuários
│   │   ├── quizzes.js   # Quizzes e submissões
│   │   └── manifesto.js # Likes do manifesto
│   ├── middleware/      # Middlewares (auth, etc)
│   ├── data/           # Dados mockados
│   └── server.js       # Servidor principal
├── package.json
├── .env.example
└── README.md
```

## 🛠️ Setup Local

### 1. Instalar Dependências

```bash
cd backend
npm install
```

### 2. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
PORT=3001
NODE_ENV=development
JWT_SECRET=seu_jwt_secret_super_seguro_minimo_32_caracteres
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

### 3. Executar em Desenvolvimento

```bash
npm run dev
```

### 4. Executar em Produção

```bash
npm start
```

### 4. Popular o Banco de Dados

```bash
npm run seed
```

## 🚀 Deploy no Render

### 1. Preparação

1. Faça push do código para um repositório Git
2. Conecte o repositório ao Render
3. Configure as variáveis de ambiente

### 2. Configuração no Render

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
npm start
```

**Environment Variables:**
```env
NODE_ENV=production
JWT_SECRET=seu_jwt_secret_super_seguro_para_producao
FRONTEND_URL=https://seu-frontend.netlify.app
PORT=10000
```

### 3. URL do Backend

Após o deploy, sua API estará disponível em:
```
https://seu-app.onrender.com
```

## 📡 Endpoints da API

### Autenticação (`/api/auth`)

```http
POST /api/auth/register          # Criar conta
POST /api/auth/login             # Fazer login
GET  /api/auth/me                # Dados do usuário atual
POST /api/auth/reset-password    # Solicitar reset de senha
POST /api/auth/change-password   # Alterar senha
```

### Usuários (`/api/users`)

```http
GET  /api/users/:username           # Perfil público
PUT  /api/users/profile             # Atualizar perfil
GET  /api/users/:username/submissions # Submissões do usuário
PATCH /api/users/:id/coins          # Atualizar FeliCoins
POST /api/users/:id/badges          # Adicionar badge
```

### Quizzes (`/api/quizzes`)

```http
GET  /api/quizzes                   # Listar quizzes (com filtros)
GET  /api/quizzes/:id               # Quiz específico
POST /api/quizzes/:id/submit        # Submeter resultado
GET  /api/quizzes/:id/stats         # Estatísticas do quiz
GET  /api/quizzes/meta/topics       # Tópicos disponíveis
```

### Manifesto (`/api/manifesto`)

```http
GET  /api/manifesto/likes           # Total de likes
POST /api/manifesto/like            # Curtir/descurtir
GET  /api/manifesto/like/status     # Status do like do usuário
```

### Health Check

```http
GET /api/health                     # Status da API
```

## 🔐 Autenticação

### Registro

```bash
curl -X POST https://seu-app.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "username": "joaosilva",
    "email": "joao@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST https://seu-app.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "password123"
  }'
```

### Usar Token

```bash
curl -H "Authorization: Bearer SEU_JWT_TOKEN" \
  https://seu-app.onrender.com/api/auth/me
```

## 🎮 Funcionalidades Implementadas

### Sistema de Quizzes
- **Tipos**: Padrão, Temporário, Relâmpago
- **Filtros**: Categoria, tipo, tópico, subtópico
- **Expiração**: Quizzes temporários com data limite
- **Modo visitante**: Quizzes gratuitos sem login

### Sistema de Usuários
- **Autenticação completa**: Registro, login, reset de senha
- **Perfis públicos**: Visualização de badges e estatísticas
- **FeliCoins**: Sistema de moeda gamificada
- **Badges**: Conquistas por completar quizzes

### Sistema de Gamificação
- **FeliCoins escassos**: Usuários começam com 10 moedas
- **Custo por quiz**: 5 FeliCoins para jogar
- **Recompensas variáveis**: 10-30 FeliCoins por resultado
- **Badges colecionáveis**: Diferentes valores e raridades

## 🛡️ Segurança

- **Rate Limiting**: 100 requests por 15 minutos por IP
- **Helmet**: Headers de segurança
- **CORS**: Configurado para frontend específico
- **JWT**: Tokens com expiração
- **bcrypt**: Hash seguro de senhas
- **Validação**: Dados validados com express-validator

## 📊 Dados Mockados

O backend usa dados mockados que simulam:
- **3 usuários** com diferentes perfis
- **3 quizzes** de tipos diferentes
- **Submissões** e histórico de quizzes
- **Sistema de likes** do manifesto
- **Tópicos e subtópicos** para categorização

## 🔄 Migração para Banco Real

Para migrar para um banco de dados real:

1. **Escolha o banco**: PostgreSQL, MongoDB, etc.
2. **Substitua os mocks**: Implemente queries reais
3. **Mantenha as APIs**: Mesma interface, implementação diferente
4. **Configure conexão**: Adicione string de conexão no .env

## 🤝 Integração com Frontend

O frontend deve apontar para a URL do backend:

```env
# Frontend .env
VITE_API_URL=https://seu-app.onrender.com/api
```

## 📝 Logs e Monitoramento

- **Logs de erro**: Console.error para debugging
- **Health check**: Endpoint para verificar status
- **Rate limiting**: Proteção contra spam

Para produção, considere:
- **Winston** para logging estruturado
- **Morgan** para logs HTTP
- **Sentry** para monitoramento de erros