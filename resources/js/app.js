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
