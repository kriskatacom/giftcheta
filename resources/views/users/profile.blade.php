@extends("layouts.app")

@php
    $gender = auth()->user()->gender;
    $profileImage = match($gender) {
        'female' => '/images/female-profile-demo.png',
        'male' => '/images/male-profile-demo.png',
        'other' => '/images/male-profile-demo.png',
        null, '' => '/images/male-profile-demo.png',
        default => '/images/male-profile-demo.png',
    };
@endphp

@section("content")
    <div class="container mx-auto py-10">
        <h1 class="text-3xl font-semibold text-center mb-10">{{ $title }}</h1>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <x-profile-sidebar />
            <main class="bg-white border rounded-lg shadow p-6 md:col-span-3">
                <h2 class="text-2xl font-semibold mb-6">Здравей, {{ auth()->user()->fullname ?? 'Потребител' }}!</h2>
                
                <div class="space-y-6 text-lg">
                    <x-alert-messages />
                    <div class="flex items-center gap-5">
                        <div
                            class="min-w-[120px] w-[120px] min-h-[120px] h-[120px] overflow-hidden border-4 border-200 rounded-full">
                            <img src="{{ $profileImage }}" alt="{{ auth()->user()->fullname }}" title="{{ auth()->user()->fullname }}">
                        </div>
                        <div>
                            <h3 class="text-xl font-medium mb-2">Данни за акаунта</h3>
                            <p><strong>Име:</strong> {{ auth()->user()->fullname }}</p>
                            <p><strong>Имейл:</strong> {{ auth()->user()->email }}</p>
                            <p><strong>Пол:</strong> {{ gender_label(auth()->user()->gender) }}</p>
                        </div>
                    </div>

                    <div class="space-y-5">
                        <x-general-info-change />
                        <x-profile-password-change />
                    </div>
                </div>
            </main>
        </div>
    </div>
@endsection
