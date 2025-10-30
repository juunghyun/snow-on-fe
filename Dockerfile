# Multi-Stage Build 시작: Builder 단계 (Next.js 빌드 환경)

# 1단계: 빌드 환경 (Node.js 20 LTS 버전 사용)
FROM node:20-alpine as builder
WORKDIR /app

# package.json과 lock 파일을 복사하고 의존성 설치 (캐싱 최적화)
# pnpm 설정을 위해 설치 명령어를 실행합니다.
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# 소스 코드 전체와 .env.production 파일 복사
COPY . .

# Next.js 빌드 (production 환경)
# 이때 .env.production 파일의 NEXT_PUBLIC_BACKEND_URL 값이 읽혀져서 빌드 결과에 포함됩니다.
RUN pnpm run build

# -----------------------------------------------------------------

# 2단계: 실행 환경 (Next.js 서버)

# Node.js 20 JRE만 포함된 경량 이미지를 사용합니다.
FROM node:20-alpine as runner
WORKDIR /app

# Next.js 서버 실행에 필요한 파일들만 복사
# .next 폴더, public 폴더, node_modules, package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Next.js 서버는 3000번 포트로 실행됩니다.
# (EC2의 3000번 포트와 매핑될 예정)
EXPOSE 3000

# 서버 실행 명령어 (production 모드)
CMD ["npx", "next", "start", "-p", "3000"]