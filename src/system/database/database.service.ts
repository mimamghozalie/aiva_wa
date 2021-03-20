import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { exec } from 'child_process';

@Injectable()
export class DatabaseService {
  //   constructor() {
  //     setTimeout(() => {
  //       const filename =
  //         'aiva-' + dayjs().format('YYYY-MM-DD') + '_' + dayjs().format('HH-mm');
  //       this.backupDatabase(filename, 'localhost', 'postgres', 'mailer').then(
  //         console.log,
  //       );
  //     }, 4000);
  //   }

  getDatabases() {
    const query = `SELECT d.datname as "Name", pg_catalog.pg_get_userbyid(d.datdba) as "Owner" FROM pg_catalog.pg_database d ORDER BY 1`;
    return getConnection().query(query);
  }

  createDatabase(dbname: string, connectionLimit: number = 4) {
    const query = `
        CREATE DATABASE ${dbname} WITH CONNECTION LIMIT ${connectionLimit}
    `;
    return getConnection().query(query);
  }

  renameDatabase(dbname: string, newName: string) {
    const query = `ALTER DATABASE ${dbname} RENAME ${newName}`;
    return getConnection().query(query);
  }

  updateDatabaseOwner(dbname: string, role: string) {
    const query = `ALTER DATABASE ${dbname} OWNER TO ${role}`;
    return getConnection().query(query);
  }

  dropDatabase(dbname: string) {
    const query = `DROP DATABASE ${dbname}`;
    return getConnection().query(query);
  }

  backupDatabase(
    filename: string,
    host: string = 'localhost',
    role: string,
    dbname: string,
  ) {
    return new Promise((resolve, reject) => {
      const query = `pg_dump -Fp -v -h ${host} -U ${role} -d ${dbname} -f database/backup/${filename}.sql`;
      exec(query, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      });
    });
  }

  restoreDatabase(dbname: string, filename: string) {
    const query = `pg_restore -d ${dbname} -f database/backup/${filename}.sql`;
    getConnection().query(query);
  }

  createRole(name: string, password: string, limitConnection: number = 4) {
    const query = `CREATE ROLE ${name} NOINHERIT LOGIN CONNECTION LIMIT ${limitConnection} ENCRYPTED PASSWORD '${password}'`;

    return getConnection().query(query);
  }

  changeRolePassword(name: string, newPassword: string) {
    const query = `ALTER ROLE ${name} WITH PASSWORD '${newPassword}'`;
    return getConnection().query(query);
  }

  dropRole(name: string) {
    const query = `DROP ROLE ${name}`;
    return getConnection().query(query);
  }

  getTables() {
    const query = `SELECT * FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'`;
    return getConnection().query(query);
  }
}
