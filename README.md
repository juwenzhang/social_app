# My Social Posting App!!
> https://vvsqgfab4ks.feishu.cn/wiki/PXnyw99eNiKQLfkf8yocnbuznSw?from=from_copylink

> If you want to improve your develop efficiency, you can use install prisma-plugin into your vscode or trae.

> If you are a webStorm user, please find similar plugin in webStorm. 

```bash
pnpm install prisma --save-dev
pnpm install @prisma/client
pnpm exec prisma init --datasource-provider mysql
pnpm exec prisma generate
pnpm exec prisma migrate dev --name init
pnpm exec prisma studio
pnpm exec prisma db push
……
```
* update your .env file
```bash
DATABASE_URL="mysql://root:your_password@localhost:3306/social_app"
```
> tips: prisma use psql as default, you can change it to mysql in your.prisma file

> if you do not direct '--datasource-provider mysql', it will use psql as default 

> if you also want to use mysql, you can update 'prisam/schema.prisma' and .env to change it to mysql

## oauth authenticate
* We Will Use Clerk to Authenticate Users

## mysql local --> docker mysql
```bash
docker run --name my-mysql -e MYSQL_ROOT_PASSWORD=your_password -p 3306:3306 -d mysql:8.0
docker ps
docker exec -it my-mysql mysql -uroot -p
```
```bash
# 本地具备 mysql 服务的话
win + R

services.msc

net stop mysql80
net start mysql80
sc delete 80
```

## redis local --> docker redis
```bash
docker run --name my-redis -p 6379:6379 -d redis:latest
docker ps
docker exec -it my-redis redis-cli
```
```bash
# 本地具备 redis 服务的话
win + R
services.msc
redis-server --service-uninstall
net stop redis6379
net start redis6379
sc delete redis6379
```

## mongodb local --> docker mongodb
```bash
docker run --name my-mongodb -p 27017:27017 -d mongo:latest
docker ps
docker exec -it my-mongodb mongo
```
```bash
# 本地具备 mongodb 服务的话
win + R
services.msc
mongodb --service-uninstall
net stop mongodb
net start mongodb
sc delete mongodb
```

## pgsql local --> docker pgsql
```bash
docker run --name my-pgsql -e POSTGRES_PASSWORD=your_password -p 5432:5432 -d postgres:latest
docker ps
docker exec -it my-pgsql psql -U postgres
```
```bash
# 本地具备 pgsql 服务的话
win + R
services.msc
postgres --service-uninstall
net stop postgres
net start postgres
sc delete postgres
```

## use mysql2 to connect mysql
* `pnpm install mysql2`
### connect mysql nomally
```typescript
import mysql from mysql2;

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'social_app',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
})
```

### connect mysql with Promise
```typescript
import mysql from mysql2/promise;

async function main() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '451674jh',
            database: 'social_app'
        });
        const [rows, fields] = await connection.execute('SELECT * FROM your_table');
        console.log('查询结果:', rows);
        await connection.end();
    } catch (error) {
        console.error('发生错误:', error);
    }
}

main();
```

## use sequelize to connect mysql
* `pnpm install sequelize mysql2`
```typescript
import { Sequelize } from 'sequelize';
const sequelize = new Sequelize('social_app', 'root', 'your_password', {
    host: 'localhost',
    dialect: 'mysql'
});

async function main() {
    try {
        await sequelize.authenticate();
        console.log('数据库连接成功');
    } catch (error) {
        console.error('数据库连接失败:', error);
    }
}
```

## use knex to connect mysql
* `pnpm install knex mysql2`
```typescript
import knex from 'knex';
const knexInstance = knex({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'your_password',
        database: 'social_app'
    }
});

async function main() {
    try {
        await knexInstance.raw('SELECT 1+1 AS result');
        console.log('数据库连接成功');
    } catch (error) {
        console.error('数据库连接失败:', error);
    }
}

main();
```

## use typeorm to connect mysql
* `pnpm install typeorm mysql2`
```typescript
import { 
  createConnection, 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  getRepository 
} from 'typeorm';

// 定义实体
@Entity()
class YourEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}

// 建立连接并执行查询
createConnection({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '451674jh',
    database: 'social_app',
    entities: [YourEntity],
    synchronize: true
}).then(async (connection) => {
    const repository = getRepository(YourEntity);
    const results = await repository.find();
    console.log('查询结果:', results);
    await connection.close();
}).catch((error) => {
    console.error('发生错误:', error);
});
```

## database configs
```bash
# ennter mysql container service
docker exec -it your_mysql_container_name mysql -uroot -p

# your database name
create database social_app; 

# use your database
use social_app;  
```

## use prisma define table
> * This is a demo of prisma define table!!!
```prisma
model User {
  id          Int @id @default(autoincrement())
  name        String
  email       String @unique
  password    String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```




          
The database design of the social application is defined in the `c:\Users\76433水逆信封\Desktop\next_project\social_app\prisma\schema.prisma` file, using Prisma as the ORM tool. Here's a detailed breakdown of the database schema:

### 1. Generator and Datasource Configuration
```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```
- **Generator**: Generates a Prisma client in JavaScript, which will be output to the `../src/generated/prisma` directory.
- **Datasource**: Specifies the database type as MySQL, and the connection URL is read from the environment variable `DATABASE_URL`.

### 2. Database Tables

#### 2.1 Test Table
```prisma
model Test {
  id           Int          @id               @default(autoincrement())
  name         String       @db.VarChar(255)
  desc         String?
  number       Int
  isPublished  Boolean
}
```
- **id**: Auto - incremented primary key.
- **name**: A string field with a maximum length of 255 characters.
- **desc**: An optional string field.
- **number**: An integer field.
- **isPublished**: A boolean field.

