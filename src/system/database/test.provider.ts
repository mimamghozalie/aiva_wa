import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';

@Injectable()
export class TestDatabaseProvider {
  constructor() {
    setTimeout(() => {
      /**
       * Show tables
       */
      //   getConnection()
      //     .query(
      //       "S",
      //     )
      //     .then((tables) => console.log(tables));
      /**
       * Show databases
       */
      //   getConnection().query('').then(console.log);
      /**
       * Drop Database
       */
      //   getConnection().query('DROP database IF EXISTS mailer').then(console.log);
      /**
       * Create Database
       */
      //   getConnection().query('CREATE database mailer').then(console.log);
      /**
       * === DATABASE ===
       * // show database with owner
       * SELECT d.datname as "Name", pg_catalog.pg_get_userbyid(d.datdba) as "Owner" FROM pg_catalog.pg_database d ORDER BY 1;
       * CREATE DATABASE database_name
       * ALTER DATABASE database_name RENAME TO testhrdb;
       * DROP DATABASE testb
       * ALTER DATABASE database_name OWNER TO new_owner
       * ALTER DATABASE database_name WITH CONNECTION LIMIT 4;
       */
      /**
       * === BACKUP & RESTORE ===
       *
       * pg_dump -Fp -v -h YOUR_HOST -U YOUR_LOGIN -d DATABASE_NAME -f your_file_name.sql
       * pg_restore -d db_name -f filename.sql
       */
      /**
       * === USER ===
       * CREATE USER new_user
       * ALTER USER new_user WITH PASSWORD 'caizi';
       * DROP USER IF EXISTS new_user
       */
      /**
       *  === ROLE ===
       *
       * CREATE ROLE "sasa" NOINHERIT LOGIN CONNECTION LIMIT 4 ENCRYPTED PASSWORD 'sasa';
       */
      /**
       * === TABLES ===
       * SELECT * FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'
       */
    }, 2000);
  }
}
