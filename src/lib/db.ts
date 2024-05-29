import sql, { ConnectionPool, IResult } from 'mssql';
import fs from 'fs';
import path from 'path';

export const db = {
  pool: null as ConnectionPool | null,
  connect: async function (): Promise<void> {
    this.pool = await sql.connect(`Server=${process.env.DB_SERVER},1433;Database=${process.env.DB_NAME};User Id=${process.env.DB_USER};Password=${process.env.DB_PWD};trustServerCertificate=${process.env.NODE_ENV === 'development'}`);
  },
  readSqlFile: function (filePath: string): string | null {
    const fullPath = path.join('src', 'app', 'queries', `${filePath}.sql`);
    try {
      return fs.readFileSync(fullPath, { encoding: 'utf8' });
    } catch (error) {
      console.error('Failed to read the SQL file:', error);
      return null;
    }
  },
  query: async function (queryString: string, params: { [key: string]: any } = {}): Promise<IResult<any>> {
    if (!this.pool) {
      await this.connect();
    }
    const request = this.pool!.request();
    for (const key in params) {
      request.input(key, params[key]);
    }
    return await request.query(queryString);
  },
  queryFromPath: async function <T>(filePath: string, params: { [key: string]: any } = {}): Promise<T[]> {
    try {
      const queryString = this.readSqlFile(filePath);
      if (!queryString) throw new Error('Could not read sql from path: ' + filePath);
      const result = await this.query(queryString, params);
      return result.recordset;
    } catch (error) {
      console.error('Error executing query from path:', error);
      throw error;
    }
  }
};