#### 2.2 User Table
```prisma
model User {
  id            String      @id               @unique
  username      String      @db.VarChar(32)   @unique
  avatar        String?
  cover         String?
  name          String?
  description   String?
  enterprise    String?
  city          String?
  school        String?
  github_name   String?
  github_link   String?
  juejin_name   String?
  juejin_link   String?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  posts         Post[]
  likes         Like[]
  comments      Comment[]
  followers     Follower[]  @relation("UserFollowers")
  following     Follower[]  @relation("UserFollowings")
  sentRequests  FollowRequest[]  @relation("FollowRequestSend")
  receivedRequests  FollowRequest[]  @relation("FollowRequestReceived")
  blocks        Block[]     @relation("BlockSend")
  blocked       Block[]     @relation("BlockReceived")
  stories       Story[]
}
```
- **id**: A unique string primary key.
- **username**: A unique string field with a maximum length of 32 characters.
- **Other fields**: Optional fields storing user - related information.
- **Relationships**: Links to other tables such as `Post`, `Like`, `Comment`, etc.

#### 2.3 Post Table
```prisma
model Post {
  id            Int         @id               @default(autoincrement())
  desc          String?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  user          User        @relation(fields:[userId], references:[id], onDelete:Cascade)
  userId        String
  likes         Like[]
  comments      Comment[]
}
```
- **id**: Auto - incremented primary key.
- **desc**: An optional string field for post content.
- **Relationships**: Linked to the `User` table, and has relationships with `Like` and `Comment` tables.

#### 2.4 Comment Table
```prisma
model Comment {
  id            Int         @id               @default(autoincrement())
  content       String?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  user          User        @relation(fields:[userId], references:[id], onDelete:Cascade)
  userId        String
  post          Post        @relation(fields:[postId], references:[id], onDelete:Cascade)
  postId        Int
  likes         Like[]
}
```
- **id**: Auto - incremented primary key.
- **content**: An optional string field for comment content.
- **Relationships**: Linked to the `User` and `Post` tables, and has a relationship with the `Like` table.

#### 2.5 Like Table
```prisma
model Like {
  id            Int         @id               @default(autoincrement())
  createdAt     DateTime    @default(now())
  user          User        @relation(fields:[userId], references:[id], onDelete:Cascade)
  userId        String
  post          Post?       @relation(fields:[postId], references:[id], onDelete:Cascade)
  postId        Int?
  comment       Comment?    @relation(fields:[commentId], references:[id], onDelete:Cascade)
  commentId     Int?
}
```
- **id**: Auto - incremented primary key.
- **Relationships**: Linked to the `User` table, and optionally linked to the `Post` and `Comment` tables.

#### 2.6 Follower Table
```prisma
model Follower {
  id            Int         @id               @default(autoincrement())
  createdAt     DateTime    @default(now())
  follower      User        @relation("UserFollowers", fields:[followerId], references:[id], onDelete:Cascade)
  followerId    String
  following     User        @relation("UserFollowings", fields:[followingId], references:[id], onDelete:Cascade)
  followingId   String
  @@index([followerId, followingId])
}
```
- **id**: Auto - incremented primary key.
- **Relationships**: Represents the follow relationship between users, with an index on `followerId` and `followingId`.

#### 2.7 FollowRequest Table
```prisma
model FollowRequest {
  id            Int         @id               @default(autoincrement())
  createdAt     DateTime    @default(now())
  sender        User        @relation("FollowRequestSend", fields:[senderId], references:[id], onDelete:Cascade)
  senderId      String
  receiver      User        @relation("FollowRequestReceived", fields:[receiverId], references:[id], onDelete:Cascade)
  receiverId    String

  @@unique([senderId, receiverId])
}
```
- **id**: Auto - incremented primary key.
- **Relationships**: Represents follow requests between users, with a unique constraint on `senderId` and `receiverId`.

#### 2.8 Block Table
```prisma
model Block {
  id            Int         @id               @default(autoincrement())
  createdAt     DateTime    @default(now())
  blocker       User        @relation("BlockSend", fields:[blockerId], references:[id], onDelete:Cascade)
  blockerId     String
  blocked       User        @relation("BlockReceived", fields:[blockedId], references:[id], onDelete:Cascade)
  blockedId     String
  @@unique([blockerId, blockedId])
}
```
- **id**: Auto - incremented primary key.
- **Relationships**: Represents the block relationship between users, with a unique constraint on `blockerId` and `blockedId`.

#### 2.9 Story Table
```prisma
model Story {
  id            Int         @id               @default(autoincrement())
  createdAt     DateTime    @default(now())
  expiresAt     DateTime
  user          User        @relation(fields:[userId], references:[id], onDelete:Cascade)
  userId        String      @unique
}
```
- **id**: Auto - incremented primary key.
- **expiresAt**: A datetime field indicating when the story expires.
- **Relationships**: Linked to the `User` table, with a unique constraint on `userId`.

In summary, this database schema is designed to support a social application, including user management, post creation, commenting, liking, following, follow requests, blocking, and story sharing. 
        
## ngrok
```bash
docker pull ngrok/ngrok
docker run --rm -it -e NGROK_AUTHTOKEN=your_token ngrok/ngrok http 3000

# or
https://ngrok.com/downloads/windows?tab=download
ngrok config add-authtoken <token>
ngrok http <you_want_ngrok_port>
```

## localtunnel
```bash
npm install -g localtunnel

lt --port your_port --subdomain your_subdomain --password your_password --allow-remote
```