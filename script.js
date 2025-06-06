// TechInsight Blog JavaScript

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animation library
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
    
    // Back to top button
    const backToTopButton = document.querySelector('.back-to-top');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    
    if (backToTopButton) {
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Like button functionality
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const likeCount = this.closest('.card-footer').querySelector('.like-count');
            
            if (icon.classList.contains('far')) {
                // Like the post
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.classList.add('text-danger');
                this.classList.add('liked');
                
                // Increment like count
                if (likeCount) {
                    const count = parseInt(likeCount.textContent) + 1;
                    likeCount.textContent = count;
                }
                
                // Show toast notification
                showToast('Post liked!', 'You liked this article.');
            } else {
                // Unlike the post
                icon.classList.remove('fas');
                icon.classList.remove('text-danger');
                icon.classList.add('far');
                this.classList.remove('liked');
                
                // Decrement like count
                if (likeCount) {
                    const count = parseInt(likeCount.textContent) - 1;
                    likeCount.textContent = count;
                }
            }
        });
    });
    
    // Bookmark button functionality
    const bookmarkButtons = document.querySelectorAll('.bookmark-btn');
    bookmarkButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            
            if (icon.classList.contains('far')) {
                // Bookmark the post
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.classList.add('text-primary');
                this.classList.add('bookmarked');
                
                // Show toast notification
                showToast('Bookmarked!', 'Article saved to your bookmarks.');
            } else {
                // Remove bookmark
                icon.classList.remove('fas');
                icon.classList.remove('text-primary');
                icon.classList.add('far');
                this.classList.remove('bookmarked');
                
                // Show toast notification
                showToast('Removed!', 'Article removed from your bookmarks.');
            }
        });
    });
    
    // Category filter functionality
    const categoryButtons = document.querySelectorAll('.category-pills .btn');
    const blogCards = document.querySelectorAll('.blog-card');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const category = this.textContent.trim();
            
            // Filter blog cards based on category
            blogCards.forEach(card => {
                const cardCategory = card.querySelector('.category-tag')?.textContent.trim();
                
                if (category === 'All Posts' || category === cardCategory) {
                    card.closest('.col-lg-4').style.display = 'block';
                    
                    // Add animation
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transition = 'opacity 0.5s ease';
                    }, 50);
                } else {
                    card.closest('.col-lg-4').style.display = 'none';
                }
            });
        });
    });
    
    // Newsletter form validation
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (validateEmail(email)) {
                // Success - would normally submit to server
                emailInput.value = '';
                showToast('Success!', 'Thank you for subscribing to our newsletter!');
                
                // Close modal if in modal
                const modal = this.closest('.modal');
                if (modal) {
                    const modalInstance = bootstrap.Modal.getInstance(modal);
                    if (modalInstance) {
                        modalInstance.hide();
                    }
                }
            } else {
                // Error
                emailInput.classList.add('is-invalid');
                
                // Add error message if not exists
                if (!this.querySelector('.invalid-feedback')) {
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'invalid-feedback';
                    errorMessage.textContent = 'Please enter a valid email address.';
                    emailInput.parentNode.appendChild(errorMessage);
                }
            }
        });
    });
    
    // Search functionality
    const searchForm = document.querySelector('#searchOffcanvas form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const searchInput = this.querySelector('input[type="text"]');
            const searchTerm = searchInput.value.trim();
            
            if (searchTerm.length > 0) {
                // Simulate search results
                showToast('Search Results', `Searching for: "${searchTerm}"`);
                searchInput.value = '';
                
                // Close offcanvas
                const offcanvas = document.getElementById('searchOffcanvas');
                const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
                if (bsOffcanvas) {
                    bsOffcanvas.hide();
                }
            }
        });
    }
    
    // Comment form functionality
    const commentForm = document.querySelector('#commentForm');
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = this.querySelector('#commentName');
            const emailInput = this.querySelector('#commentEmail');
            const messageInput = this.querySelector('#commentMessage');
            
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();
            
            if (name && validateEmail(email) && message) {
                // Add new comment to the list
                addNewComment(name, message);
                
                // Clear form
                nameInput.value = '';
                emailInput.value = '';
                messageInput.value = '';
                
                // Show success message
                showToast('Comment Posted!', 'Your comment has been added successfully.');
            } else {
                // Show validation errors
                if (!name) nameInput.classList.add('is-invalid');
                if (!validateEmail(email)) emailInput.classList.add('is-invalid');
                if (!message) messageInput.classList.add('is-invalid');
            }
        });
    }
    
    // Dark mode toggle
    const darkModeToggle = document.querySelector('#darkModeToggle');
    if (darkModeToggle) {
        // Check for saved theme preference or respect OS preference
        if (localStorage.getItem('darkMode') === 'enabled' || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches && 
             !localStorage.getItem('darkMode'))) {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        }
        
        darkModeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('darkMode', 'enabled');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('darkMode', 'disabled');
            }
        });
    }
    
    // Load more articles functionality
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            this.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Loading...';
            this.disabled = true;
            
            // Simulate loading delay
            setTimeout(() => {
                // Add new articles (in a real app, this would fetch from server)
                loadMoreArticles();
                
                // Reset button
                this.innerHTML = '<i class="fas fa-sync-alt me-2"></i>Load More Articles';
                this.disabled = false;
            }, 1500);
        });
    }
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
    
    // Reading time progress bar
    const progressBar = document.querySelector('.reading-progress');
    if (progressBar) {
        window.addEventListener('scroll', function() {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }
});

