<?php

namespace App\Http\Controllers;

use App\Models\Category;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

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
        $categoriesForDropdown = $this->buildCategoryOptions($categories);
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
        $categoriesForDropdown = $this->buildCategoryOptions($categories);

        return view("admin.categories.edit", compact("category", "categories", "categoriesForDropdown"));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:3|max:255|unique:categories,name',
            'parent_id' => 'nullable|exists:categories,id',
        ]);

        $slug = Str::slug($validated['name']);
        $originalSlug = $slug;
        $counter = 1;

        while (Category::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter++;
        }

        Category::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'parent_id' => $validated['parent_id'] ?? null,
        ]);

        return redirect()->route('admin.categories')->with('success', 'Категорията е създадена успешно!');
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

        $category->save();

        return redirect()->route('admin.categories')->with('success', 'Категорията е обновена успешно!');
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

        Category::query()->delete();

        return redirect()
            ->route('admin.categories')
            ->with('success', 'Всички категории са изтрити успешно!');
    }

    private function buildCategoryOptions($categories, $parentId = null, $prefix = '')
    {
        $result = [];

        foreach ($categories->where('parent_id', $parentId) as $category) {
            $result[] = ['id' => $category->id, 'name' => $prefix . $category->name];

            $children = $this->buildCategoryOptions($categories, $category->id, $prefix . '- ');
            $result = array_merge($result, $children);
        }

        return $result;
    }
}