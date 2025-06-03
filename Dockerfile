# 1단계: 빌드
FROM node:22-alpine AS builder
ENV NODE_ENV=production

# WORKDIR 먼저 설정
WORKDIR /app

# package*.json만 먼저 복사해서 캐시 활용
COPY package*.json ./

# 의존성 설치
RUN npm install

# 전체 소스 복사 (node_modules 제외하려면 .dockerignore 필요)
COPY . .

# 실제 실행할 코드 빌드가 있다면 (ex: npm run build)
# RUN npm run build

# 2단계: 실제 실행 환경
FROM node:22-alpine AS runner
WORKDIR /app

# builder 단계에서 node_modules와 앱 코드만 복사
COPY --from=builder /app /app

CMD ["node", "main.js"]
