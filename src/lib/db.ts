import sql, { ConnectionPool } from 'mssql';

export const db = {
  pool: null as ConnectionPool | null,
  connect: async function (): Promise<void> {
    this.pool = await sql.connect(`Server=${process.env.DB_SERVER},1433;Database=${process.env.DB_NAME};User Id=${process.env.DB_USER};Password=${process.env.DB_PWD};trustServerCertificate=${process.env.NODE_ENV === 'development'}`)
  },
  query: async function (queryString: string): Promise<any> {
    if (!this.pool) {
      await this.connect();
    }
    const result = await sql.query(queryString);
    return result.recordset;
  }
}