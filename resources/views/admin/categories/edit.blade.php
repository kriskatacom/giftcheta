@extends("layouts.app")

@section("content")
    <div class="flex">
        <x-admin-sidebar />

        <div class="w-full text-lg">
            <div class="mt-4 pb-4 px-5 border-b border-gray-300">
                <h1 class="text-2xl">Редактиране на категория</h1>
                <p>Полетата със звездичка са задължителни.</p>
            </div>

            <div class="p-5 text-lg">
                <form action="{{ route('admin.categories.update', [$category->id]) }}" method="POST" class="text-lg">
                    @csrf
                    @method('PUT')

                    <div class="bg-white border border-gray-200 rounded-lg py-7 px-8 space-y-5">

                        <div class="grid xl:grid-cols-2 gap-5">
                            <div class="space-y-1">
                                <label for="name">Заглавие на категорията (*)</label>
                                <input type="text" name="name" value="{{ $category->name }}"
                                    placeholder="Въведете заглавието категорията" class="form-control">
                                @error('name')
                                    <div class="text-red-500">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="space-y-1">
                                <label for="parent_id">Родителска категория</label>
                                <select name="parent_id" class="form-control">
                                    <option value="">-- Няма родител --</option>
                                    @foreach($categoriesForDropdown as $option)
                                        <option value="{{ $option['id'] }}" 
                                            @if((isset($category) && $category->parent_id == $option['id']) || request()->get('parent_id') == $option['id']) 
                                                selected 
                                            @endif>
                                            {{ $option['name'] }}
                                        </option>
                                    @endforeach
                                </select>
                                @error('parent_id')
                                    <div class="text-red-500">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>

                        <div class="space-y-1">
                            <label for="description">Описание на категорията</label>
                            <textarea name="description" id="description" rows="10" placeholder="Въведете описание категорията" class="form-control">{{ $category->description }}</textarea>
                            @error('description')
                                <div class="text-red-500">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="space-x-1 flex items-center gap-5">
                            <button type="submit" value="save" class="page-button bg-primary" data-disable-on-click>Запазване</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection
