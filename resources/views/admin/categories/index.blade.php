@extends("layouts.app")

@section("content")
    <div class="flex">
        <x-admin-sidebar />

        <div class="w-full text-lg">
            <div class="mt-4 pb-4 px-5 border-b border-gray-300 flex justify-between items-center gap-5">
                <h1 class="text-2xl">Категории</h1>
                <div class="flex items-center gap-5">
                    <a href="{{ route('admin.categories.create') }}">
                        <button class="page-button bg-primary">Създаване</button>
                    </a>
                    @if ($categories->count() > 0)
                        <form action="{{ route('admin.categories.destroy-all') }}" method="POST"
                            onsubmit="return confirm('Сигурни ли сте, че искате да изтриете всички записи?');">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="page-button bg-primary">Изриване на всички</button>
                        </form>
                    @endif
                </div>
            </div>

            <div class="p-5 text-lg">
                <x-alert-messages />

                @if ($categories->count() > 0)
                    <ul class="space-y-2">
                        @foreach($categories->where('parent_id', null) as $category)
                            @include('admin.categories.partials.category-item', ['category' => $category, 'level' => 0])
                        @endforeach
                    </ul>
                @else
                    <div class="text-center text-gray-600 px-4 py-2">Няма намерени категории.</div>
                @endif
            </div>
        </div>
    </div>
@endsection