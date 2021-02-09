/* eslint-disable */
import * as path from "path";
import { createConnection, Connection, getRepository, getConnection } from 'typeorm';
import { join } from 'path';
import { UserEntity } from '../src/modules/users/model/user.entity';

async function main() {
  // @ts-ignore
 await createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'chinasdg',
    password: 'chinasdg',
    database: 'chinasdg',
    entities: [UserEntity],
    synchronize: true,
    autoLoadEntities: true,
    migrations: [join(process.cwd(), 'src/seeds/**/*.seed.js')],
    migrationsRun: true,
    charset: 'utf8mb4',
  });



  const input = {
    email: 'superadmin@jinpost.com',
    password: 'superadmin',
    name: 'superadmin',
    role: 'admin'
  };
  // connection.connect();
  // const rep = connection.getRepository(UserEntity);
  // const existingUser = await rep.findOne({ email: input.email });
  // console.log(existingUser);
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
