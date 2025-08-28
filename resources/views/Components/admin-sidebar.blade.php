<aside class="min-w-[350px] w-[350px] min-h-screen bg-white border-r border-gray-200">
    <div class="text-2xl text-center py-5 border-b border-gray-200">Администрация</div>
    <ul>
        <x-sidebar-link route="admin.dashboard" icon="heroicon-o-home">Табло</x-sidebar-link>
        <x-sidebar-link route="admin.users" icon="heroicon-o-users">Потребители</x-sidebar-link>
        <x-sidebar-link route="admin.orders" icon="heroicon-o-archive-box">Поръчки</x-sidebar-link>
        <x-sidebar-link route="admin.products" icon="heroicon-o-inbox-stack">Продукти</x-sidebar-link>
        <x-sidebar-link route="admin.categories" icon="heroicon-o-adjustments-vertical">Категории</x-sidebar-link>
        <x-sidebar-link route="admin.stats" icon="heroicon-o-chart-bar">Статистика</x-sidebar-link>
        <x-sidebar-link route="admin.settings" icon="heroicon-o-cog-6-tooth">Настройки</x-sidebar-link>
    </ul>
</aside>