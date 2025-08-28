<h3 class="text-2xl mb-4">Смяна на парола</h3>
<form action="{{ route('users.password.change') }}" method="POST" class="space-y-4">
    @csrf

    <div>
        <label class="block mb-1">Текуща парола</label>
        <input type="password" name="current_password" class="form-control">
        @error('current_password')
            <div class="text-red-500 mt-1">{{ $message }}</div>
        @enderror
    </div>

    <div>
        <label class="block mb-1">Нова парола</label>
        <input type="password" name="password" class="form-control">
        @error('password')
            <div class="text-red-500 mt-1">{{ $message }}</div>
        @enderror
    </div>

    <div>
        <label class="block mb-1">Потвърди паролата</label>
        <input type="password" name="password_confirmation" class="form-control">
    </div>

    <button type="submit" class="page-button bg-primary" data-disable-on-click>Запазване на паролата</button>
</form>