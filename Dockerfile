FROM node:23-slim

WORKDIR /home/app

COPY . .

RUN npm i -g bun
RUN bun i --ignore-scripts
RUN npm run build

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["bun", "run", "preview"]
