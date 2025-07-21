# FeliQuiz Backend API

Backend Node.js/Express para o FeliQuiz com autenticação JWT, PostgreSQL e APIs RESTful.

## 🚀 Tecnologias

- **Node.js** + **Express.js**
- **PostgreSQL** com connection pooling
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
│   ├── middleware/      # Middlewares (auth, etc)
│   ├── data/           # Dados mock (temporário)
│   └── server.js       # Servidor principal
├── config/             # Configurações
├── package.json
└── .env.example
```

## 🛠️ Setup

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
DB_HOST=localhost
DB_PORT=5432
DB_NAME=feliquiz_db
DB_USER=feliquiz_user
DB_PASSWORD=sua_senha
JWT_SECRET=seu_jwt_secret_super_seguro
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

## 📡 Endpoints da API

### Autenticação (`/api/auth`)

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Usuários (`/api/users`)

```http
GET  /api/users/:username
PUT  /api/users/profile
```

### Quizzes (`/api/quizzes`)

```http
GET  /api/quizzes
GET  /api/quizzes/:id
POST /api/quizzes/:id/submit
```

### Manifesto (`/api/manifesto`)

```http
GET  /api/manifesto/likes
POST /api/manifesto/like
GET  /api/manifesto/like/status
```

### Health Check

```http
GET /api/health
```

## 🔐 Autenticação

### Registro

```bash
curl -X POST http://localhost:3001/api/auth/register \
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
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "password123"
  }'
```

### Usar Token

```bash
curl -H "Authorization: Bearer SEU_JWT_TOKEN" \
  http://localhost:3001/api/auth/me
```

## 🛡️ Segurança

- **Rate Limiting**: 100 requests por 15 minutos por IP
- **Helmet**: Headers de segurança
- **CORS**: Configurado para frontend específico
- **JWT**: Tokens com expiração
- **bcrypt**: Hash seguro de senhas
- **Validação**: Dados validados com express-validator

## 📊 Monitoramento

### Health Check

```bash
curl http://localhost:3001/api/health
```

Resposta:
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

## 🚀 Deploy

### Variáveis de Ambiente para Produção

```env
NODE_ENV=production
PORT=3001
DB_HOST=seu_host_postgres
DB_PASSWORD=senha_super_segura
JWT_SECRET=jwt_secret_super_seguro_64_chars_minimo
FRONTEND_URL=https://seu-frontend.com
```

### Docker (Opcional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento com nodemon
npm start        # Produção
npm run migrate  # Executar migrações (futuro)
npm run seed     # Executar seeds (futuro)
```

## 📝 Logs

Em desenvolvimento, todos os erros são logados no console.
Em produção, considere usar ferramentas como:

- **Winston** para logging estruturado
- **Morgan** para logs de HTTP
- **Sentry** para monitoramento de erros

## 🤝 Contribuição

1. Faça fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request