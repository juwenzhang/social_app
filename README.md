## My Social Posting App!!

```bash
pnpm install prisma --save-dev
pnpm install @prisma/client
pnpm exec prisma init --datasource-provider mysql
pnpm exec prisma generate
pnpm exec prisma migrate dev --name init
pnpm exec prisma studio
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
