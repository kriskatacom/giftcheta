@if ($paginator->hasPages())
    <nav role="navigation" aria-label="{{ __('Pagination Navigation') }}" class="flex items-center justify-between">
        <div class="flex justify-between flex-1 sm:hidden">
            @if ($paginator->onFirstPage())
                <span class="px-3 py-2 text-gray-400">Първа</span>
            @else
                <a href="{{ $paginator->url(1) }}" class="px-3 py-2 text-blue-600 hover:underline">Първа</a>
            @endif

            @if ($paginator->onFirstPage())
                <span
                    class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 cursor-default leading-5 rounded-md">
                    {!! __('pagination.previous') !!}
                </span>
            @else
                <a href="{{ $paginator->previousPageUrl() }}"
                    class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 leading-5 rounded-md hover:text-gray-500 focus:outline-none focus:ring ring-gray-300 focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150">
                    {!! __('pagination.previous') !!}
                </a>
            @endif

            @if ($paginator->hasMorePages())
                <a href="{{ $paginator->nextPageUrl() }}"
                    class="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 leading-5 rounded-md hover:text-gray-500 focus:outline-none focus:ring ring-gray-300 focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150">
                    {!! __('pagination.next') !!}
                </a>
            @else
                <span
                    class="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 cursor-default leading-5 rounded-md">
                    {!! __('pagination.next') !!}
                </span>
            @endif

            @if ($paginator->hasMorePages())
                <a href="{{ $paginator->url($paginator->lastPage()) }}"
                    class="px-3 py-2 text-blue-600 hover:underline">Последна</a>
            @else
                <span class="px-3 py-2 text-gray-400">Последна</span>
            @endif
        </div>

        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
                <p class="text-gray-700 leading-5">
                    {!! __('Показване') !!}
                    @if ($paginator->firstItem())
                        <span class="font-medium">{{ $paginator->firstItem() }}</span>
                        {!! __('на') !!}
                        <span class="font-medium">{{ $paginator->lastItem() }}</span>
                    @else
                        {{ $paginator->count() }}
                    @endif
                    {!! __('от') !!}
                    <span class="font-medium">{{ $paginator->total() }}</span>
                    {!! __('резултата') !!}
                </p>
            </div>

            <div>
                <span class="relative z-0 inline-flex shadow-sm rounded-md">
                    {{-- Previous Page Link --}}
                    @if (!$paginator->onFirstPage())
                        <a href="{{ $paginator->previousPageUrl() }}" rel="prev"
                            class="px-5 py-2 flex items-center bg-white border rounded hover:text-white hover:bg-primary"
                            aria-label="{{ __('pagination.previous') }}">
                            <x-heroicon-o-arrow-left class="w-5 h-5" />
                        </a>
                    @endif

                    {{-- Pagination Elements --}}
                    @foreach ($elements as $element)
                        {{-- "Three Dots" Separator --}}
                        @if (is_string($element))
                            <span aria-disabled="true">
                                <span
                                    class="px-5 py-2 flex items-center bg-white border rounded hover:text-white hover:bg-primary">{{ $element }}</span>
                            </span>
                        @endif

                        {{-- Array Of Links --}}
                        @if (is_array($element))
                            @foreach ($element as $page => $url)
                                @if ($page == 1 || $page == $paginator->lastPage() || ($page >= $paginator->currentPage() - 3 && $page <= $paginator->currentPage() + 3))
                                    {{-- Текуща страница --}}
                                    @if ($page == $paginator->currentPage())
                                        <span aria-current="page">
                                            <span
                                                class="px-5 py-2 flex items-center border border-primary rounded text-white bg-primary">{{ $page }}</span>
                                        </span>
                                    @else
                                        <a href="{{ $url }}"
                                            class="px-5 py-2 flex items-center bg-white border hover:border-primary rounded hover:text-white hover:bg-primary">
                                            {{ $page }}
                                        </a>
                                    @endif
                                @elseif ($page == 2 || $page == $paginator->lastPage() - 1)
                                    {{-- показваме "..." ако има празнина --}}
                                    <span class="px-5 py-2 flex items-center bg-white border rounded">...</span>
                                @endif
                            @endforeach
                        @endif
                    @endforeach

                    {{-- Next Page Link --}}
                    @if ($paginator->hasMorePages())
                        <a href="{{ $paginator->nextPageUrl() }}" rel="next"
                            class="px-5 py-2 flex items-center bg-white border hover:border-primary rounded hover:text-white hover:bg-primary"
                            aria-label="{{ __('pagination.next') }}">
                            <x-heroicon-o-arrow-right class="w-5 h-5" />
                        </a>
                    @endif
                </span>
            </div>
        </div>
    </nav>
@endif
