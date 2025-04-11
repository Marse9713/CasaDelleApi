// Gallery functionality
document.addEventListener('DOMContentLoaded', function() {
    const galleryContainer = document.getElementById('gallery-container');
    // Load photos from JSON file
    loadGalleryImages(galleryContainer);
});

// Function to load gallery images from JSON file
function loadGalleryImages(container) {
    // Fetch the JSON data
    fetch('../json/pictures.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Create and append gallery items
            data.images.forEach(photo => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                
                const img = document.createElement('img');
                img.src = photo.src;
                img.alt = photo.title;
                img.loading = 'lazy'; // Enable lazy loading for better performance
                
                // Add error handling for images that fail to load
                img.onerror = function() {
                    console.error(`Failed to load image: ${photo.src}`);
                    this.style.display = 'none';
                    galleryItem.innerHTML = `<div class="image-error">Image not available</div>`;
                };
                
                // Add click event for lightbox functionality
                img.addEventListener('click', () => {
                    openLightbox(photo.src, photo.title, photo.description);
                });
                
                galleryItem.appendChild(img);
                container.appendChild(galleryItem);
            });
        })
        .catch(error => {
            console.error('Error loading gallery images:', error);
            container.innerHTML = '<div class="error-message">Failed to load gallery images. Please try again later.</div>';
        });
}

// Lightbox functionality
function openLightbox(src, title, description) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    
    const content = document.createElement('div');
    content.className = 'lightbox-content';
    
    const img = document.createElement('img');
    img.src = src;
    img.alt = title;
    
    const info = document.createElement('div');
    info.className = 'lightbox-info';
    info.innerHTML = `
        <h3>${title}</h3>
        <p>${description}</p>
    `;
    
    const closeBtn = document.createElement('span');
    closeBtn.className = 'lightbox-close';
    closeBtn.innerHTML = '&times;';
    
    content.appendChild(img);
    content.appendChild(info);
    lightbox.appendChild(content);
    lightbox.appendChild(closeBtn);
    document.body.appendChild(lightbox);
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === closeBtn) {
            lightbox.remove();
        }
    });
    
    // Close lightbox with escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            lightbox.remove();
        }
    });
}

// Add necessary styles
const style = document.createElement('style');
style.textContent = `
    .gallery-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
        padding: 20px;
    }

    .gallery-item {
        position: relative;
        overflow: hidden;
        border-radius: 8px;
        cursor: pointer;
        transition: transform 0.3s ease;
    }

    .gallery-item:hover {
        transform: scale(1.05);
    }

    .gallery-item img {
        width: 100%;
        height: 250px;
        object-fit: cover;
        display: block;
    }

    .image-error {
        width: 100%;
        height: 250px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f5f5f5;
        color: #999;
        font-style: italic;
    }

    .lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .lightbox-content {
        max-width: 90%;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .lightbox img {
        max-width: 100%;
        max-height: 70vh;
        object-fit: contain;
    }

    .lightbox-info {
        color: white;
        text-align: center;
        margin-top: 20px;
        font-family: "Courgette";
    }

    .lightbox-info h3 {
        margin: 0 0 10px 0;
        font-size: 1.5em;
    }

    .lightbox-info p {
        margin: 0;
        font-size: 1.1em;
    }

    .lightbox-close {
        position: absolute;
        top: 20px;
        right: 20px;
        color: white;
        font-size: 30px;
        cursor: pointer;
        padding: 10px;
    }
`;
document.head.appendChild(style); 