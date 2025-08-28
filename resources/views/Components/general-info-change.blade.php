<h3 class="text-2xl mb-4">Основна информация</h3>
<form action="{{ route('users.general-info.change') }}" method="POST" class="space-y-4">
    @csrf

    <div>
        <label class="block mb-1">Име и фамилия</label>
        <input type="text" name="fullname" value="{{ auth()->user()->fullname }}" class="form-control">
        @error('fullname')
            <div class="text-red-500 mt-1">{{ $message }}</div>
        @enderror
    </div>

    <div class="mb-4">
        <label for="gender" class="block mb-2">Пол</label>
        <select id="gender" name="gender" class="form-control">
            <option value="">-- Избери --</option>
            <option value="male" {{ auth()->user()->gender == 'male' ? 'selected' : '' }}>Мъж</option>
            <option value="female" {{ auth()->user()->gender == 'female' ? 'selected' : '' }}>Жена</option>
            <option value="other" {{ auth()->user()->gender == 'other' ? 'selected' : '' }}>Друго</option>
        </select>
    </div>

    <div>
        <label class="block mb-1">Телефонен номер</label>
        <input type="text" name="phone" value="{{ auth()->user()->phone }}" class="form-control">
        @error('phone')
            <div class="text-red-500 mt-1">{{ $message }}</div>
        @enderror
    </div>

    <div>
        <label class="block mb-1">Дата на раждане</label>
        <input type="date" name="birthday" value="{{ auth()->user()->birthday }}" class="form-control">
        @error('birthday')
            <div class="text-red-500 mt-1">{{ $message }}</div>
        @enderror
    </div>

    <button type="submit" class="page-button bg-primary" data-disable-on-click>Запазване на информацията</button>
</form>