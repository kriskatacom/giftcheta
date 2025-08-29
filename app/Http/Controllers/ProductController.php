<?php

namespace App\Http\Controllers;

use App\Helpers\CategoryHelper;
use App\Models\Category;
use App\Models\Product;
use DB;
use Illuminate\Http\Request;
use Str;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::orderBy("created_at", "desc")->paginate(10);
        return view("admin.products.index", compact("products"));
    }

    public function create()
    {
        $categories = Category::all();
        $categoriesForDropdown = CategoryHelper::buildCategoryOptions($categories);
        return view("admin.products.create", compact("categoriesForDropdown"));
    }

    public function show($id)
    {
        $product = Product::with('categories')->find($id);

        if (!$product) {
            return redirect()
                ->route("admin.products.index")
                ->with("error", "Потребителят не беше намерен.");
        }

        return view("admin.products.show", compact("product"));
    }

    public function edit($id)
    {
        $product = Product::with('categories')->find($id);

        if (!$product) {
            return redirect()
                ->route("admin.products.index")
                ->with("error", "Потребителят не беше намерен.");
        }

        $categories = Category::all();
        $categoriesForDropdown = CategoryHelper::buildCategoryOptions($categories);

        return view("admin.products.edit", compact("product", "categoriesForDropdown"));
    }

    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return redirect()
                ->route("admin.products.index")
                ->with("error", "Потребителят не беше намерен.");
        }

        $validated = $request->validate([
            'name' => 'required|string|min:3|max:255',
            'price' => 'required|string|min:1',
            'sale_price' => 'nullable|string',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'stock_quantity' => 'nullable|integer|min:0',
            'manage_stock' => 'required|boolean',
            'in_stock' => 'required|boolean',
            'sku' => 'nullable|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
        ], [
            'name.required' => 'Заглавието на продукта е задължително.',
            'price.required' => 'Трябва да въведете цена на продукта.',
        ]);

        $product->update([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'price' => $validated['price'],
            'sale_price' => $validated['sale_price'] ?? null,
            'short_description' => $validated['short_description'] ?? null,
            'description' => $validated['description'] ?? null,
            'stock_quantity' => $validated['stock_quantity'] ?? 0,
            'manage_stock' => $validated['manage_stock'],
            'in_stock' => $validated['in_stock'],
            'sku' => $validated['sku'] ?? null,
        ]);

        if ($validated['category_id']) {
            $product->categories()->sync($validated['category_id']);
        }

        return redirect()
            ->route('admin.products.edit', $product->id)
            ->with('success', 'Продуктът е актуализиран успешно!');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:3|max:255',
            'price' => 'required|string|min:1',
            'sale_price' => 'nullable|string',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'stock_quantity' => 'nullable|integer|min:0',
            'manage_stock' => 'required|boolean',
            'in_stock' => 'required|boolean',
            'sku' => 'nullable|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
        ], [
            'name.required' => 'Заглавието на продукта е задължително.',
            'price.required' => 'Трябва да въведете цена на продукта.',
        ]);

        $product = Product::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'price' => $validated['price'],
            'sale_price' => $validated['sale_price'] ?? null,
            'short_description' => $validated['short_description'] ?? null,
            'description' => $validated['description'] ?? null,
            'stock_quantity' => $validated['stock_quantity'] ?? 0,
            'manage_stock' => $validated['manage_stock'],
            'in_stock' => $validated['in_stock'],
            'sku' => $validated['sku'] ?? null,
        ]);

        if ($validated['category_id']) {
            $product->categories()->sync($validated['category_id']);
        }

        return redirect()
            ->route('admin.products')
            ->with('success', 'Продуктът е създаден успешно!');
    }

    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return redirect()
                ->route('admin.products')
                ->with('error', 'Продуктът не беше намерен.');
        }

        $product->categories()->detach();

        $product->delete();

        return back()->with('success', 'Продуктът беше изтрит успешно.');
    }

    public function destroyAll()
    {
        DB::table('category_product')->delete();

        Product::query()->delete();

        return back()->with('success', 'Всички продукти бяха изтрити успешно!');
    }
}
