@extends("layouts.app")

@section("content")
    <h1 class="text-3xl text-center my-10">{{ $title }}</h1>
    <form action="{{ route('password.request') }}" method="POST" class="space-y-4 text-lg">
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

            <div>
                <a href="{{ route('users.login') }}" class="page-link">Влизане в профила</a>
            </div>

            <div class="space-x-1">
                <button type="submit" class="page-button bg-primary" data-disable-on-click>{{ $title }}</button>
            </div>
        </div>
    </form>
@endsection
