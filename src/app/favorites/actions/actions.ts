"use server";

import { getDb } from "@/lib/db";
import { Product } from "@/lib/types";
import { ProductService } from "@/lib/services/product-service";

const productService = new ProductService(getDb());

export async function getProductsByIds(ids: number[]): Promise<Product[]> {
    const products = await productService.getProductsByIdsDetailed(ids);
    return products;
}