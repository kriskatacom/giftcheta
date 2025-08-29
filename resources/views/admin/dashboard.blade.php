@extends("layouts.app")

@section("content")
    <div class="flex">
        <x-admin-sidebar />

        <div class="space-y-5 w-full text-lg">
            <h1 class="text-2xl border-b border-gray-200 py-5 px-6">Табло</h1>

            <ul class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-6 gap-5">
                <li>
                    <a href="#"
                        class="bg-white text-center block py-8 border border-gray-200 rounded hover:text-white hover:bg-primary">
                        <div class="text-4xl">0</div>
                        <div class="text-2xl">Дневен оборот</div>
                    </a>
                </li>
                <li>
                    <a href="#"
                        class="bg-white text-center block py-8 border border-gray-200 rounded hover:text-white hover:bg-primary">
                        <div class="text-4xl">0</div>
                        <div class="text-2xl">Месечен оборот</div>
                    </a>
                </li>
                <li>
                    <a href="#"
                        class="bg-white text-center block py-8 border border-gray-200 rounded hover:text-white hover:bg-primary">
                        <div class="text-4xl">0</div>
                        <div class="text-2xl">Тримесечен оборот</div>
                    </a>
                </li>
                <li>
                    <a href="#"
                        class="bg-white text-center block py-8 border border-gray-200 rounded hover:text-white hover:bg-primary">
                        <div class="text-4xl">0</div>
                        <div class="text-2xl">Годишен оборот</div>
                    </a>
                </li>
            </ul>

            <!-- Управление на ресурси -->
            <ul class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-6 gap-5">
                <li>
                    <a href="{{ route('admin.orders') }}"
                        class="bg-white text-center block py-8 border border-gray-200 rounded hover:text-white hover:bg-primary">
                        <div class="text-4xl">{{ $ordersCount ?? 0 }}</div>
                        <div class="text-2xl">Поръчки</div>
                    </a>
                </li>
                <li>
                    <a href="{{ route('admin.users') }}"
                        class="bg-white text-center block py-8 border border-gray-200 rounded hover:text-white hover:bg-primary">
                        <div class="text-4xl">{{ $users ?? 0 }}</div>
                        <div class="text-2xl">Потребители</div>
                    </a>
                </li>
                <li>
                    <a href="{{ route('admin.products') }}"
                        class="bg-white text-center block py-8 border border-gray-200 rounded hover:text-white hover:bg-primary">
                        <div class="text-4xl">{{ $products ?? 0 }}</div>
                        <div class="text-2xl">Продукти</div>
                    </a>
                </li>
                <li>
                    <a href="{{ route('admin.categories') }}"
                        class="bg-white text-center block py-8 border border-gray-200 rounded hover:text-white hover:bg-primary">
                        <div class="text-4xl">{{ $categories ?? 0 }}</div>
                        <div class="text-2xl">Категории</div>
                    </a>
                </li>
            </ul>
        </div>
    </div>
@endsection