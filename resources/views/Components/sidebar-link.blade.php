@props([
    'route',
    'icon',
])

@php
    $isActive = request()->routeIs($route . '*');
@endphp

<li>
    <a href="{{ route($route) }}"
    {{ $attributes->merge(['class' => "profile-link-with-icon " . ($isActive ? 'bg-primary' : '') ]) }}>
        <x-dynamic-component 
            :component="$icon" 
            class="icon {{ $isActive ? 'text-white' : '' }}" />
        <span class="with-icon {{ $isActive ? 'text-white' : '' }}">
            {{ $slot }}
        </span>
    </a>
</li>