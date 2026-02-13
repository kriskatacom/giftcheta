import { DataTypes, Model } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "@/lib/sequelize";

interface UserAttributes {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    password: string;
    role?: "customer" | "admin";
    status?: "active" | "inactive" | "banned";
    emailVerified?: boolean;
    avatar?: string | null;
    lastLogin?: Date | null;
    bio?: string | null;
}

interface UserCreationAttributes extends Omit<
    UserAttributes,
    "id" | "role" | "status" | "emailVerified"
> {}

interface UserInstance
    extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {
    validatePassword(password: string): Promise<boolean>;
}

const User = sequelize.define<UserInstance>(
    "User",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: () => {
                return crypto.randomUUID();
            },
            primaryKey: true,
        },
        firstName: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM("customer", "admin"),
            defaultValue: "customer",
        },
        status: {
            type: DataTypes.ENUM("active", "inactive", "banned"),
            defaultValue: "active",
        },
        emailVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        lastLogin: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: "users",
        timestamps: true,
        paranoid: true,
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ["email"],
            },
            {
                fields: ["role"],
            },
        ],
        hooks: {
            async beforeCreate(user) {
                user.password = await bcrypt.hash(user.password, 10);
            },
            async beforeUpdate(user) {
                if (user.changed("password")) {
                    user.password = await bcrypt.hash(user.password, 10);
                }
            },
        },
    },
);

export default User;
