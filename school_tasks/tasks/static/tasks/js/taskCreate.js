document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.querySelector('input[type="file"]');
    const fileLabel = document.querySelector('.file-upload-label');
    const wrapper = document.querySelector('.file-upload-wrapper');

    // Update label when files are selected
    fileInput.addEventListener('change', function(e) {
        if (this.files.length > 0) {
            const fileCount = this.files.length;
            const fileName = fileCount === 1 ? this.files[0].name : `${fileCount} files selected`;
            
            fileLabel.innerHTML = `
                <i class="fas fa-check"></i>
                <span>${fileName}</span>
            `;
            fileLabel.style.display = 'block';
        } else {
            fileLabel.innerHTML = `
                <i class="fas fa-cloud-upload-alt"></i>
                <span>Choose files or drag and drop</span>
            `;
        }
    });

    // Add drag and drop functionality
    ['dragenter', 'dragover'].forEach(eventName => {
        wrapper.addEventListener(eventName, e => {
            e.preventDefault();
            wrapper.classList.add('dragging');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        wrapper.addEventListener(eventName, e => {
            e.preventDefault();
            wrapper.classList.remove('dragging');
        });
    });
});
