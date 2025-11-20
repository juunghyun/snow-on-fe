# Multi-Stage Build 시작: Builder 단계 (Next.js 빌드 환경)

# 1단계: 빌드 환경 (Node.js 20 LTS 버전 사용)
FROM node:20-alpine as builder
WORKDIR /app

# package.json과 lock 파일을 복사하고 의존성 설치 (캐싱 최적화)
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# 소스 코드 전체 복사 (GitHub에는 .env 파일이 없으므로 코드만 복사됨)
COPY . .

# GitHub Actions에서 넘겨준 주소를 받아서 환경변수로 등록
ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

# Next.js 빌드 (production 환경)
# 이제 위에서 받은 ENV 변수가 코드 안에 구워집니다.
RUN pnpm run build

# -----------------------------------------------------------------

# 2단계: 실행 환경 (Next.js 서버)

FROM node:20-alpine as runner
WORKDIR /app

# 빌드 결과물 복사
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# 서버 실행 명령어
CMD ["npx", "next", "start", "-p", "3000"]