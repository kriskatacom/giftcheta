<?php

namespace App\Http\Controllers;

use DB;
use File;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Category;
use App\Helpers\CategoryHelper;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::with('children')->get();
        return view("admin.categories.index", compact("categories"));
    }

    public function create()
    {
        $categories = Category::all();
        $categoriesForDropdown = CategoryHelper::buildCategoryOptions($categories);
        return view("admin.categories.create", compact("categoriesForDropdown"));
    }

    public function edit($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return redirect()
                ->route('admin.categories')
                ->with('error', 'Категорията не е намерена.');
        }

        $categories = Category::where('id', '!=', $id)->get();
        $categoriesForDropdown = CategoryHelper::buildCategoryOptions($categories);

        return view("admin.categories.edit", compact("category", "categories", "categoriesForDropdown"));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:3|max:255|unique:categories,name',
            'parent_id' => 'nullable|exists:categories,id',
            'description' => 'nullable'
        ], [
            'name.required' => 'Полето за име е задължително.',
            'name.min' => 'Името трябва да е поне :min символа.',
            'name.max' => 'Името не може да надвишава :max символа.',
            'name.unique' => 'Вече съществува категория с това име.',
            'parent_id.exists' => 'Избраната родителска категория не съществува.',
        ]);

        $slug = Str::slug($validated['name']);
        $originalSlug = $slug;
        $counter = 1;

        while (Category::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter++;
        }

        $category = Category::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'parent_id' => $validated['parent_id'] ?? null,
            'description' => $validated['description'] ?? null,
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('images/categories'), $imageName);

            $category->image_url = '/images/categories/' . $imageName;
        }

        return redirect()
            ->route('admin.categories.create')
            ->with('success', 'Категорията е актуализиран успешно!');
    }

    public function update(Request $request, $id)
    {
        $category = Category::find($id);
        if (!$category) {
            return redirect()->route('admin.categories')->with('error', 'Категорията не е намерена.');
        }

        $validated = $request->validate([
            'name' => 'required|string|min:3|max:255|unique:categories,name,' . $category->id,
            'parent_id' => 'nullable|exists:categories,id',
            'description' => 'nullable'
        ], [
            'name.required' => 'Полето за име е задължително.',
            'name.min' => 'Името трябва да е поне :min символа.',
            'name.max' => 'Името не може да надвишава :max символа.',
            'name.unique' => 'Вече съществува категория с това име.',
            'parent_id.exists' => 'Избраната родителска категория не съществува.',
        ]);

        $category->name = $validated['name'];
        $category->parent_id = $validated['parent_id'] ?? null;
        $category->description = $validated['description'] ?? null;

        if ($category->wasChanged('name')) {
            $slug = Str::slug($validated['name']);
            $originalSlug = $slug;
            $counter = 1;

            while (Category::where('slug', $slug)->where('id', '!=', $category->id)->exists()) {
                $slug = $originalSlug . '-' . $counter++;
            }

            $category->slug = $slug;
        }

        if ($request->hasFile('image')) {
            $oldImagePath = public_path($category->image_url);
            if (file_exists($oldImagePath)) {
                @unlink($oldImagePath);
            }

            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('images/categories'), $imageName);

            $category->image_url = '/images/categories/' . $imageName;
        }

        $category->save();

        return redirect()
            ->route('admin.categories.edit', $category->id)
            ->with('success', 'Категорията е актуализиран успешно!');
    }

    public function destroy($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return redirect()
                ->route('admin.categories')
                ->with('error', 'Категорията не е намерена.');
        }

        $category->delete();

        return redirect()
            ->route('admin.categories')
            ->with('success', 'Категорията е изтрита успешно!');
    }

    public function destroyAll()
    {
        DB::table('category_product')->delete();
        Category::all()->each->delete();

        return redirect()
            ->route('admin.categories')
            ->with('success', 'Всички категории и снимки са изтрити успешно!');
    }
}
