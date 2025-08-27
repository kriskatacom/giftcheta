@component('mail::message')
# Смяна на парола

Натиснете бутона по-долу, за да смените паролата си:

<a href="{{ url('/reset-password/'.$token.'?email='.$email) }}" class="button">Смяна на парола</a>

Ако не сте поискали това, просто игнорирайте този имейл.

@endcomponent