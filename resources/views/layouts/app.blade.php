<!DOCTYPE html>
<html lang="bg">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'GIFTCHETA.COM')</title>
    @vite('resources/css/app.css')
    @vite('resources/js/app.js')
</head>

<body class="bg-gray-100">
    <div class="bg-white border-b border-gray-200 flex items-center h-[100px]">
        <div class="container mx-auto flex justify-between items-center">
            <!-- render logo -->
            <a href="{{ route('home') }}">
                <img src="/images/giftcheta.png" alt="GIFTCHETA.COM" class="h-[80px] w-auto">
            </a>

            <!-- render search -->
            <form action="{{ route('search') }}" method="GET" class="flex-1 mx-6">
                <div class="relative">
                    <input type="text" name="query" placeholder="Търси продукти..." class="text-xl w-full border border-gray-300 rounded py-4 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                    <x-heroicon-o-magnifying-glass class="icon absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
            </form>

            <!-- render links -->
            <ul class="flex space-x-6 text-lg">
                <li>
                    <a href="#" class="icon-with-link">
                        <x-heroicon-o-user class="icon" />
                        <span>Акаунт</span>
                    </a>
                </li>
                <li>
                    <a href="#" class="relative icon-with-link">
                        <x-heroicon-o-shopping-cart class="icon" />
                        <span>Количка</span>
                        <span class="absolute -top-3 left-3 flex justify-center items-center w-6 h-6 p-1 rounded-full text-white bg-red-500">0</span>
                    </a>
                </li>
            </ul>
        </div>
    </div>

    <main>
        @yield('content')
    </main>
</body>

</html>