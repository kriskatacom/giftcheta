@extends("layouts.app")

@php
    $gender = $user->gender;
    $profileImage = match($gender) {
        'female' => '/images/female-profile-demo.png',
        'male' => '/images/male-profile-demo.png',
        'other' => '/images/male-profile-demo.png',
        null, '' => '/images/male-profile-demo.png',
        default => '/images/male-profile-demo.png',
    };
@endphp

@section("content")
    <div class="flex">
        <x-admin-sidebar />

        <div class="space-y-5 w-full text-lg">
            <div class="w-full px-5">
                <div class="mt-4 pb-4 border-b border-gray-300 flex justify-between items-center gap-5">
                    <h1 class="text-2xl">Преглед на потребител</h1>

                    <form action="{{ route('admin.users.destroy', $user->id) }}" method="POST"
                        onsubmit="return confirm('Сигурни ли сте, че искате да изтриете този потребител?');">
                        @csrf

                        @method('DELETE')
                        <button @disabled(Auth::user()->email === $user->email) type="submit" class="page-button bg-primary">
                            Изриване на потребителя
                        </button>
                    </form>
                </div>
                <main class="bg-white border rounded-lg shadow p-6 md:col-span-3">
                    <h2 class="text-2xl font-semibold mb-6">Здравей, {{ $user->fullname ?? 'Потребител' }}!</h2>

                    <div class="space-y-6 text-lg">
                        <x-alert-messages />
                        <div class="flex items-center gap-5">
                            <div
                                class="min-w-[120px] w-[120px] min-h-[120px] h-[120px] overflow-hidden border-4 border-200 rounded-full">
                                <img src="{{ $profileImage }}" alt="{{ $user->fullname }}"
                                    title="{{ $user->fullname }}">
                            </div>
                            <div>
                                <h3 class="text-xl font-medium mb-2">Данни за акаунта</h3>
                                <p><strong>Име:</strong> {{ $user->fullname }}</p>
                                <p><strong>Имейл:</strong> {{ $user->email }}</p>
                                <p><strong>Пол:</strong> {{ gender_label($user->gender) }}</p>
                            </div>
                        </div>

                        <div class="space-y-5">
                            <x-general-info-change :user="$user" route="admin.users.general-info.change" />
                            <x-profile-password-change />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    </div>
@endsection
