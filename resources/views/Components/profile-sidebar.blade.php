<aside class="bg-white border rounded-lg shadow md:col-span-1">
    <nav>
        <ul>
            <li>
                <a href="" class="profile-link-with-icon">
                    <x-heroicon-o-user class="icon" />
                    <span class="with-icon">Профил</span>
                </a>
            </li>

            <li>
                <a href="" class="profile-link-with-icon">
                    <x-heroicon-o-archive-box class="icon" />
                    <span>Поръчки</span>
                </a>
            </li>

            <li>
                <a href="" class="profile-link-with-icon">
                    <x-heroicon-o-cog-6-tooth class="icon" />
                    <span>Настройки</span>
                </a>
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
