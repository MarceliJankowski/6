const articles = document.querySelectorAll("article");

generateTitleLinks();

function generateTitleLinks(customSelector = "") {
  clearTitleLinks();

  const curatedArticles = document.querySelectorAll(`article${customSelector}`);

  // generate titleLinks
  curatedArticles.forEach(({ id }) => {
    const articleTitle = document.querySelector(`#${id} > .post-title`).innerText;

    const articleTitleLink = document.createElement("a");
    articleTitleLink.href = `#${id}`;
    articleTitleLink.innerHTML = `<span>${articleTitle}</span>`;

    const articleTitleItem = document.createElement("li");
    articleTitleItem.appendChild(articleTitleLink);

    articleTitleLink.addEventListener("click", titleClickHandler);

    document.querySelector(".titles").appendChild(articleTitleItem);
  });
}

function titleClickHandler(event) {
  event.preventDefault();

  const titleLinks = document.querySelectorAll(".titles > li > a"); // get titleLinks every time title is clicked because titleLinks are prone to change

  const currentLink = event.currentTarget;

  titleLinks.forEach(link => link.classList.remove("active")); // remove "active" class from every titleLink

  currentLink.classList.add("active");
  const currentLinkHref = currentLink.getAttribute("href").slice(1); // get href without "#"

  // add "active" class to article linked with currentLink
  articles.forEach(article => {
    if (article.id !== currentLinkHref) article.classList.remove("active");
    else article.classList.add("active");
  });
}

// clear titleLinks whenever user clicks on tag or author
const tags = document.querySelectorAll(".tags a");
const authors = document.querySelectorAll(".authors a");

[...tags, ...authors].forEach(el => el.addEventListener("click", clearTitleLinks));

function clearTitleLinks() {
  document.querySelector(".titles").innerHTML = "";
}

(function generateTags() {
  articles.forEach(article => {
    const articleTagList = article.querySelector(".post-tags > ul");
    const articleTags = article.dataset.tags.split(" ");

    articleTags.forEach(tag => {
      const newArticleTag = document.createElement("li");
      newArticleTag.innerHTML = `&nbsp;<a href="#tag-${tag}">${tag}</a>`;

      articleTagList.appendChild(newArticleTag);
    });
  });
})();

function articleTagClickHandler(event) {
  event.preventDefault();

  const articleTag = event.currentTarget;
  const href = articleTag.getAttribute("href");
  const tag = href.split("-").at(1);

  const activeTags = document.querySelectorAll("a.active[href^='#tag-']");
  activeTags.forEach(tag => tag.classList.remove("active"));

  const linksWithTheSameHref = document.querySelectorAll(`a[href^='${href}']`);
  linksWithTheSameHref.forEach(tag => tag.classList.add("active"));

  generateTitleLinks(`[data-tags~="${tag}"]`);
}

(function addClickListenersToArticleTags() {
  const tagLinks = document.querySelectorAll("a[href^='#tag-']");

  tagLinks.forEach(tag => tag.addEventListener("click", articleTagClickHandler));
})();

(function generateArticleAuthors() {
  articles.forEach(article => {
    const author = article.getAttribute("data-author");
    const authorSlug = author.replace(" ", "-").toLowerCase();

    const authorLink = document.createElement("a");
    authorLink.innerText = author;
    authorLink.href = `#${authorSlug}`;
    authorLink.addEventListener("click", articleAuthorClickHandler);

    const articleAuthorWrapper = article.querySelector(".post-author");
    articleAuthorWrapper.appendChild(authorLink);
  });
})();

function articleAuthorClickHandler(event) {
  const author = event.currentTarget.innerText;
  generateTitleLinks(`[data-author="${author}"]`);
}
