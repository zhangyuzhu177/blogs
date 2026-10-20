FROM node:22.19.0-bookworm AS base

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
WORKDIR /app

RUN npm install --global pnpm@10.27.0

# 保留工作区结构，让 workspace: 依赖在构建及运行时都能正确解析。
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY packages/types/package.json ./packages/types/package.json
COPY packages/utils/package.json ./packages/utils/package.json
COPY projects/server/package.json ./projects/server/package.json

FROM base AS build

RUN --mount=type=cache,id=blogs-pnpm,target=/pnpm/store \
    pnpm install --filter server... --frozen-lockfile --store-dir /pnpm/store

COPY tsconfig.json tsconfig.base.json ./
COPY packages/types ./packages/types
COPY packages/utils ./packages/utils
COPY projects/server ./projects/server

# utils 的完整 build 还会生成文档，这里只编译后端需要的代码。
RUN pnpm --filter types build \
    && pnpm --filter utils build:esm \
    && pnpm --filter utils build:cjs \
    && pnpm --filter server build

FROM base AS production-deps

RUN --mount=type=cache,id=blogs-pnpm,target=/pnpm/store \
    pnpm install --filter server... --prod --frozen-lockfile --store-dir /pnpm/store

FROM node:22.19.0-bookworm-slim AS runtime

ENV NODE_ENV=production
ENV SERVER_PORT=3000
WORKDIR /app/projects/server

COPY --from=production-deps --chown=node:node /app /app
COPY --from=build --chown=node:node /app/packages/types/dist /app/packages/types/dist
COPY --from=build --chown=node:node /app/packages/utils/dist /app/packages/utils/dist
COPY --from=build --chown=node:node /app/projects/server/dist ./dist

# main.ts 会读取 ../shared；实际配置由 Compose 的 env_file 注入。
RUN mkdir -p /app/projects/shared && touch /app/projects/shared/.env

USER node
EXPOSE 3000

CMD ["node", "dist/main.js"]
