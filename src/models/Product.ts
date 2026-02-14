import { DataTypes, Model } from "sequelize";
import sequelize from "@/lib/sequelize";

interface ProductAttributes {
    id?: number;
    name: string;
    slug: string;
    description?: string | null;
    shortDescription?: string | null;
    price: number;
    salePrice?: number | null;
    status: "draft" | "published" | "out_of_stock";
    stockQuantity: number;
    categoryId: number;
    image?: string | null;
    isFeatured: boolean;
    sortOrder: number;
    createdAt?: Date;
    updatedAt?: Date;
}

class Product extends Model<ProductAttributes> implements ProductAttributes {
    public id!: number;
    public name!: string;
    public slug!: string;
    public description!: string | null;
    public shortDescription!: string | null;
    public price!: number;
    public salePrice!: number | null;
    public status!: "draft" | "published" | "out_of_stock";
    public stockQuantity!: number;
    public categoryId!: number;
    public image!: string | null;
    public isFeatured!: boolean;
    public sortOrder!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Статичен метод за асоциациите, за да избегнем HMR грешките в Next.js
    static associate(models: any) {
        // Релация към Категория
        this.belongsTo(models.Category, {
            foreignKey: "categoryId",
            as: "category",
        });

        // Много-към-Много релации
        this.belongsToMany(models.Tag, {
            through: "ProductTags",
            as: "productTags",
            foreignKey: "productId",
        });
        this.belongsToMany(models.Color, {
            through: "ProductColors",
            as: "productColors",
            foreignKey: "productId",
        });
        this.belongsToMany(models.Size, {
            through: "ProductSizes",
            as: "productSizes",
            foreignKey: "productId",
        });
    }
}

Product.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: { type: DataTypes.STRING, allowNull: false },
        slug: { type: DataTypes.STRING, allowNull: false, unique: true },
        description: { type: DataTypes.TEXT, allowNull: true },
        shortDescription: { type: DataTypes.TEXT, allowNull: true },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        salePrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
        status: {
            type: DataTypes.ENUM("draft", "published", "out_of_stock"),
            defaultValue: "published",
        },
        stockQuantity: { type: DataTypes.INTEGER, defaultValue: 0 },
        categoryId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: { model: "categories", key: "id" },
        },
        image: { type: DataTypes.STRING, allowNull: true },
        isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false },
        sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    {
        sequelize,
        tableName: "products",
        underscored: true,
        timestamps: true,
    },
);

export default Product;
