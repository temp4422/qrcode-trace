FROM node:23
EXPOSE 3001
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]