<?php

namespace App\Helpers;

class CategoryHelper
{
    public static function buildCategoryOptions($categories, $parentId = null, $prefix = '')
    {
        $result = [];

        foreach ($categories->where('parent_id', $parentId) as $category) {
            $result[] = ['id' => $category->id, 'name' => $prefix . $category->name];

            $children = self::buildCategoryOptions($categories, $category->id, $prefix . '- ');
            $result = array_merge($result, $children);
        }

        return $result;
    }
}