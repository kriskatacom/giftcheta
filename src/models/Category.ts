import { DataTypes, Model } from "sequelize";
import sequelize from "@/lib/sequelize";

interface CategoryAttributes {
    id?: number;
    name: string;
    slug: string;
    heading?: string | null;
    excerpt?: string | null;
    image?: string | null;
    content?: string | null;
    parentId?: number | null;
    sortOrder?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

interface CategoryCreationAttributes extends Omit<
    CategoryAttributes,
    "id" | "createdAt" | "updatedAt"
> {}

class Category
    extends Model<CategoryAttributes, CategoryCreationAttributes>
    implements CategoryAttributes
{
    public id!: number;
    public name!: string;
    public slug!: string;
    public heading!: string | null;
    public excerpt!: string | null;
    public image!: string | null;
    public content!: string | null;
    public parentId!: number | null;
    public sortOrder!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    
    static associate() {
        if (!this.associations.children) {
            this.hasMany(this, { as: "children", foreignKey: "parentId" });
        }
    }
}

Category.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        slug: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        heading: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        excerpt: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        image: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        parentId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            references: {
                model: "categories",
                key: "id",
            },
        },
        sortOrder: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "categories",
        underscored: true,
        timestamps: true,
    },
);

export default Category;
