<li>
    <div class="bg-white p-3 rounded shadow flex items-center justify-between space-x-2"
         style="margin-left: {{ $level * 2 }}rem;">
        <div class="flex items-center space-x-2">
            <span>{{ $category->name }}</span>
            @if($category->children->count() > 0)
                <span class="text-gray-500">({{ $category->children->count() }})</span>
            @endif
        </div>

        <div class="flex space-x-5">
            <a href="{{ route('admin.categories.create', ['parent_id' => $category->id]) }}"
               class="text-green-600 hover:underline" title="Създаване на подкатегория">Създаване</a>

            <a href="{{ route('admin.categories.edit', $category->id) }}"
               class="text-blue-600 hover:underline">Редакция</a>

            <form action="{{ route('admin.categories.destroy', $category->id) }}" method="POST" class="inline">
                @csrf
                @method('DELETE')
                <button type="submit"
                        class="text-red-600 hover:underline"
                        onclick="return confirm('Сигурни ли сте, че искате да изтриете тази категория?');">
                    Изтриване
                </button>
            </form>
        </div>
    </div>

    @if($category->children->count() > 0)
        <ul class="mt-2 space-y-2">
            @foreach($category->children as $child)
                @include('admin.categories.partials.category-item', ['category' => $child, 'level' => $level + 1])
            @endforeach
        </ul>
    @endif
</li>