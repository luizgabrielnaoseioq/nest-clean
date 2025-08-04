# Nest Clean - API REST

Uma API REST construída com NestJS, Prisma ORM e PostgreSQL, seguindo princípios de Clean Architecture.

## 🚀 Tecnologias

- **NestJS** - Framework Node.js para construção de aplicações escaláveis
- **Prisma** - ORM moderno para TypeScript e Node.js
- **PostgreSQL** - Banco de dados relacional
- **Docker** - Containerização da aplicação
- **Zod** - Validação de schemas
- **bcrypt** - Criptografia de senhas

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [pnpm](https://pnpm.io/) (gerenciador de pacotes)
- [Docker](https://www.docker.com/) e Docker Compose
- [Git](https://git-scm.com/)

## 🛠️ Instalação e Configuração

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd nest-clean
```

### 2. Instale as dependências

```bash
pnpm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Ou crie manualmente o arquivo `.env` com o seguinte conteúdo:

```env
DATABASE_URL="postgresql://postgres:docker@localhost:5432/nest-clean?schema=public"
PORT=3333
```

### 4. Inicie o banco de dados PostgreSQL

```bash
docker-compose up -d
```

Este comando irá:

- Baixar a imagem do PostgreSQL
- Criar um container chamado `nest-clean-pg`
- Expor a porta 5432
- Criar o banco de dados `nest-clean`

### 5. Execute as migrações do Prisma

```bash
pnpm prisma migrate dev
```

Este comando irá:

- Aplicar todas as migrações pendentes
- Gerar o cliente Prisma
- Sincronizar o schema com o banco de dados

### 6. Gere o cliente Prisma (se necessário)

```bash
pnpm prisma generate
```

## 🚀 Executando o Projeto

### Modo de Desenvolvimento

```bash
pnpm start:dev
```

A aplicação estará disponível em `http://localhost:3333`

### Modo de Produção

```bash
# Build do projeto
pnpm build

# Executar em produção
pnpm start:prod
```

### Modo Debug

```bash
pnpm start:debug
```

## 📊 Estrutura do Banco de Dados

O projeto possui dois modelos principais:

### User (Usuário)

- `id` - Identificador único (UUID)
- `name` - Nome do usuário
- `email` - Email único
- `password` - Senha criptografada

### Question (Pergunta)

- `id` - Identificador único (UUID)
- `title` - Título da pergunta
- `slug` - Slug único para URL
- `content` - Conteúdo da pergunta
- `createdAt` - Data de criação
- `updatedAt` - Data de atualização
- `authorId` - ID do autor (relacionamento com User)

## 🔧 Comandos Úteis

### Desenvolvimento

```bash
# Executar em modo de desenvolvimento
pnpm start:dev

# Executar testes
pnpm test

# Executar testes em modo watch
pnpm test:watch

# Executar linting
pnpm lint

# Formatar código
pnpm format
```

### Prisma

```bash
# Abrir interface do Prisma Studio
pnpm prisma studio

# Resetar banco de dados
pnpm prisma migrate reset

# Verificar status das migrações
pnpm prisma migrate status

# Gerar nova migração
pnpm prisma migrate dev --name nome_da_migracao
```

### Docker

```bash
# Iniciar serviços
docker-compose up -d

# Parar serviços
docker-compose down

# Ver logs do PostgreSQL
docker-compose logs postgres

# Remover volumes (cuidado: apaga dados)
docker-compose down -v
```

## 📁 Estrutura do Projeto

```
nest-clean/
├── src/
│   ├── controllers/     # Controladores da API
│   ├── pipes/          # Pipes de validação
│   ├── prisma/         # Serviço do Prisma
│   ├── app.module.ts   # Módulo principal
│   └── main.ts         # Ponto de entrada
├── prisma/
│   ├── migrations/     # Migrações do banco
│   └── schema.prisma   # Schema do Prisma
├── data/               # Dados do PostgreSQL (Docker)
├── docker-compose.yml  # Configuração do Docker
└── package.json        # Dependências e scripts
```

## 🔍 Endpoints da API

### Usuários

- `POST /users` - Criar conta
- `GET /users` - Listar todas as contas

### Perguntas

- `POST /questions` - Criar pergunta
- `GET /questions` - Listar perguntas
- `GET /questions/:id` - Buscar pergunta por ID

## 🐛 Solução de Problemas

### Erro de conexão com o banco

```bash
# Verificar se o PostgreSQL está rodando
docker-compose ps

# Reiniciar o container
docker-compose restart postgres
```

### Erro de migração

```bash
# Resetar banco e aplicar migrações
pnpm prisma migrate reset

# Ou forçar sincronização
pnpm prisma db push
```

### Porta já em uso

```bash
# Verificar processos na porta 3333
lsof -i :3333

# Matar processo se necessário
kill -9 <PID>
```

## 📝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🤝 Suporte

Se você encontrar algum problema ou tiver dúvidas, abra uma issue no repositório.

---

**Desenvolvido com ❤️ usando NestJS e Prisma**
