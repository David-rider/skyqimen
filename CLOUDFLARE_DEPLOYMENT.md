# SkyQimen - Cloudflare Pages & D1 部署指南

本项目已完成重构和代码迁移，现在支持 **100% 运行于 Cloudflare Serverless 架构** 上。整个项目通过 **Cloudflare Pages** 托管 React 前端，通过 **Pages Functions** 托管 Hono 后端，数据持久化完全托管在 **Cloudflare D1 SQL 数据库**。

按照本指南，您可以完全免费、免运维地完成项目的最终上线部署。

---

## 1. 准备工作

请确保您的本地代码已经通过我们刚才绑定的 SSH key 同步到了最新的 GitHub 仓库：
[skyqimen (GitHub)](https://github.com/David-rider/skyqimen)

---

## 2. 部署步骤（Cloudflare 控制台操作）

### 第一步：在 Cloudflare 创建 D1 数据库
1. 登录 [Cloudflare 控制台](https://dash.cloudflare.com/)。
2. 在左侧导航栏，点击 **Workers & Pages (Wrangler)** -> **D1 SQL Database**。
3. 点击 **Create database** -> 选择 **D1**。
4. 数据库名称填入：`skyqimen-db`。
5. 创建成功后，复制页面上显示的 **Database ID**（一串类似于 `abc-123-xyz...` 的 UUID 密钥）。

### 第二步：配置并初始化数据库表结构
1. 在本地打开项目根目录下的 [wrangler.json](file:///mnt/d/study/projects01/skyqimen/wrangler.json) 文件。
2. 将 `"REPLACE_WITH_YOUR_D1_DATABASE_ID"` 修改为您刚才复制的 **Database ID**，保存文件。
3. 打开本地终端，登录您的 Cloudflare 账户（如未登录过）：
   ```bash
   npx wrangler login
   ```
4. 运行以下脚本，一键将表结构导入到 Cloudflare 云端数据库：
   ```bash
   npm run db:deploy
   ```
   *(该脚本会自动执行 [schema.sql](file:///mnt/d/study/projects01/skyqimen/schema.sql) 文件中的建表语句)*

### 第三步：创建 Cloudflare Pages 静态与函数部署
1. 回到 Cloudflare 控制台，点击 **Workers & Pages** -> **Create Application**。
2. 选择 **Pages** 选项卡，然后点击 **Connect to Git**。
3. 授权并选择您的 GitHub 仓库 `David-rider/skyqimen`。
4. 配置构建信息（Build settings）：
   - **Framework preset**: 选择 **Vite** （系统会自动填充 Build command 为 `npm run build`，Build output directory 为 `dist`）。
5. 点击 **Save and Deploy**（注：首次部署可能由于未配置 D1 绑定而无法调通 API，这是正常现象，请继续下一步）。

### 第四步：绑定 D1 数据库与配置 Node.js 兼容标志
为了让后端 Pages Functions 能访问 D1 数据库并正常运行加密模块，需要绑定变量和配置环境：
1. 在 Pages 项目的管理页面中，点击顶部的 **Settings** 选项卡。
2. **配置 Node 运行兼容性**：
   - 点击左侧的 **Functions**。
   - 滚动到 **Compatibility Flags** (兼容性标志) 区域。
   - 在 **Production** 和 **Preview** 两个环境中，分别填入：`nodejs_compat`。
3. **绑定 D1 数据库**：
   - 继续在 **Functions** 页面下滚动，找到 **D1 Database Bindings** 区域。
   - 点击 **Add binding**。
   - **Variable name (变量绑定名)**：必须填入 `DB`（大写，与代码严格对应）。
   - **D1 Database**：选择您第一步创建的 `skyqimen-db`。
   - 点击 **Save** 保存。

### 第五步：重新触发部署
1. 数据库绑定和兼容标志保存后，点击 Pages 项目顶部的 **Deployments**。
2. 找到最近一次的部署记录，点击右侧的三个点，选择 **Retry deployment**（重试部署）。
3. 部署完成后，Cloudflare 将为您生成一个专属域名（如 `https://skyqimen.pages.dev`）。

**此时，您就可以直接通过此公网地址访问奇门遁甲 AI 乾坤预测系统，注册、排盘、AI 咨询、历史记录以及模拟支付升级都已在云端打通！**

---

## 3. 本地开发与模拟调试

如果您未来想在本地模拟 Cloudflare 的运行环境，我们已经集成了 Wrangler 本地模拟脚本：

1. **本地运行全栈项目（包含模拟 D1 数据库）**：
   ```bash
   npm run dev:cf
   ```
   此命令会启动本地 Vite 前端并代理 Pages Functions 到 Cloudflare 本地模拟沙盒，您可以直接在 `http://localhost:8788` 调试前后端。

2. **初始化本地模拟数据库的表结构**：
   ```bash
   npm run db:local
   ```