// Helper Functions

// Email validation
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// Show toast notification
function showToast(title, message) {
    const toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) {
        // Create toast container if it doesn't exist
        const container = document.createElement('div');
        container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(container);
    }
    
    // Create toast element
    const toastEl = document.createElement('div');
    toastEl.className = 'toast';
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');
    
    // Toast content
    toastEl.innerHTML = `
        <div class="toast-header">
            <strong class="me-auto">${title}</strong>
            <small>Just now</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;
    
    // Add toast to container
    document.querySelector('.toast-container').appendChild(toastEl);
    
    // Initialize and show toast
    const toast = new bootstrap.Toast(toastEl, {
        autohide: true,
        delay: 3000
    });
    toast.show();
    
    // Remove toast after it's hidden
    toastEl.addEventListener('hidden.bs.toast', function() {
        this.remove();
    });
}

// Add new comment to the list
function addNewComment(name, message) {
    const commentsList = document.querySelector('.comments-list');
    if (!commentsList) return;
    
    const commentElement = document.createElement('div');
    commentElement.className = 'comment mb-4';
    
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    commentElement.innerHTML = `
        <div class="d-flex">
            <div class="comment-avatar">
                <div class="avatar-placeholder">${name.charAt(0)}</div>
            </div>
            <div class="ms-3 flex-grow-1">
                <div class="d-flex align-items-center mb-2">
                    <h6 class="mb-0">${name}</h6>
                    <small class="text-muted ms-2">${formattedDate}</small>
                </div>
                <p class="mb-0">${message}</p>
                <div class="comment-actions mt-2">
                    <button class="btn btn-sm text-primary p-0 me-3">
                        <i class="far fa-thumbs-up me-1"></i> Like
                    </button>
                    <button class="btn btn-sm text-primary p-0">
                        <i class="far fa-reply me-1"></i> Reply
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add new comment at the top
    commentsList.prepend(commentElement);
    
    // Update comment count
    const commentCount = document.querySelector('.comment-count');
    if (commentCount) {
        const currentCount = parseInt(commentCount.textContent);
        commentCount.textContent = currentCount + 1;
    }
}

