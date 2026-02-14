import { DataTypes, Model } from "sequelize";
import sequelize from "@/lib/sequelize";

class Color extends Model {}
Color.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: { type: DataTypes.STRING, allowNull: false },
        code: { type: DataTypes.STRING(7) }, // Напр. #FFFFFF
        sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    { sequelize, tableName: "colors", underscored: true },
);

export default Color;
