# 克隆项目

```bash
git clone https://github.com/YuminoAtsuyoshi/chuwaProj1.git
```

# 后端

```bash
cd backend
```

## 创建 .env 文件

在项目根目录新建 .env 文件，并写入以下内容

```
MONGODB_URI=mongodb+srv://<db_username>:<db_password>@cluster0.cdwqqvy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=<jwt_secret>
```

<db_username> 和 <db_password> 需要改成云端创建的账户和密码，<jwt_secret>自行设置

账户：

```
xzhang34_db_user
rileyxiong1203_db_user
peisonghao_db_user
```

统一密码：

```
Test1234
```

## 安装依赖

```bash
npm install
```

## 启动项目

生产模式

```bash
npm start
```

开发模式（自动重启）

```bash
npm run dev
```

## 验证运行

启动成功后，终端会看到类似信息：

```bash
[dotenv@17.2.3] injecting env (2) from .env
Server is running on port 3000
Health check: http://localhost:300/health
Connected to MongoDB
```
