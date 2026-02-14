import { DataTypes, Model } from "sequelize";
import sequelize from "@/lib/sequelize";

class Tag extends Model {}
Tag.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: { type: DataTypes.STRING, allowNull: false },
        slug: { type: DataTypes.STRING, unique: true },
        heading: { type: DataTypes.STRING },
    },
    { sequelize, tableName: "tags", underscored: true },
);

export default Tag;
