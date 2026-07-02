(function () {
  'use strict';

  $('a.page-scroll').on('click', function () {
    if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top - 50
        }, 900);
        return false;
      }
    }
  });


  // Show Menu on Scroll
  $(window).on('scroll', function () {
    var $nav = $('.navbar-transparent');
    if ($nav.length > 0) {
      var navHeight = $(window).height() * 0.8; // 80% of the screen height
      if ($(window).scrollTop() > navHeight) {
        $nav.addClass('on');
      } else {
        $nav.removeClass('on');
      }
    }
  });

  // Scrollspy - only if Bootstrap scrollspy is available
  if (typeof $.fn.scrollspy !== 'undefined') {
    $('body').scrollspy({
      target: '.navbar-default',
      offset: 80
    });
  }

  // Hide nav on click
  $(".navbar-nav li a").on('click', function () {
    // check if window is small enough so dropdown is created
    var toggle = $(".navbar-toggle").is(":visible");
    if (toggle) {
      $(".navbar-collapse").collapse('hide');
    }
  });

  // Portfolio isotope filter
  $(window).on('load', function () {
    var $container = $('.portfolio-items');
    if ($container.length > 0 && typeof $.fn.isotope !== 'undefined') {
      $container.isotope({
        filter: '*',
        animationOptions: {
          duration: 750,
          easing: 'linear',
          queue: false
        }
      });
      $('.cat a').on('click', function () {
        $('.cat .active').removeClass('active');
        $(this).addClass('active');
        var selector = $(this).attr('data-filter');
        $container.isotope({
          filter: selector,
          animationOptions: {
            duration: 750,
            easing: 'linear',
            queue: false
          }
        });
        return false;
      });
    }
  });

  // Lightbox
  if (typeof GLightbox === 'function') {
    GLightbox({
      selector: '.glightbox'
    });
  }

  // Testimonial Slider (Owl Carousel 2)
  if (typeof $.fn.owlCarousel !== 'undefined') {
    var $testimonial = $("#testimonial");
    if ($testimonial.length > 0) {
      $testimonial.owlCarousel({
        items: 1,
        nav: false,
        dots: true,
        smartSpeed: 400,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        loop: true
      });
    }
  }

}());

document.addEventListener('DOMContentLoaded', function () {
  const yearElement = document.getElementById('dynamic-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault(); // Prevent default form submission

      // Validate form fields
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      // Email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !message) {
        alert('Please fill out all fields before submitting.');
        return;
      }

      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      // Show toast message
      const toast = document.createElement('div');
      toast.textContent = 'Your message has been sent successfully!';
      toast.style.position = 'fixed';
      toast.style.bottom = '20px';
      toast.style.right = '20px';
      toast.style.backgroundColor = '#333';
      toast.style.color = '#fff';
      toast.style.padding = '10px 20px';
      toast.style.borderRadius = '5px';
      toast.style.zIndex = '1000';
      document.body.appendChild(toast);


      // Remove toast after 3 seconds
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 3000);

      // Optionally, you can add code to send the form data to a server here
    });
  }
});

// FAQ Accordion functionality
window.addEventListener('load', function () {
  if (window.jQuery) {
    var $ = window.jQuery;
    $('.panel-collapse').on('show.bs.collapse', function () {
      $(this).siblings('.panel-heading').addClass('active-heading');
    });
    $('.panel-collapse').on('hide.bs.collapse', function () {
      $(this).siblings('.panel-heading').removeClass('active-heading');
    });
    $('.panel-collapse.in').siblings('.panel-heading').addClass('active-heading');
  }
});

