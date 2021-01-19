import { createConnection, Connection, getRepository } from 'typeorm';
import { join } from 'path';
import { UserEntity } from 'src/users/user.entity';

async function main() {
  console.log('calling')
  const connection = await createConnection({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [UserEntity],
    synchronize: true,
    migrations: [join(process.cwd(), 'src/seeds/**/*.seed.js')],
    migrationsRun: true,
    charset: 'utf8mb4',
  });

  const input = {
    email: 'superadmin@jinpost.com',
    password: 'superadmin',
    name: 'superadmin',
  };
  const user = getRepository(UserEntity).findOne(1);
  console.log(user);
}

main()
  .then(() => {
    console.log('DB seed successful');
    process.exit(0);
  })
  .catch((e) => {
    console.log('DB seed failed');
    console.error({ e });
    process.exit(1);
  });
