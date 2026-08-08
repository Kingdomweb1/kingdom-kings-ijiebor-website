const postForm = document.getElementById('post-form');
const postsList = document.getElementById('posts-list');
const titleInput = document.getElementById('post-title');
const excerptInput = document.getElementById('post-excerpt');
const contentInput = document.getElementById('post-content');
const homePostsPreview = document.getElementById('home-posts-preview');
const storageKey = 'kingdom-posts';

const defaultPosts = [
  {
    title: 'The Power of Purpose in Daily Living',
    excerpt: 'Purpose gives direction to life, leadership, and service.',
    content: 'A life without purpose often wanders in confusion. When a person understands their calling, they begin to live with clarity, discipline, and reverence for the work God has placed before them. Purpose is not only discovered in moments of vision; it is shaped through obedience, consistency, and faithful service.',
    date: '2026-07-10T10:00:00.000Z'
  },
  {
    title: 'Leadership Begins with Character',
    excerpt: 'True leadership is rooted in integrity and humility.',
    content: 'Many people seek influence, yet they neglect the foundation that sustains lasting impact. Character is what keeps leadership from becoming shallow or self-serving. A leader who is governed by truth, discipline, and compassion will build trust and leave a deeper mark on others.',
    date: '2026-07-18T10:00:00.000Z'
  },
  {
    title: 'Walking in Wisdom in a Confused Generation',
    excerpt: 'Wisdom is essential for staying grounded in a noisy age.',
    content: 'The world is full of voices, but not all of them lead to truth. Wisdom helps believers discern what is valuable, what is lasting, and what honors God. It teaches us to live with balance, patience, and sound judgment even when the culture around us is unstable.',
    date: '2026-07-25T10:00:00.000Z'
  }
];

function formatPostContent(content) {
  return content
    .trim()
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\n/g, '<br>');
}

function createPostCard(post) {
  const article = document.createElement('article');
  article.className = 'article-card';

  const published = post.date ? new Date(post.date).toLocaleDateString('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : 'Recently added';

  const excerpt = post.excerpt || post.content.slice(0, 180) + (post.content.length > 180 ? '...' : '');
  const content = formatPostContent(post.content);
  const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  article.innerHTML = `
    <h3><a href="post.html?post=${slug}">${post.title}</a></h3>
    <p class="list-text"><small>${published}</small></p>
    <p>${excerpt}</p>
    <div class="post-body">${content}</div>
  `;

  return article;
}

function savePosts(posts) {
  localStorage.setItem(storageKey, JSON.stringify(posts));
}

function loadPosts() {
  const stored = localStorage.getItem(storageKey);

  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length) {
        return parsed;
      }
    } catch (error) {
      console.warn('Unable to read saved posts:', error);
    }
  }

  savePosts(defaultPosts);
  return defaultPosts;
}

function renderPosts(posts) {
  if (postsList) {
    postsList.innerHTML = '';

    if (!posts.length) {
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      emptyState.textContent = 'No posts added yet. Copy your first post above to begin.';
      postsList.appendChild(emptyState);
    } else {
      posts.forEach((post) => postsList.appendChild(createPostCard(post)));
    }
  }

  if (homePostsPreview) {
    const previewPosts = posts.slice(0, 3);
    homePostsPreview.innerHTML = '';

    if (!previewPosts.length) {
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      emptyState.textContent = 'More posts will appear here soon.';
      homePostsPreview.appendChild(emptyState);
      return;
    }

    previewPosts.forEach((post) => {
      const previewCard = document.createElement('article');
      previewCard.className = 'article-card';
      const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      previewCard.innerHTML = `
        <h3><a href="post.html?post=${slug}">${post.title}</a></h3>
        <p class="list-text"><small>${new Date(post.date || Date.now()).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' })}</small></p>
        <p>${post.excerpt || post.content.slice(0, 120) + (post.content.length > 120 ? '...' : '')}</p>
      `;
      homePostsPreview.appendChild(previewCard);
    });
  }
}

postForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const post = {
    title: titleInput.value.trim(),
    excerpt: excerptInput.value.trim(),
    content: contentInput.value.trim(),
    date: new Date().toISOString()
  };

  if (!post.title || !post.content) {
    return;
  }

  const posts = loadPosts();
  posts.unshift(post);
  savePosts(posts);
  renderPosts(posts);

  postForm.reset();
  titleInput.focus();
});

window.addEventListener('load', () => renderPosts(loadPosts()));
