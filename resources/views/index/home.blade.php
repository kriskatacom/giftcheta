@extends("layouts.app")

@section("content")
    <header class="relative h-[768px] bg-cover bg-center"
        style="background-image: url('{{ '/images/home-background.png' }}');">
        <div class="absolute inset-0 bg-black/50"></div>

        <div class="relative max-w-2xl h-full mx-auto flex flex-col justify-center items-center">
            <h1 class="text-white text-6xl font-bold text-center">Красота, която трае вечно</h1>
            <p class="text-white text-xl my-5 text-center">Открийте нашата изискана колекция от рози и миниатюрни изкуствени
                цветя – перфектният подарък за всеки повод. Вечни, елегантни и винаги впечатляващи.</p>
            <div class="flex justify-center">
                <a href="/products"
                    class="text-white text-xl py-3 px-5 rounded block bg-primary hover:bg-primary/90">Разгледай
                    колекцията</a>
            </div>
        </div>
    </header>

    <x-product-list :products="$featuredProducts" title="Нови продукти" />
    <x-category-list :categories="$categories" title="Нашите категории" />
    <x-product-list :products="$latestProducts" title="Последни продукти" />
@endsection
