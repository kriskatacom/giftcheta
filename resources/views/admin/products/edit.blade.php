@extends("layouts.app")

@section("content")
    <div class="flex">
        <x-admin-sidebar />

        <div class="w-full text-lg">
            <div class="mt-4 pb-4 px-5 border-b border-gray-300">
                <h1 class="text-2xl">Редактиране на продукт</h1>
                <p>Полетата със звездичка (*) са задължителни.</p>
            </div>

            <div class="p-5 text-lg">
                <form action="{{ route('admin.products.update', [$product->id]) }}" method="POST"
                    enctype="multipart/form-data" class="text-lg">
                    @csrf
                    @method('PUT')

                    <div class="bg-white border border-gray-200 rounded-lg py-7 px-8 space-y-5">
                        <x-alert-messages />

                        <div class="grid grid-cols-2 gap-5">
                            <div class="space-y-1">
                                <label for="name">Заглавие (*)</label>
                                <input type="text" name="name" value="{{ old('name', $product->name) }}"
                                    placeholder="Въведете заглавието продукта" class="form-control">
                                <p class="text-gray-500 text-sm">Заглавието на продукта ще се използва за показване в
                                    списъци и
                                    страници.</p>
                                @error('name')
                                    <div class="text-red-500">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="space-y-1">
                                <label for="category_id">Категория</label>
                                <select name="category_id" class="form-control">
                                    <option value="">-- Няма категория --</option>
                                    @foreach($categoriesForDropdown as $option)
                                        <option value="{{ $option['id'] }}" {{ isset($product) && $product->categories->contains($option['id']) ? 'selected' : '' }}>
                                            {{ $option['name'] }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>
                        </div>

                        @if($product->featured_image_url)
                            <div class="mb-4">
                                <label class="block mb-2">Текуща снимка</label>
                                <img src="{{ $product->featured_image_url }}" alt="{{ $product->name }}"
                                    class="w-32 h-32 object-cover rounded border">
                            </div>
                        @endif

                        <div class="mb-4">
                            <label for="image" class="block mb-2">Качване на предна снимка</label>
                            <input type="file" id="image" name="image" accept="image/*" class="form-control"
                                onchange="previewImage(event)">
                            @error('image')
                                <div class="text-red-500">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="mb-4" id="image-preview-container" style="display: none;">
                            <label class="block mb-2">Преглед на снимката</label>
                            <img id="image-preview" class="w-32 h-32 object-cover rounded border">
                        </div>

                        <div class="mb-4">
                            <label for="gallery_images" class="block mb-2">Качване на допълнителни снимки</label>
                            <input type="file" id="gallery_images" name="gallery_images[]" accept="image/*" multiple
                                class="form-control" onchange="previewImages(event)">
                        </div>

                        <div class="mb-4" id="images-preview-container" style="display: none;">
                            <label class="block mb-2">Преглед на снимките</label>
                            <div id="images-preview-wrapper" class="flex gap-2 flex-wrap"></div>
                        </div>

                        @if($product->galleryImages()->count())
                            <div class="flex gap-2 flex-wrap">
                                @foreach($product->galleryImages() as $image)
                                    <img src="{{ $image->url }}" alt="{{ $product->name }}"
                                        class="w-32 h-32 object-cover rounded border">
                                @endforeach
                            </div>
                        @endif

                        <div class="grid xl:grid-cols-2 gap-5">
                            <div class="space-y-1">
                                <label for="price">Основна цена (BGN) (*)</label>
                                <input type="text" name="price" value="{{ old('price', $product->price) }}"
                                    placeholder="Въведете основната цена продукта" class="form-control">
                                <p class="text-gray-500 text-sm">Това е основната цена, по която продуктът се продава.</p>
                                @error('price')
                                    <div class="text-red-500">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="space-y-1">
                                <label for="sale_price">Промоционална цена (BGN)</label>
                                <input type="text" name="sale_price" value="{{ old('sale_price', $product->sale_price) }}"
                                    placeholder="Въведете промоционалната цена продукта" class="form-control">
                                <p class="text-gray-500 text-sm">Промоционалната цена ще се показва вместо основната, когато
                                    е зададена.</p>
                                @error('sale_price')
                                    <div class="text-red-500">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>

                        <div class="space-y-1">
                            <label for="short_description">Кратко описание</label>
                            <textarea name="short_description" id="short_description" rows="3"
                                placeholder="Въведете кратко описание продукта"
                                class="form-control">{{ old('short_description', $product->short_description) }}</textarea>
                            <p class="text-gray-500 text-sm">Кратко описание за списъци и картички на продукта.</p>
                            @error('short_description')
                                <div class="text-red-500">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="space-y-1">
                            <label for="description">Подробно описание</label>
                            <textarea name="description" id="description" rows="10"
                                placeholder="Въведете подробно описание продукта"
                                class="form-control">{{ old('description', $product->description) }}</textarea>
                            <p class="text-gray-500 text-sm">Подробно описание за страницата на продукта, включително
                                характеристики и детайли.</p>
                            @error('description')
                                <div class="text-red-500">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="grid xl:grid-cols-3 gap-5">
                            <div class="space-y-1">
                                <label for="stock_quantity">Наличност (брой)</label>
                                <input type="text" name="stock_quantity"
                                    value="{{ old('stock_quantity', $product->stock_quantity) }}"
                                    placeholder="Въведете наличното количество" class="form-control">
                                <p class="text-gray-500 text-sm">Наличност на продукта в склада.</p>
                                @error('stock_quantity')
                                    <div class="text-red-500">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="space-y-1">
                                <label for="manage_stock">Следене на количеството</label>
                                <select name="manage_stock" id="manage_stock" class="form-control">
                                    <option value="1" {{ old('manage_stock', $product->manage_stock) == 1 ? 'selected' : '' }}>Да</option>
                                    <option value="0" {{ old('manage_stock', $product->manage_stock) == 0 ? 'selected' : '' }}>Не</option>
                                </select>
                                <p class="text-gray-500 text-sm">Изберете дали системата да следи наличността.</p>
                            </div>

                            <div class="space-y-1">
                                <label for="in_stock">Наличен</label>
                                <select name="in_stock" id="in_stock" class="form-control">
                                    <option value="1" {{ old('in_stock', $product->in_stock) == 1 ? 'selected' : '' }}>Да
                                    </option>
                                    <option value="0" {{ old('in_stock', $product->in_stock) == 0 ? 'selected' : '' }}>Не
                                    </option>
                                </select>
                                <p class="text-gray-500 text-sm">Дали продуктът е в наличност.</p>
                            </div>
                        </div>

                        <div class="space-y-1">
                            <label for="sku">Номер на продукта (SKU)</label>
                            <input type="text" name="sku" value="{{ old('sku', $product->sku) }}"
                                placeholder="Въведете номер на продукта" class="form-control">
                            <p class="text-gray-500 text-sm">Уникален идентификатор за продукта.</p>
                            @error('sku')
                                <div class="text-red-500">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="space-x-1 flex items-center gap-5">
                            <button type="submit" value="save" class="page-button bg-primary"
                                data-disable-on-click>Запазване</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection
