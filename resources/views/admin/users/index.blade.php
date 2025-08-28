@extends("layouts.app")

@section("content")
    <div class="flex">
        <x-admin-sidebar />

        <div class="w-full">
            <div class="mt-4 pb-4 px-5 border-b border-gray-300 flex justify-between items-center gap-5">
                <h1 class="text-2xl">Потребители</h1>
                <form action="{{ route('admin.users.destroy-all') }}" method="POST"
                    onsubmit="return confirm('Сигурни ли сте, че искате да изтриете тази категория?');">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="danger-button">Изриване на всички</button>
                </form>
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
                            <th class="font-medium border border-gray-300 px-4 py-2">ID</th>
                            <th class="font-medium border border-gray-300 px-4 py-2">Име</th>
                            <th class="font-medium border border-gray-300 px-4 py-2">Имейл</th>
                            <th class="font-medium border border-gray-300 px-4 py-2">Създаден на</th>
                            <th class="font-medium text-right border border-gray-300 px-4 py-2">Опции</th>
                        </tr>
                    </thead>
                    <tbody>
                        @if ($users->count() > 0)
                            @foreach($users as $user)
                                <tr class="bg-white hover:bg-gray-50">
                                    <td class="border border-gray-300 px-4 py-2">{{ $user->id }}</td>
                                    <td class="border border-gray-300 px-4 py-2">{{ $user->name }}</td>
                                    <td class="border border-gray-300 px-4 py-2">{{ $user->email }}</td>
                                    <td class="border border-gray-300 px-4 py-2">{{ $user->created_at->translatedFormat('d F Y, H:i') }}</td>
                                    <td class="border border-gray-300 px-4 py-2 text-right">
                                        @if (Auth::id() === $user->id)
                                            <x-action-dropdown :model="$user" route-prefix="admin.users" :actions="['show', 'edit']" />
                                        @else
                                            <x-action-dropdown :model="$user" route-prefix="admin.users" :actions="['show', 'edit', 'delete']" />
                                        @endif
                                    </td>
                                </tr>
                            @endforeach
                        @else
                            <tr class="bg-white hover:bg-gray-50">
                                <td colspan="4" class="text-center text-gray-600 px-4 py-2">Няма намерени потребители.</td>
                            </tr>
                        @endif
                    </tbody>
                </table>
                <div class="mt-5">
                    {{ $users->links() }}
                </div>
            </div>
        </div>
    </div>
@endsection