// Load more articles
function loadMoreArticles() {
    const articlesContainer = document.querySelector('.blog-posts-container');
    if (!articlesContainer) return;
    
    // Sample new articles HTML (in a real app, this would come from an API)
    const newArticlesHTML = `
        <!-- New Blog Post 1 -->
        <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-duration="800">
            <div class="card blog-card h-100">
                <div class="card-img-wrapper">
                    <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" class="card-img-top" alt="Blog Post Image">
                    <div class="card-img-overlay d-flex flex-column justify-content-end">
                        <span class="category-tag">Python</span>
                    </div>
                </div>
                <div class="card-body">
                    <div class="post-meta mb-2">
                        <small class="text-muted"><i class="far fa-calendar-alt me-1"></i> May 10, 2023</small>
                        <small class="text-muted ms-3"><i class="far fa-clock me-1"></i> 6 min read</small>
                    </div>
                    <h5 class="card-title">Python for Data Science</h5>
                    <p class="card-text">Learn how to use Python for data analysis, visualization, and machine learning projects.</p>
                </div>
                <div class="card-footer bg-transparent border-0 d-flex justify-content-between align-items-center">
                    <a href="#" class="btn btn-link text-primary p-0">Read More <i class="fas fa-arrow-right ms-1"></i></a>
                    <div class="d-flex align-items-center">
                        <span class="me-3"><i class="far fa-eye me-1"></i> 478</span>
                        <button class="btn btn-sm btn-outline-primary rounded-circle like-btn"><i class="far fa-heart"></i></button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- New Blog Post 2 -->
        <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-duration="800">
            <div class="card blog-card h-100">
                <div class="card-img-wrapper">
                    <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" class="card-img-top" alt="Blog Post Image">
                    <div class="card-img-overlay d-flex flex-column justify-content-end">
                        <span class="category-tag">DevOps</span>
                    </div>
                </div>
                <div class="card-body">
                    <div class="post-meta mb-2">
                        <small class="text-muted"><i class="far fa-calendar-alt me-1"></i> May 5, 2023</small>
                        <small class="text-muted ms-3"><i class="far fa-clock me-1"></i> 8 min read</small>
                    </div>
                    <h5 class="card-title">Docker for Beginners</h5>
                    <p class="card-text">A comprehensive guide to containerization with Docker for web development projects.</p>
                </div>
                <div class="card-footer bg-transparent border-0 d-flex justify-content-between align-items-center">
                    <a href="#" class="btn btn-link text-primary p-0">Read More <i class="fas fa-arrow-right ms-1"></i></a>
                    <div class="d-flex align-items-center">
                        <span class="me-3"><i class="far fa-eye me-1"></i> 392</span>
                        <button class="btn btn-sm btn-outline-primary rounded-circle like-btn"><i class="far fa-heart"></i></button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- New Blog Post 3 -->
        <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-duration="800">
            <div class="card blog-card h-100">
                <div class="card-img-wrapper">
                    <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" class="card-img-top" alt="Blog Post Image">
                    <div class="card-img-overlay d-flex flex-column justify-content-end">
                        <span class="category-tag">Security</span>
                    </div>
                </div>
                <div class="card-body">
                    <div class="post-meta mb-2">
                        <small class="text-muted"><i class="far fa-calendar-alt me-1"></i> April 28, 2023</small>
                        <small class="text-muted ms-3"><i class="far fa-clock me-1"></i> 7 min read</small>
                    </div>
                    <h5 class="card-title">Web Security Best Practices</h5>
                    <p class="card-text">Essential security practices every web developer should implement to protect applications.</p>
                </div>
                <div class="card-footer bg-transparent border-0 d-flex justify-content-between align-items-center">
                    <a href="#" class="btn btn-link text-primary p-0">Read More <i class="fas fa-arrow-right ms-1"></i></a>
                    <div class="d-flex align-items-center">
                        <span class="me-3"><i class="far fa-eye me-1"></i> 521</span>
                        <button class="btn btn-sm btn-outline-primary rounded-circle like-btn"><i class="far fa-heart"></i></button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Create temporary element to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = newArticlesHTML;
    
    // Append each new article to the container
    while (tempDiv.firstChild) {
        articlesContainer.appendChild(tempDiv.firstChild);
    }
    
    // Reinitialize AOS for new elements
    AOS.refresh();
    
    // Reinitialize like buttons for new elements
    const newLikeButtons = articlesContainer.querySelectorAll('.like-btn:not(.initialized)');
    newLikeButtons.forEach(button => {
        button.classList.add('initialized');
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.classList.add('text-danger');
                this.classList.add('liked');
                showToast('Post liked!', 'You liked this article.');
            } else {
                icon.classList.remove('fas');
                icon.classList.remove('text-danger');
                icon.classList.add('far');
                this.classList.remove('liked');
            }
        });
    });
}