<?php

namespace App\Http\Controllers;

use App\Helpers\CategoryHelper;
use App\Models\Category;
use App\Models\Product;
use DB;
use File;
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
            'price' => 'required|numeric|min:0.01',
            'sale_price' => 'nullable|numeric|lte:price',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'stock_quantity' => 'nullable|integer|min:0',
            'manage_stock' => 'required|boolean',
            'in_stock' => 'required|boolean',
            'sku' => 'nullable|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
        ], [
            'name.required' => 'Заглавието на продукта е задължително.',
            'name.min' => 'Заглавието трябва да е поне :min символа.',
            'name.max' => 'Заглавието не може да бъде по-дълго от :max символа.',

            'price.required' => 'Трябва да въведете цена на продукта.',
            'price.numeric' => 'Цената трябва да бъде число.',
            'price.min' => 'Цената трябва да бъде по-голяма от 0.',

            'sale_price.numeric' => 'Промоционалната цена трябва да бъде число.',
            'sale_price.lte' => 'Промоционалната цена не може да е по-висока от основната.',

            'stock_quantity.integer' => 'Наличността трябва да е цяло число.',
            'stock_quantity.min' => 'Наличността не може да бъде отрицателна.',

            'manage_stock.required' => 'Моля, посочете дали да се управлява наличността.',
            'manage_stock.boolean' => 'Невалидна стойност за управление на наличностите.',

            'in_stock.required' => 'Моля, посочете дали продуктът е в наличност.',
            'in_stock.boolean' => 'Невалидна стойност за наличност.',

            'sku.max' => 'SKU не може да надвишава :max символа.',

            'category_id.exists' => 'Избраната категория не съществува.',
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

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('images/products'), $imageName);

            $oldFeatured = $product->images()->where('is_featured', true)->first();

            if ($oldFeatured) {
                $oldImagePath = public_path($oldFeatured->url);
                if (File::exists($oldImagePath)) {
                    File::delete($oldImagePath);
                }

                $oldFeatured->delete();
            }

            $product->images()->create([
                'url' => '/images/products/' . $imageName,
                'is_featured' => true,
            ]);
        }

        return redirect()
            ->route('admin.products.edit', $product->id)
            ->with('success', 'Продуктът е актуализиран успешно!');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:3|max:255',
            'price' => 'required|numeric|min:0.01',
            'sale_price' => 'nullable|numeric|lte:price',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'stock_quantity' => 'nullable|integer|min:0',
            'manage_stock' => 'required|boolean',
            'in_stock' => 'required|boolean',
            'sku' => 'nullable|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
        ], [
            'name.required' => 'Заглавието на продукта е задължително.',
            'name.min' => 'Заглавието трябва да е поне :min символа.',
            'name.max' => 'Заглавието не може да бъде по-дълго от :max символа.',

            'price.required' => 'Трябва да въведете цена на продукта.',
            'price.numeric' => 'Цената трябва да бъде число.',
            'price.min' => 'Цената трябва да бъде по-голяма от 0.',

            'sale_price.numeric' => 'Промоционалната цена трябва да бъде число.',
            'sale_price.lte' => 'Промоционалната цена не може да е по-висока от основната.',

            'stock_quantity.integer' => 'Наличността трябва да е цяло число.',
            'stock_quantity.min' => 'Наличността не може да бъде отрицателна.',

            'manage_stock.required' => 'Моля, посочете дали да се управлява наличността.',
            'manage_stock.boolean' => 'Невалидна стойност за управление на наличностите.',

            'in_stock.required' => 'Моля, посочете дали продуктът е в наличност.',
            'in_stock.boolean' => 'Невалидна стойност за наличност.',

            'sku.max' => 'SKU не може да надвишава :max символа.',

            'category_id.exists' => 'Избраната категория не съществува.',
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

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('images/products'), $imageName);

            $product->images()->update(['is_featured' => false]);

            $product->images()->create([
                'url' => '/images/products/' . $imageName,
                'is_featured' => true,
            ]);
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