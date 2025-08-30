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

window.previewImage = function(event) {
    const input = event.target;
    const previewContainer = document.getElementById('image-preview-container');
    const preview = document.getElementById('image-preview');

    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            previewContainer.style.display = 'block';
        }
        reader.readAsDataURL(input.files[0]);
    } else {
        preview.src = '';
        previewContainer.style.display = 'none';
    }
}
