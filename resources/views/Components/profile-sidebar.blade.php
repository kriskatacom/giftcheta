@php
    $isActive = request()->routeIs('users.profile');
@endphp

<aside class="bg-white border rounded-lg shadow md:col-span-1">
    <nav>
        <ul>
            <li>
                <x-profile-sidebar-link route="users.profile" icon="heroicon-o-user">
                    Профил
                </x-profile-sidebar-link>
            </li>
            <li>
                <x-profile-sidebar-link route="users.orders" icon="heroicon-o-archive-box">
                    Поръчки
                </x-profile-sidebar-link>
            </li>
            <li>
                <x-profile-sidebar-link route="users.settings" icon="heroicon-o-cog-6-tooth">
                    Настройки
                </x-profile-sidebar-link>
            </li>
        </ul>

        <form method="POST" action="{{ route('users.logout') }}">
            @csrf
            @method("DELETE")
            <button type="submit" class="profile-link-with-icon group w-full">
                <x-heroicon-o-arrow-left-on-rectangle class="icon" />
                <span class="group-hover:text-white text-primary">Изход</span>
            </button>
        </form>
    </nav>
</aside>