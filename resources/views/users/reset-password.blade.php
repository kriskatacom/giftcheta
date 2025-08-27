@extends("layouts.app")

@section("content")
    <h1 class="text-3xl text-center my-10">{{ $title }}</h1>

    <form action="{{ route('password.update') }}" method="POST" class="space-y-4 text-lg">
        @csrf

        <input type="hidden" name="token" value="{{ $token }}">

        <div class="max-w-xl mx-auto bg-white border border-gray-200 rounded-lg py-7 px-8 space-y-5">
            <x-alert-messages />
            
            <div class="space-y-1">
                <label for="email">Имейл адрес</label>
                <input type="email" name="email" value="{{ $email ?? old('email') }}" placeholder="Въведете имейл адреса си" class="form-control" required>
                @error('email')
                    <div class="text-red-500">{{ $message }}</div>
                @enderror
            </div>

            <div class="space-y-1">
                <label for="password">Нова парола</label>
                <input type="password" name="password" placeholder="Въведете новата парола" class="form-control" required>
                @error('password')
                    <div class="text-red-500">{{ $message }}</div>
                @enderror
            </div>

            <div class="space-y-1">
                <label for="password_confirmation">Повторете паролата</label>
                <input type="password" name="password_confirmation" placeholder="Повторете новата парола" class="form-control" required>
            </div>

            <div class="space-x-1">
                <button type="submit" class="page-button bg-primary" data-disable-on-click>{{ $title }}</button>
            </div>
        </div>
    </form>
@endsection