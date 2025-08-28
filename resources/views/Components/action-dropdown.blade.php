@props([
    'model',
    'routePrefix',
    'actions' => ['show', 'edit', 'delete'] // по подразбиране всички
])

<div class="relative inline-block text-left">
    <button type="button"
        onclick="this.nextElementSibling.classList.toggle('hidden')" class="py-1 px-2 border border-gray-200 rounded hover:text-white hover:bg-primary">Опции
    </button>

    <div
        class="z-40 origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden"
        role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
        <div class="py-1">
            @if(in_array('show', $actions))
                <a href="{{ route($routePrefix.'.show', $model->id) }}"
                   class="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                   role="menuitem">Преглед</a>
            @endif

            @if(in_array('edit', $actions))
                <a href="{{ route($routePrefix.'.edit', $model->id) }}"
                   class="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                   role="menuitem">Редакция</a>
            @endif

            @if(in_array('delete', $actions))
                <form action="{{ route($routePrefix.'.destroy', $model->id) }}"
                      method="POST" class="inline">
                    @csrf
                    @method('DELETE')
                    <button type="submit"
                            class="text-red-600 block w-full text-left px-4 py-2 text-sm hover:bg-red-100"
                            role="menuitem"
                            onclick="return confirm('Сигурни ли сте, че искате да изтриете този запис?')">
                        Изтриване
                    </button>
                </form>
            @endif
        </div>
    </div>
</div>
