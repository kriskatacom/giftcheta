<!DOCTYPE html>
<html lang="bg">

<head>
    @vite('resources/css/app.css')
    @vite('resources/js/app.js')
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'GIFTCHETA.COM')</title>
</head>

<body class="bg-gray-100">
    <div class="bg-white border-b border-gray-200 flex items-center h-[100px]">
        <div class="container mx-auto flex justify-between items-center">
            <!-- render logo -->
            <a href="{{ route('home') }}">
                <img src="/images/giftcheta.png" alt="GIFTCHETA.COM" class="h-[80px] w-auto block object-contain"
                    width="200" height="80">
            </a>

            <!-- render search -->
            <form action="{{ route('search') }}" method="GET" class="flex-1 mx-6">
                <div class="relative">
                    <input type="text" name="query" placeholder="Търси продукти..."
                        class="text-xl w-full border border-gray-300 rounded py-4 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                    <x-heroicon-o-magnifying-glass class="icon absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
            </form>

            <!-- render links -->
            <ul class="flex space-x-6 text-lg">
                <li>
                    <a href="{{ Auth::check() ? route('users.profile') : route('users.login') }}"
                        class="icon-with-link">
                        <x-heroicon-o-user class="icon" />
                        <span>Акаунт</span>
                    </a>
                </li>
                <li>
                    <a href="#" class="relative icon-with-link">
                        <x-heroicon-o-shopping-cart class="icon" />
                        <span>Количка</span>
                        <span
                            class="absolute -top-3 left-3 flex justify-center items-center w-6 h-6 p-1 rounded-full text-white bg-red-500">0</span>
                    </a>
                </li>
            </ul>
        </div>
    </div>

    <main>
        @yield('content')
    </main>

    <footer class="bg-white mt-10">
        <div class="container mx-auto py-10 grid md:grid-cols-2 xl:grid-cols-4 gap-10">
            <div>
                <h4 class="text-2xl font-bold mb-5">За нас</h4>
                <ul class="flex flex-col gap-5 text-lg">
                    <li>
                        <a href="{{ route('home') }}">
                            <img src="/images/giftcheta.png" alt="GIFTCHETA.COM"
                                class="h-[80px] w-auto block object-contain" width="200" height="80">
                        </a>
                    </li>
                    <li>
                        <p>
                            GIFTCHETA.COM е онлайн магазин за ръчно изработени, уникални и стилни подаръци за всеки
                            повод –
                            създадени с любов, внимание и усет към детайла.
                        </p>
                    </li>
                    <li class="flex items-center gap-5">
                        <a href="/">
                            <x-simpleicon-facebook class="text-blue-500 icon" />
                        </a>
                        <a href="/">
                            <x-simpleicon-instagram class="text-orange-500 icon" />
                        </a>
                        <a href="/">
                            <x-simpleicon-youtube class="text-red-500 icon" />
                        </a>
                    </li>
                </ul>
            </div>
            <div>
                <h4 class="text-2xl font-bold mb-5">Нашите категории</h4>
                <ul class="flex flex-col gap-2 text-lg">
                    <li>
                        <a href="/" class="icon-with-link">
                            <x-heroicon-o-chevron-right class="icon" />
                            <span>Св. Валентин</span>
                        </a>
                    </li>
                    <li>
                        <a href="/" class="icon-with-link">
                            <x-heroicon-o-chevron-right class="icon" />
                            <span>Коледа</span>
                        </a>
                    </li>
                    <li>
                        <a href="/" class="icon-with-link">
                            <x-heroicon-o-chevron-right class="icon" />
                            <span>Нова година</span>
                        </a>
                    </li>
                    <li>
                        <a href="/" class="icon-with-link">
                            <x-heroicon-o-chevron-right class="icon" />
                            <span>Сватба</span>
                        </a>
                    </li>
                    <li>
                        <a href="/" class="icon-with-link">
                            <x-heroicon-o-chevron-right class="icon" />
                            <span>Ражден ден</span>
                        </a>
                    </li>
                    <li>
                        <a href="/" class="icon-with-link">
                            <x-heroicon-o-chevron-right class="icon" />
                            <span>Имен ден</span>
                        </a>
                    </li>
                    <li>
                        <a href="/" class="icon-with-link">
                            <x-heroicon-o-chevron-right class="icon" />
                            <span>Всички категории</span>
                        </a>
                    </li>
                </ul>
            </div>
            <div>
                <h4 class="text-2xl font-bold mb-5">Правни връзки</h4>
                <ul class="flex flex-col gap-2 text-lg">
                    <li>
                        <a href="/" class="icon-with-link">
                            <x-heroicon-o-chevron-right class="icon" />
                            <span>Политика на поверителност</span>
                        </a>
                    </li>
                    <li>
                        <a href="/" class="icon-with-link">
                            <x-heroicon-o-chevron-right class="icon" />
                            <span>Политика на бисквитки</span>
                        </a>
                    </li>
                    <li>
                        <a href="/" class="icon-with-link">
                            <x-heroicon-o-chevron-right class="icon" />
                            <span>Общи условия</span>
                        </a>
                    </li>
                </ul>
            </div>
            <div>
                <h4 class="text-2xl font-bold mb-5">Контакти</h4>
                <ul class="flex flex-col gap-2 text-lg">
                    <li>
                        <a href="/" class="icon-with-link">
                            <x-heroicon-o-chevron-right class="icon" />
                            <span>Тел: {{ env("PHONE") }}</span>
                        </a>
                    </li>
                    <li>
                        <a href="/" class="icon-with-link">
                            <x-heroicon-o-chevron-right class="icon" />
                            <span>Гр. Дупница</span>
                        </a>
                    </li>
                    <li>
                        <a href="/" class="icon-with-link">
                            <x-heroicon-o-chevron-right class="icon" />
                            <span>Име: {{ env("OWNER_NAME") }}</span>
                        </a>
                    </li>
                    <li>
                        <a href="/" class="icon-with-link">
                            <x-heroicon-o-chevron-right class="icon" />
                            <span>Контакти</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <div class="py-5 bg-black text-white text-center text-lg">
            &copy; {{ now()->year }} Всички права запазени.
        </div>
    </footer>
</body>

</html>
