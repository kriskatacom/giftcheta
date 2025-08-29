@extends("layouts.app")

@section("content")
    <div class="flex">
        <x-admin-sidebar />

        <div class="w-full text-lg">
            <div class="mt-4 pb-4 px-5 border-b border-gray-300 flex justify-between items-center gap-5">
                <h1 class="text-2xl">Продукти</h1>
                <div class="flex items-center gap-5">
                    <a href="{{ route('admin.products.create') }}">
                        <button class="page-button bg-primary">Създаване</button>
                    </a>
                    <form action="{{ route('admin.products.destroy-all') }}" method="POST"
                        onsubmit="return confirm('Сигурни ли сте, че искате да изтриете всички записи?');">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="page-button bg-primary">Изриване на всички</button>
                    </form>
                </div>
            </div>

            <div class="p-5 text-lg">
                @if(session('success'))
                    <div class="mb-5 rounded-lg bg-green-100 border border-green-400 text-green-700 px-4 py-3">
                        {{ session('success') }}
                    </div>
                @endif

                @if(session('error'))
                    <div class="mb-5 rounded-lg bg-red-100 border border-red-400 text-red-700 px-4 py-3">
                        {{ session('error') }}
                    </div>
                @endif

                <table class="w-full border-collapse border border-gray-300 text-left">
                    <thead class="bg-white">
                        <tr>
                            <th class="font-medium border border-gray-300 px-4 py-2">Снимка</th>
                            <th class="font-medium border border-gray-300 px-4 py-2">Име</th>
                            <th class="font-medium border border-gray-300 px-4 py-2">Кол.</th>
                            <th class="font-medium border border-gray-300 px-4 py-2">Създаден на</th>
                            <th class="font-medium text-right border border-gray-300 px-4 py-2">Опции</th>
                        </tr>
                    </thead>
                    <tbody>
                        @if ($products->count() > 0)
                            @foreach($products as $product)
                                <tr class="bg-white hover:bg-gray-50">
                                    <td class="border border-gray-300 px-4 py-2">
                                        <!-- <img class="max-w-[80px] max-h-[80px]" src="{{ asset('images/products/' . $product->image) }}" alt="{{ $product->name }}"> -->
                                        <img class="h-14 max-h-14 object-cover" src="/images/product-demo.png" alt="{{ $product->name }}">
                                    </td>
                                    <td class="border border-gray-300 px-4 py-2">{{ $product->name }}</td>
                                    <td class="border border-gray-300 px-4 py-2">{{ $product->in_stock }}</td>
                                    <td class="border border-gray-300 px-4 py-2">
                                        {{ $product->created_at->translatedFormat('d F Y, H:i') }}</td>
                                    <td class="border border-gray-300 px-4 py-2 text-right">
                                        <x-action-dropdown :model="$product" route-prefix="admin.products" :actions="['show', 'edit', 'delete']" />
                                    </td>
                                </tr>
                            @endforeach
                        @else
                            <tr class="bg-white hover:bg-gray-50">
                                <td colspan="5" class="text-center text-gray-600 px-4 py-2">Няма намерени потребители.</td>
                            </tr>
                        @endif
                    </tbody>
                </table>
                <div class="mt-5">
                    {{ $products->links() }}
                </div>
            </div>
        </div>
    </div>
@endsection
