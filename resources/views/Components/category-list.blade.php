@props([
    'categories',
    'title' => 'Категории'
])

<section class="mb-10">
    <div class="container mx-auto">
        <h2 class="text-3xl font-bold text-center py-10">{{ $title }}</h2>

        @if ($categories->count() > 0)
            <ul class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                @foreach ($categories as $category)
                    <li>
                        <a href="/categories/{{ $category->slug }}" class="bg-white block border border-gray-200 rounded-lg overflow-hidden">
                            @if ($category->image_url)    
                                <img src="{{ $category->image_url }}" alt="{{ $category->name }}" class="w-full object-cover">
                            @endif
                            <div class="flex flex-col gap-2 p-5">
                                <h3 class="text-center text-xl">{{ $category->name }}</h3>
                                @if ($category->description)
                                    <p class="text-center text-xl">{{ $category->description }}</p>
                                @endif
                            </div>
                        </a>
                    </li>
                @endforeach
            </ul>
        @else
            <div class="text-center text-lg">Няма намерени категории.</div>
        @endif
    </div>
</section>