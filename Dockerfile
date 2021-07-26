FROM node:latest

WORKDIR /app

COPY ["package.json","entrypoint.sh","./"]
# COPY ["package.json","package-lock.json*","entrypoint.sh","./"]

RUN npm install --only=production

COPY . .

CMD ["npm","start"]