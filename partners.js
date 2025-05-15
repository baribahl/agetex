/**
 * Handles partner section interactivity and media integration
 */

// YouTube API integration
let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let sublitexPlayer1;
let sublitexPlayer2;

// Called by YouTube API when ready
window.onYouTubeIframeAPIReady = function() {
    // Initialize first Sublitex video (autoplay when section opens)
    sublitexPlayer1 = new YT.Player('sublitex-video-1', {
        videoId: 'W26ingpB9i4',
        playerVars: {
            'start': 59,
            'autoplay': 0,
            'controls': 0,
            'showinfo': 0,
            'rel': 0,
            'mute': 1
        }
    });

    // Initialize second Sublitex video (manual play with thumbnail)
    sublitexPlayer2 = new YT.Player('sublitex-video-2', {
        videoId: 'fdHe7RQtpvo',
        playerVars: {
            'controls': 1,
            'showinfo': 0,
            'rel': 0
        }
    });
};

document.addEventListener('DOMContentLoaded', function() {
    // const partnerCards = document.querySelectorAll('.partner-accordion');
    const partnerCards = document.querySelectorAll('.partner-accordion');
    let activeCard = null;

    function closeAllCards() {
        partnerCards.forEach(card => {
            const content = card.querySelector('.partner-content');
            const header = card.querySelector('.partner-header');
            const toggleBtn = card.querySelector('.toggle-btn i');
            
            if (content) {
                content.style.display = 'none';
                card.classList.remove('active');
            }
            
            if (header) {
                header.classList.remove('active');
            }
            
            if (toggleBtn) {
                toggleBtn.classList.remove('rotate-180');
            }
            
            // Pause videos if they exist
            if (typeof sublitexPlayer1 !== 'undefined' && card.contains(document.getElementById('sublitex-section'))) {
                sublitexPlayer1.pauseVideo();
            }
        });
    }

    // Initialize all partners as hidden
    partnerCards.forEach(card => {
        const content = card.querySelector('.partner-content');
        if (content) {
            content.style.display = 'none';
        }
    });

    // Add click handlers to partner headers
    partnerCards.forEach((card, index) => {
        const header = card.querySelector('.partner-header');
        const content = card.querySelector('.partner-content');
        const toggleBtn = card.querySelector('.toggle-btn i');

        if (header && content) {
            header.addEventListener('click', function(e) {
                e.preventDefault();
                const isActive = card.classList.contains('active');

                // Immediate visual feedback
                if (toggleBtn) {
                    toggleBtn.classList.toggle('rotate-180', !isActive);
                }

                // Pre-load content visibility
                if (!isActive) {
                    // Make content immediately visible but transparent
                    content.style.opacity = '0';
                    content.style.display = 'block';
                    
                    // Optimize rendering by forcing a reflow before animation
                    void content.offsetWidth;
                    
                    // Instant UI update
                    card.classList.add('active');
                    header.classList.add('active');
                    content.style.transition = 'opacity 0.2s ease-out';
                    content.style.opacity = '1';
                    
                    // Close other cards after our card is visible
                    requestAnimationFrame(() => {
                        partnerCards.forEach(otherCard => {
                            if (otherCard !== card) {
                                const otherContent = otherCard.querySelector('.partner-content');
                                const otherHeader = otherCard.querySelector('.partner-header');
                                const otherToggleBtn = otherCard.querySelector('.toggle-btn i');
                                
                                if (otherContent) {
                                    otherContent.style.display = 'none';
                                    otherCard.classList.remove('active');
                                }
                                
                                if (otherHeader) {
                                    otherHeader.classList.remove('active');
                                }
                                
                                if (otherToggleBtn) {
                                    otherToggleBtn.classList.remove('rotate-180');
                                }
                                
                                // Pause videos in other sections
                                if (typeof sublitexPlayer1 !== 'undefined' && otherCard.contains(document.getElementById('sublitex-section'))) {
                                    sublitexPlayer1.pauseVideo();
                                }
                            }
                        });
                    });
                    
                    // Handle video autoplay for Sublitex section
                    if (typeof sublitexPlayer1 !== 'undefined' && card.contains(document.getElementById('sublitex-section'))) {
                        requestAnimationFrame(() => {
                            sublitexPlayer1.playVideo();
                        });
                    }

                    // Adjust scroll position after content is rendered
                    const headerHeight = 100; // Approximate navbar height
                    const yPosition = content.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    window.scrollTo({top: yPosition, behavior: 'smooth'});
                    
                    activeCard = card;
                } else {
                    // Just hide content if clicking active card
                    content.style.display = 'none';
                    card.classList.remove('active');
                    header.classList.remove('active');
                    activeCard = null;
                }
            });
        }
    });
});

// Error handling for media
function handleImageError(img, type) {
    const fallbacks = {
        'profile': './images/profile-image-BW-low-res.jpg',
        'partner-logo': './images/agetex-logo-nav-updated.svg',
        'machinery': './images/photo-monti-machine-no-bg.png', // Updated to use existing image
        'default': './images/agetex-logo-nav-updated.svg'
    };

    img.src = fallbacks[type] || fallbacks.default;
    img.classList.add('error-fallback');
}

// Lazy loading for partner images
function lazyLoadPartnerImages() {
    const images = document.querySelectorAll('[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadPartnerImages);

