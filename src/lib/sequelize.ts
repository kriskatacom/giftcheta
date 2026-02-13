import { Sequelize } from "sequelize";
import mysql2 from "mysql2"; // 1. Импортирай директно пакета

const globalForSequelize = global as unknown as { sequelize: Sequelize };

export const db =
    globalForSequelize.sequelize ||
    new Sequelize(process.env.DATABASE_URL!, {
        dialect: "mysql",
        dialectModule: mysql2,
        benchmark: true,
    });

if (process.env.NODE_ENV !== "production")
    globalForSequelize.sequelize = db;

export default db;