// Blog fullscreen functionality
function createSlug(text) {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

function formatBlogDate(dateStr) {
  if (!dateStr) return '';
  var date = new Date(dateStr + 'T00:00:00Z');
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
}

// Load last 3 blogs into "Latest from our Blog" section on index page
function loadLatestBlogs() {
  var container = document.getElementById('latest-blogs-row');
  if (!container || typeof blogsData === 'undefined' || !blogsData.blogs || !blogsData.blogs.length) return;
  var blogs = blogsData.blogs.slice();
  blogs.sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
  var latest = blogs.slice(0, 3);
  var fallbackImg = 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1000&auto=format&fit=crop';
  container.innerHTML = latest.map(function (blog) {
    var slug = createSlug(blog.title);
    var img = blog.image || fallbackImg;
    var alt = blog.alt || blog.title;
    return '<div class="col-md-4">' +
      '<div class="blog-card">' +
      '<div class="blog-image">' +
      '<img src="' + img + '" alt="' + alt.replace(/"/g, '&quot;') + '" loading="lazy" width="400" height="250" onerror="this.src=\'' + fallbackImg + '\'">' +
      '</div>' +
      '<div class="blog-content"><h3>' + blog.title.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</h3>' +
      '<p>' + (blog.excerpt || '').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</p></div>' +
      '<div class="blog-footer">' +
      '<span class="blog-category-text">' + (blog.category || '').replace(/</g, '&lt;') + (blog.date ? ' · ' + formatBlogDate(blog.date) : '') + '</span>' +
      '<a href="blog-fullscreen.html?slug=' + encodeURIComponent(slug) + '" class="blog-read-more">Read More <i class="fa fa-arrow-right"></i></a>' +
      '</div></div></div>';
  }).join('');
}

// Load blog content on blog-fullscreen page
function loadBlogDetail() {
  if ($('#blog-article').length > 0) {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');

    if (slug && typeof blogsData !== 'undefined' && blogsData.blogs) {
      const blog = blogsData.blogs.find(b => createSlug(b.title) === slug);
      if (blog) {
        const allBlogs = blogsData.blogs.slice();
        const relatedBlogs = allBlogs
          .filter(function (item) { return createSlug(item.title) !== slug; })
          .filter(function (item) { return item.category === blog.category; })
          .slice(0, 3);
        if (relatedBlogs.length < 3) {
          const fallbackBlogs = allBlogs
            .filter(function (item) { return createSlug(item.title) !== slug; })
            .filter(function (item) {
              return !relatedBlogs.some(function (rb) { return rb.title === item.title; });
            })
            .slice(0, 3 - relatedBlogs.length);
          Array.prototype.push.apply(relatedBlogs, fallbackBlogs);
        }

        document.title = (blog.title.length > 45 ? blog.title.substring(0, 42) + '...' : blog.title) + ' | AI Garden Lab';
        if (document.title.length > 60) document.title = blog.title.substring(0, 57) + '... | AI Garden Lab';
        const altText = blog.alt || blog.title;
        const authorName = blog.author || 'AI Garden Lab Team';
        const pubDate = blog.date ? new Date(blog.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
        const absImg = blog.image.indexOf('http') === 0 ? blog.image : 'https://aigardenlab.com/' + blog.image.replace(/^\//, '');
        const absUrl = 'https://aigardenlab.com/blog-fullscreen.html?slug=' + encodeURIComponent(slug);
        const desc = (blog.excerpt || blog.title).replace(/<[^>]+>/g, '').substring(0, 155);
        const shareTitle = encodeURIComponent(blog.title);
        const shareUrl = encodeURIComponent(absUrl);
        const relatedHtml = relatedBlogs.map(function (item) {
          const relatedSlug = createSlug(item.title);
          const relatedImage = item.image || 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1000&auto=format&fit=crop';
          const relatedExcerpt = (item.excerpt || '').replace(/<[^>]+>/g, '').trim();
          return `
            <div class="col-sm-4">
              <a class="related-post-card" href="blog-fullscreen.html?slug=${encodeURIComponent(relatedSlug)}">
                <img src="${relatedImage}" alt="${(item.alt || item.title).replace(/"/g, '&quot;')}" loading="lazy">
                <h3>${item.title.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</h3>
                <p>${relatedExcerpt.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
              </a>
            </div>
          `;
        }).join('');
        $('#blog-article').html(`
          <div class="blog-header-meta">
            <span class="blog-detail-category">${blog.category}</span>
            ${pubDate ? '<span class="blog-detail-date">' + pubDate + '</span>' : ''}
            <span class="blog-detail-author">By ${authorName}</span>
          </div>
          <h1 class="blog-title-main">${blog.title}</h1>
          <div class="blog-detail-image-wrapper">
            <img src="${blog.image}" alt="${altText.replace(/"/g, '&quot;')}" loading="lazy" width="800" height="500" onerror="this.src='https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1000&auto=format&fit=crop'">
          </div>
          <div class="blog-content-body">${blog.content}</div>
          <div class="blog-share-row">
            <span class="share-label">Share:</span>
            <a href="https://wa.me/?text=${shareTitle}%20${shareUrl}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a href="https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=${shareUrl}" target="_blank" rel="noopener noreferrer">Facebook</a>
          </div>
          <div class="blog-end-cta">
            <h3>Use Our Free AI Gardening Tools</h3>
            <p>Get practical recommendations for your plants and measure your garden's environmental impact.</p>
            <a href="index.html#services" class="btn btn-custom">Try Free Tools</a>
          </div>
          ${relatedBlogs.length ? `
            <section class="related-posts-section">
              <h2>Related Posts</h2>
              <div class="row">${relatedHtml}</div>
            </section>
          ` : ''}
        `);
        var metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', desc);
        var canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) canonical.setAttribute('href', absUrl);
        var ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', blog.title + ' | AI Garden Lab');
        var ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', desc);
        var ogImg = document.querySelector('meta[property="og:image"]');
        if (ogImg) ogImg.setAttribute('content', absImg);
        var ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute('content', absUrl);
        var twTitle = document.querySelector('meta[name="twitter:title"]');
        if (twTitle) twTitle.setAttribute('content', blog.title + ' | AI Garden Lab');
        var twDesc = document.querySelector('meta[name="twitter:description"]');
        if (twDesc) twDesc.setAttribute('content', desc);
        var twImg = document.querySelector('meta[name="twitter:image"]');
        if (twImg) twImg.setAttribute('content', absImg);
        var articleSchema = {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: blog.title,
          description: desc,
          image: absImg,
          datePublished: blog.date || '',
          author: { '@type': 'Person', name: authorName },
          publisher: { '@type': 'Organization', name: 'AI Garden Lab', logo: { '@type': 'ImageObject', url: 'https://aigardenlab.com/img/main.svg' } },
          mainEntityOfPage: { '@type': 'WebPage', '@id': absUrl }
        };
        var script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(articleSchema);
        document.head.appendChild(script);

        // Inject 300x250 banners and Smartlink CTA into article content
        // Adsterra banner injection disabled
        /*
        var bannerHtml = '<div style="text-align:center;margin:28px 0;"><script>atOptions={\'key\':\'c04f4d748669d1313daba8ed60cf3002\',\'format\':\'iframe\',\'height\':250,\'width\':300,\'params\':{}}<\/script><script src="https://www.highperformanceformat.com/c04f4d748669d1313daba8ed60cf3002/invoke.js"><\/script></div>';
        var contentBody = document.querySelector('.blog-content-body');
        if (contentBody) {
          var paragraphs = contentBody.querySelectorAll('p');
          var totalP = paragraphs.length;
          // Banner 1: After paragraph 2-3
          if (paragraphs[2]) {
            paragraphs[2].insertAdjacentHTML('afterend', bannerHtml);
          }
          // Re-query after DOM change
          paragraphs = contentBody.querySelectorAll('p');
          totalP = paragraphs.length;
          // Banner 2: Middle of article
          var midIndex = Math.floor(totalP / 2);
          if (paragraphs[midIndex]) {
            paragraphs[midIndex].insertAdjacentHTML('afterend', bannerHtml);
          }
          // Re-query after DOM change
          paragraphs = contentBody.querySelectorAll('p');
          totalP = paragraphs.length;
          // Banner 3: Before conclusion (last 2 paragraphs)
          var preConclIndex = Math.max(0, totalP - 3);
          if (paragraphs[preConclIndex]) {
            paragraphs[preConclIndex].insertAdjacentHTML('beforebegin', bannerHtml);
          }
        }
        */
        // Show article end CTA and banner below related posts
        var endCta = document.getElementById('article-end-cta');
        if (endCta) endCta.style.display = 'block';

        // Banner 4: Below related posts (inject after #blog-article) — disabled
        // var blogArticle = document.getElementById('blog-article');
        // if (blogArticle) {
        //   var bannerAfterRelated = '<div style="text-align:center;margin:28px 0;"><script>atOptions={\'key\':\'c04f4d748669d1313daba8ed60cf3002\',\'format\':\'iframe\',\'height\':250,\'width\':300,\'params\':{}}<\/script><script src="https://www.highperformanceformat.com/c04f4d748669d1313daba8ed60cf3002/invoke.js"><\/script></div>';
        //   blogArticle.insertAdjacentHTML('afterend', bannerAfterRelated);
        // }

        return;
      }
    }
    $('#blog-article').html('<div class="alert alert-danger">Blog post not found. <a href="blogs.html">Return to all blogs</a></div>');
  }
}

// Wait for jQuery and blogsData to be available
// blogs-data.js is now loaded with defer and executes before main.js (same defer order),
// so blogsData is guaranteed to be defined here. No polling loop needed.
if (typeof jQuery !== 'undefined') {
  $(document).ready(function () {
    if (typeof blogsData !== 'undefined') {
      loadBlogDetail();
      loadLatestBlogs();
    } else {
      // Fallback: data not available (should not happen with defer ordering)
      if ($('#blog-article').length) {
        $('#blog-article').html('<div class="alert alert-danger">Unable to load blog data. <a href="blogs.html">Return to all blogs</a></div>');
      }
    }
  });
}

// Toast notification (used on toast-test.html)
function showToast(message, type) {
  type = type || 'success';
  var toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;
  var toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  var icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
  toast.innerHTML = '<i class="fa ' + icon + '"></i><span>' + message + '</span>';
  toastContainer.appendChild(toast);
  setTimeout(function () { toast.classList.add('show'); }, 10);
  setTimeout(function () {
    toast.classList.remove('show');
    setTimeout(function () { toast.remove(); }, 300);
  }, 5000);
}
