<?php

namespace App\Http\Controllers;

use App\Models\Product;
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
        return view("admin.products.create");
    }

    public function show($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return redirect()
                ->route("admin.products.index")
                ->with("error", "Потребителят не беше намерен.");
        }

        return view("admin.products.show", compact("product"));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:3|max:255',
            'price' => 'required|string|min:1',
        ], [
            'name.required' => 'Заглавието на продуктът е задължително.',
            'price.required' => 'Трябва да въведете цена продукта.',
        ]);

        Product::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'price' => $validated['price'],
        ]);

        return redirect()
            ->route('admin.products.create')
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

        $product->delete();

        return back()->with('success', 'Продуктът беше изтрит успешно.');
    }

    public function destroyAll()
    {
        Product::truncate();
        return back()->with('success', 'Всички потребители, освен вас и админите, бяха изтрити.');
    }
}
