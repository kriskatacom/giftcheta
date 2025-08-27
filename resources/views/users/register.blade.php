@extends("layouts.app")

@section("content")
    <h1 class="text-3xl text-center my-10">{{ $title }}</h1>
    <form action="{{ route('users.create') }}" method="POST" class="space-y-4 text-lg">
        @csrf

        <div class="max-w-xl mx-auto bg-white border border-gray-200 rounded-lg py-7 px-8 space-y-5">
            <x-alert-messages />
            
            <div class="border border-gray-200 bg-blue-100 rounded-lg py-3 px-5">
                <p>
                    <span class="font-bold">Важно!</span>
                    Ако създадете профила си в този онлайн магазин, Вие се съгласявате на нашите <a href="#"
                        class="page-link">Общи условия</a> и <a href="#" class="page-link">Политика на поверителност</a>
                </p>
            </div>

            <div class="space-y-1">
                <label for="fullname">Име и фамилия</label>
                <input type="text" name="fullname" value="{{ old('fullname') }}" placeholder="Въведете името и фамилията си"
                    class="form-control">
                @error('fullname')
                    <div class="text-red-500">{{ $message }}</div>
                @enderror
            </div>

            <div class="space-y-1">
                <label for="email">Имейл адрес</label>
                <input type="email" name="email" value="{{ old('email') }}" placeholder="Въведете валиден имейл адрес" class="form-control">
                @error('email')
                    <div class="text-red-500">{{ $message }}</div>
                @enderror
            </div>

            <div class="space-y-1">
                <label for="password">Парола</label>
                <input type="password" name="password" placeholder="Въведете сигурна парола" class="form-control">
                @error('password')
                    <div class="text-red-500">{{ $message }}</div>
                @enderror
            </div>

            <div class="space-y-1">
                <label for="Потвърдете паролата">Парола</label>
                <input type="password" name="password_confirmation" placeholder="Потвърдете паролата" class="form-control">
            </div>

            <div>
                <a href="{{ route('users.login') }}" class="page-link">Влизане в профил</a>
            </div>

            <div class="space-x-1">
                <button type="submit" class="page-button bg-primary" data-disable-on-click>{{ $title }}</button>
            </div>
        </div>
    </form>
@endsection
