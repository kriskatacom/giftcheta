@extends("layouts.app")

@section("content")
    <div class="container mx-auto py-10">
        <h1 class="text-3xl font-semibold text-center mb-10">Моят профил</h1>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <x-profile-sidebar />
            <main class="bg-white border rounded-lg shadow p-6 md:col-span-3">
                <h2 class="text-2xl font-semibold mb-6">{{ $title }}</h2>
            </main>
        </div>
    </div>
@endsection