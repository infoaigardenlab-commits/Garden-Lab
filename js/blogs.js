// Global blogs data
let allBlogs = [];
let currentSearchResults = [];
let currentPage = 1;
const blogsPerPage = 6;

// Initialize page on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
  loadBlogs();
  setupEventListeners();

  // Update dynamic year in footer
  const yearElement = document.getElementById('dynamic-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});

// Setup event listeners for filters and search
function setupEventListeners() {
  const searchInputMain = document.getElementById('blog-search-main');
  if (searchInputMain) {
    searchInputMain.addEventListener('input', function () {
      searchBlogs(this.value);
    });
  }
}

// Load blogs from embedded data
function loadBlogs() {
  try {
    // Sort blogs by date descending (latest first)
    allBlogs = blogsData.blogs.slice().sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });
    currentSearchResults = allBlogs;
    currentPage = 1;
    displayBlogsOnPage();
  } catch (error) {
    console.error('Error loading blogs:', error);
    const container = document.getElementById('blogs-list');
    if (container) {
      container.innerHTML = '<div class="alert alert-danger"><strong>Error:</strong> Unable to load blogs.</div>';
    }
  }
}

function createSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00Z');
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
}

function searchBlogs(query) {
  const searchTerm = query.toLowerCase().trim();
  currentSearchResults = allBlogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm) ||
    blog.excerpt.toLowerCase().includes(searchTerm) ||
    blog.category.toLowerCase().includes(searchTerm)
  );
  currentPage = 1;
  displayBlogsOnPage();
}

function displayBlogsOnPage() {
  const container = document.getElementById('blogs-list');
  if (!container) return;

  if (currentSearchResults.length === 0) {
    container.innerHTML = '<div class="col-xs-12 text-center" style="padding:50px;"><h3 style="color:#999;">No results found...</h3></div>';
    updatePagination(0);
    return;
  }

  const startIndex = (currentPage - 1) * blogsPerPage;
  const paginatedBlogs = currentSearchResults.slice(startIndex, startIndex + blogsPerPage);

  container.innerHTML = paginatedBlogs.map(blog => {
    const slug = createSlug(blog.title);
    return `
      <div class="col-md-4 col-sm-6">
        <article class="blog-card">
          <div class="blog-image">
            <img src="${blog.image}" alt="${blog.title}" 
                 onerror="this.src='https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1000&auto=format&fit=crop'">
          </div>
          <div class="blog-content">
            <h3>${blog.title}</h3>
            <p>${blog.excerpt}</p>
          </div>
          <div class="blog-footer">
            <span class="blog-category-text">${blog.category}${blog.date ? ' · ' + formatDate(blog.date) : ''}</span>
            <a href="blog-fullscreen.html?slug=${encodeURIComponent(slug)}" class="blog-read-more">Read More <i class="fa fa-arrow-right"></i></a>
          </div>
        </article>
      </div>
    `;
  }).join('');

  updatePagination(currentSearchResults.length);
  window.scrollTo({ top: 300, behavior: 'smooth' });
}

function updatePagination(totalItems) {
  const totalPages = Math.ceil(totalItems / blogsPerPage);
  const container = document.getElementById('pagination-container');
  if (!container) return;

  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  // Calculate page range to show (max 5 pages)
  const maxPagesToShow = 5;
  let startPage, endPage;
  let pages = [];

  if (totalPages <= maxPagesToShow) {
    // Show all pages if total is less than max
    startPage = 1;
    endPage = totalPages;
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
  } else {
    // Smart pagination logic
    if (currentPage <= 3) {
      // Near the beginning: show 1, 2, 3, 4, 5
      startPage = 1;
      endPage = maxPagesToShow;
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    } else if (currentPage >= totalPages - 2) {
      // Near the end: show pages backwards if on last page
      if (currentPage === totalPages) {
        // On last page: show 10, 9, 8, 7, 6 (backwards)
        for (let i = totalPages; i >= totalPages - maxPagesToShow + 1; i--) {
          pages.push(i);
        }
      } else {
        // Near end but not last: show forward
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
      }
    } else {
      // In the middle: show current page ± 2
      startPage = currentPage - 2;
      endPage = currentPage + 2;
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
  }

  let paginationHtml = '<div class="pagination-wrapper"><ul class="pagination">';

  // Previous Button - disabled on first page
  const prevDisabled = currentPage === 1 ? ' disabled' : '';
  const prevClick = currentPage === 1 ? 'return false;' : `changePage(${currentPage - 1}); return false;`;
  paginationHtml += `<li class="prev${prevDisabled}"><a href="#" onclick="${prevClick}">← Prev</a></li>`;

  // Page Numbers - if on last page and showing backwards, show in reverse order (10, 9, 8, 7, 6)
  if (currentPage === totalPages && totalPages > maxPagesToShow) {
    // Show pages in reverse order (already pushed backwards, so iterate forward)
    for (let i = 0; i < pages.length; i++) {
      const pageNum = pages[i];
      if (currentPage === pageNum) {
        paginationHtml += `<li class="active"><span>${pageNum}</span></li>`;
      } else {
        paginationHtml += `<li><a href="#" onclick="changePage(${pageNum}); return false;">${pageNum}</a></li>`;
      }
    }
  } else {
    // Show pages in normal order
    for (let i = 0; i < pages.length; i++) {
      const pageNum = pages[i];
      if (currentPage === pageNum) {
        paginationHtml += `<li class="active"><span>${pageNum}</span></li>`;
      } else {
        paginationHtml += `<li><a href="#" onclick="changePage(${pageNum}); return false;">${pageNum}</a></li>`;
      }
    }
  }

  // Next Button - disabled on last page
  const nextDisabled = currentPage === totalPages ? ' disabled' : '';
  const nextClick = currentPage === totalPages ? 'return false;' : `changePage(${currentPage + 1}); return false;`;
  paginationHtml += `<li class="next${nextDisabled}"><a href="#" onclick="${nextClick}">Next →</a></li>`;

  paginationHtml += '</ul></div>';
  container.innerHTML = paginationHtml;
}

window.changePage = function (page) {
  const totalPages = Math.ceil(currentSearchResults.length / blogsPerPage);
  if (page < 1 || page > totalPages) return;
  if (page === currentPage) return; // Prevent unnecessary updates
  currentPage = page;
  displayBlogsOnPage();
};
