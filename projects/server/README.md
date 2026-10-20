## 博客-后端服务

### Docker 部署（Node.js 22.19.0）

在仓库根目录使用 `Dockerfile` 和 `docker-compose.yml`。镜像会先编译 `types`、`utils` 和 NestJS 后端，运行阶段只安装生产依赖，使用非 root 用户执行 `node dist/main.js`。

Compose 只部署后端，连接现有 MySQL、Redis，保留原有配置：

- 服务名和容器名：`blogs_node`；镜像名：`zyz_node`。
- 端口映射：`3000:3000`。
- 外部网络：`blogs_net`；容器 IP：`10.10.99.10`。
- 时区：`Asia/Shanghai`；重启策略：`always`。

#### 1. 准备配置

Compose 通过 `env_file` 直接读取 `projects/server/.env`，不在 Compose 中覆盖数据库或 Redis 的连接配置。请在该文件中设置有效的 `DB_HOST`、`DB_PORT`、`DB_USER`、`DB_PSWD`、`DB_NAME` 以及 `REDIS_HOST`、`REDIS_PORT` 和 Redis 认证信息。

如果 MySQL 和 Redis 容器接入同一个外部 `blogs_net` 网络，`DB_HOST`、`REDIS_HOST` 填写对应容器名或网络别名，容器间可通过 Docker 网络发现彼此。当前 Redis 容器名为 `blogs_redis`，所以 `.env` 中的 Redis 地址配置为 `REDIS_HOST=blogs_redis`、`REDIS_PORT=6379`；不需要填写宿主机网关地址。只有服务确实运行在宿主机上时，才配置宿主机可达的地址。

`.env` 中的示例值如果以 `#` 注释，应用不会读取它们，部署前请取消注释并确认主机名和端口正确。后端还会从配置文件读取 JWT、RSA、SMTP、OSS 和模型配置。

生产环境建议将后端配置中的 `DB_ORM_ENABLE_SYNC` 设为 `false`，使用已有且匹配当前实体的数据库表；当前项目启动时会初始化角色、权限等数据，空库须先准备表结构。邮件用户名与 OSS 配置在启动阶段就会被读取，需填写有效配置。

环境文件不会被复制到镜像，运行时通过 `env_file` 注入。RSA 等多行值请使用 Compose 支持的带引号格式；含 `$` 的密钥建议使用单引号，避免变量展开。

#### 2. 确认已有网络

```sh
docker network inspect blogs_net
```

网络须已存在，其子网包含 `10.10.99.10`，且该 IP 未被其他容器占用。

#### 3. 构建与启动

在服务器上的仓库根目录执行（例如 `/data/app/blogs/blogs`）：

```sh
docker compose config -q
docker compose up -d --build blogs_node
docker compose ps
docker compose logs -f --tail=100 blogs_node
```

部署前确保旧的 `blogs_node` 容器由同一个 Compose 项目管理，或已停止并移除，否则可能发生容器名、端口或固定 IP 冲突。

源码更新后，再次执行 `docker compose up -d --build blogs_node`。后端默认监听 3000，API 路径沿用后端环境文件的 `SERVER_BASE_PATH`。健康检查仅检查后端 TCP 端口是否监听，数据库和业务状态需结合日志、实际 API 确认。

原来的 `/data/app/blogs/blogs/:/code/` 源码挂载已移除，代码和编译产物由镜像提供；后端通过阿里云 OSS 上传文件，无需额外挂载本地上传目录。
