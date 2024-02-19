# Usa una imagen base de Node.js
FROM node:18

# Crea el directorio de trabajo en la carpeta /app
WORKDIR /app

# Copia el archivo package.json y package-lock.json a la carpeta /app
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copiar el archivo .env al contenedor
COPY .env ./.env

# Copia el resto de los archivos al directorio de trabajo
COPY . .

# Expone el puerto 3000
EXPOSE 3000

# Comando para iniciar la aplicación cuando se ejecute el contenedor
CMD ["npm", "start"]
