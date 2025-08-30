@props([
    'products',
    'title' => 'Продукти'
])

<section>
    <div class="container mx-auto">
        <h2 class="text-3xl font-bold text-center py-10">{{ $title }}</h2>

        @if ($products->count() > 0)
            <ul class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                @foreach ($products as $product)
                    <li>
                        <a href="/products/{{ $product->slug }}" class="bg-white block relative border border-gray-200 rounded-lg overflow-hidden">
                            @if ($product->sale_price)
                                <div class="absolute top-5 left-5 bg-primary text-white p-1 px-3 rounded text-lg">
                                    -{{ number_format($product->price * $product->sale_price / 100, 0) }}%
                                </div>
                            @endif
                            <img src="{{ $product->featured_image_url }}" alt="{{ $product->name }}" class="w-full object-cover">
                            <div class="flex flex-col gap-2 p-5">
                                <h3 class="text-center text-xl">{{ $product->name }}</h3>
                                @if ($product->sale_price)
                                    <p class="text-center text-xl text-primary">{!! format_price($product->sale_price) !!}</p>
                                @else
                                    <p class="text-center text-xl">{!! format_price($product->price) !!}</p>
                                @endif
                            </div>
                        </a>
                    </li>
                @endforeach
            </ul>
        @else
            <div class="text-center text-lg">Няма намерени продукти.</div>
        @endif
    </div>
</section>