import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/lib/sequelize";

interface ProductAttributes {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    shortDescription?: string | null;
    price: number;
    salePrice?: number | null;
    status: "draft" | "published" | "out_of_stock" | "active"; // Добавено "active" от данните
    stockQuantity: number;
    categoryId?: number | null; // Променено на optional/null заради твоите данни
    image?: string | null;
    images?: string[] | string | null; // За галерията от снимки
    isFeatured: boolean;
    sortOrder: number;
    createdAt?: Date;
    updatedAt?: Date;
}

// Дефинираме кои полета са незадължителни при създаване
interface ProductCreationAttributes extends Optional<
    ProductAttributes,
    "id" | "createdAt" | "updatedAt"
> {}

class Product
    extends Model<ProductAttributes, ProductCreationAttributes>
    implements ProductAttributes
{
    public id!: number;
    public name!: string;
    public slug!: string;
    public description!: string | null;
    public shortDescription!: string | null;
    public price!: number;
    public salePrice!: number | null;
    public status!: "draft" | "published" | "out_of_stock" | "active";
    public stockQuantity!: number;
    public categoryId!: number | null;
    public image!: string | null;
    public images!: string[] | string | null;
    public isFeatured!: boolean;
    public sortOrder!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models: any) {
        this.belongsTo(models.Category, {
            foreignKey: "categoryId",
            as: "category",
        });

        this.belongsToMany(models.Tag, {
            through: "product_tags",
            as: "productTags",
            foreignKey: "productId",
        });

        this.belongsToMany(models.Color, {
            through: "product_colors",
            as: "productColors",
            foreignKey: "productId",
        });

        this.belongsToMany(models.Size, {
            through: "product_sizes",
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
        name: { type: DataTypes.STRING(255), allowNull: false },
        slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
        description: { type: DataTypes.TEXT, allowNull: true },
        shortDescription: { type: DataTypes.TEXT, allowNull: true },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
            get() {
                const value = this.getDataValue("price");
                return value ? parseFloat(value.toString()) : 0;
            },
        },
        salePrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            get() {
                const value = this.getDataValue("salePrice");
                return value ? parseFloat(value.toString()) : null;
            },
        },
        status: {
            type: DataTypes.ENUM(
                "draft",
                "published",
                "out_of_stock",
                "active",
            ),
            defaultValue: "active",
        },
        stockQuantity: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            field: "stock_quantity",
        },
        categoryId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            references: { model: "categories", key: "id" },
            field: "category_id",
        },
        image: { type: DataTypes.STRING(255), allowNull: true },
        images: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        isFeatured: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: "is_featured",
        },
        sortOrder: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            field: "sort_order",
        },
    },
    {
        sequelize,
        tableName: "products",
        underscored: true,
        timestamps: true,
    },
);

export default Product;
