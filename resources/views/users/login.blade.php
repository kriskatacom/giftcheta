@extends("layouts.app")

@section("content")
    <h1 class="text-3xl text-center my-10">{{ $title }}</h1>
    <form action="{{ route('users.authenticate') }}" method="POST" class="space-y-4 text-lg">
        @csrf

        <div class="max-w-xl mx-auto bg-white border border-gray-200 rounded-lg py-7 px-8 space-y-5">
            <x-alert-messages />
            
            <div class="space-y-1">
                <label for="email">Имейл адрес</label>
                <input type="email" name="email" value="{{ old('email') }}" placeholder="Въведете имейл адресът си" class="form-control">
                @error('email')
                    <div class="text-red-500">{{ $message }}</div>
                @enderror
            </div>

            <div class="space-y-1">
                <label for="password">Парола</label>
                <input type="password" name="password" placeholder="Въведете паролата си" class="form-control">
                @error('password')
                    <div class="text-red-500">{{ $message }}</div>
                @enderror
            </div>

            <div>
                <div>
                    <a href="{{ route('users.register') }}" class="page-link">Създаване на профил</a>
                </div>
                <div>
                    <a href="{{ route('password.request') }}" class="page-link">Забравена парола</a>
                </div>
            </div>

            <div class="space-x-1">
                <button type="submit" class="page-button bg-primary" data-disable-on-click>{{ $title }}</button>
            </div>
        </div>
    </form>
@endsection
