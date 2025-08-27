@if(session('success'))
    <div class="mb-4 rounded-lg bg-green-100 border border-green-400 text-green-700 px-4 py-3">
        {{ session('success') }}
    </div>
@endif

@if(session('error'))
    <div class="mb-4 rounded-lg bg-red-100 border border-red-400 text-red-700 px-4 py-3">
        {{ session('error') }}
    </div>
@endif
