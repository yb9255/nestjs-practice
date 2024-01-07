import { DataSource, DataSourceOptions } from 'typeorm';

export const appDataSource = new DataSource({
  type: process.env.NODE_ENV === 'production' ? 'postgres' : 'sqlite',
  database:
    process.env.NODE_ENV === 'production'
      ? process.env.DATABASE_URL
      : 'db.sqlite',
  entities: ['**/*.entity.ts'],
  migrations: [__dirname + '/migrations/*.ts'],
} as DataSourceOptions);
