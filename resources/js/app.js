import './bootstrap';

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            const btn = form.querySelector('[data-disable-on-click]');
            if (btn) {
                btn.disabled = true;
                btn.innerText = 'Моля, изчакайте...';
            }
        });
    });
});

// dashboard-user-dropdows
document.addEventListener('click', function (event) {
    const dropdowns = document.querySelectorAll('.relative.inline-block');
    dropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('button');
        const menu = dropdown.querySelector('div[role="menu"]');
        if (!dropdown.contains(event.target)) {
            menu.classList.add('hidden');
        }
    });
});
