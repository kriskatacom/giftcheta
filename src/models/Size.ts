import { DataTypes, Model } from "sequelize";
import sequelize from "@/lib/sequelize";

class Size extends Model {}
Size.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: { type: DataTypes.STRING, allowNull: false },
        width: { type: DataTypes.DECIMAL(10, 2) },
        height: { type: DataTypes.DECIMAL(10, 2) },
        depth: { type: DataTypes.DECIMAL(10, 2) },
        unit: { type: DataTypes.STRING(10), defaultValue: "cm" },
        sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    { sequelize, tableName: "sizes", underscored: true },
);

export default Size;