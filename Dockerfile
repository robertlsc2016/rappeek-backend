# Use a imagem oficial do Node.js com a versão mais recente
FROM node:current-bullseye-slim

# Atualize os pacotes e instale o Git
RUN apt-get update && apt-get install -y \
    git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Configure o diretório de trabalho
WORKDIR /app

# Copie apenas os arquivos necessários para instalar as dependências
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie o restante dos arquivos do projeto
COPY . .

# Execute o build da aplicação
RUN npm run build

# Exponha a porta que sua aplicação utiliza
EXPOSE 3000

# Defina o comando padrão para iniciar a aplicação
CMD ["npm", "start"]
