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

// clear titleLinks whenever user clicks on tag or author
{
  const tags = document.querySelectorAll(".tags a");
  const authors = document.querySelectorAll(".authors a");

  [...tags, ...authors].forEach(el => el.addEventListener("click", clearTitleLinks));
}

function clearTitleLinks() {
  document.querySelector(".titles").innerHTML = "";
}

class SetWithAmounts {
  constructor() {
    this.values = new Array();
  }

  add(val) {
    const index = this.values.findIndex(el => el.val === val);

    if (index >= 0) this.values[index].amount++;
    else {
      const newVal = { val, amount: 1 };
      this.values.push(newVal);
    }
  }
}

(function generateArticleTags() {
  const uniqueTags = new SetWithAmounts(); // store unique tags to generate tagList

  articles.forEach(article => {
    const articleTagList = article.querySelector(".post-tags > ul");
    const articleTags = article.dataset.tags.split(" ");

    articleTags.forEach(tag => {
      uniqueTags.add(tag);

      const newArticleTag = document.createElement("li");
      newArticleTag.innerHTML = `&nbsp;<a href="#tag-${tag}">${tag}</a>`;

      articleTagList.appendChild(newArticleTag);
    });
  });

  generateTagList(uniqueTags.values);
})();

function generateTagList(tags) {
  const tagList = document.querySelector(".tags");

  tags.forEach(({ val, amount }) => {
    const newTagListItemLink = document.createElement("a");
    newTagListItemLink.href = `#tag-${val}`;
    newTagListItemLink.innerText = val;

    const newTagListItemAmount = document.createElement("span");
    newTagListItemAmount.innerHTML = `&nbsp;(${amount})`;

    const newTagListItem = document.createElement("li");
    newTagListItem.appendChild(newTagListItemLink);
    newTagListItem.appendChild(newTagListItemAmount);

    newTagListItemLink.addEventListener("click", tagListItemClickHandler);

    tagList.appendChild(newTagListItem);
  });
}

function tagListItemClickHandler(event) {
  const tag = event.currentTarget.innerText;

  generateTitleLinks(`[data-tags~="${tag}"]`);
}

(function addClickListenersToArticleTags() {
  const tagLinks = document.querySelectorAll("a[href^='#tag-']");

  tagLinks.forEach(tag => tag.addEventListener("click", articleTagClickHandler));
})();

(function generateArticleAuthors() {
  const uniqueAuthors = new SetWithAmounts();

  articles.forEach(article => {
    const author = article.getAttribute("data-author");
    const authorSlug = slugify(author);

    uniqueAuthors.add(author);

    const authorLink = document.createElement("a");
    authorLink.innerText = author;
    authorLink.href = `#${authorSlug}`;
    authorLink.addEventListener("click", articleAuthorClickHandler);

    const articleAuthorWrapper = article.querySelector(".post-author");
    articleAuthorWrapper.appendChild(authorLink);
  });

  generateAuthorList(uniqueAuthors.values);
})();

function generateAuthorList(authors) {
  const authorList = document.querySelector(".authors");

  authors.forEach(({ val, amount }) => {
    const newAuthorListItemLink = document.createElement("a");
    newAuthorListItemLink.href = "#" + slugify(val);
    newAuthorListItemLink.innerHTML = `<span class="author-name">${val}</span> (${amount})`;
    newAuthorListItemLink.addEventListener("click", authorListItemClickHandler);

    const newAuthorListItem = document.createElement("li");
    newAuthorListItem.appendChild(newAuthorListItemLink);

    authorList.appendChild(newAuthorListItem);
  });
}

const authors = document.querySelectorAll(".authors > li > a");

function authorListItemClickHandler(event) {
  const authorLink = event.currentTarget;
  const authorLinkText = authorLink.querySelector("span").innerText;

  authors.forEach(author => {
    if (author.innerHTML === authorLink.innerHTML) author.classList.add("active");
    else author.classList.remove("active");
  });

  generateTitleLinks(`[data-author="${authorLinkText}"]`);
}

function slugify(string) {
  const slug = string.toLowerCase().replace(/ /, "-");
  return slug;
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

function articleAuthorClickHandler(event) {
  const author = event.currentTarget.innerText;
  generateTitleLinks(`[data-author="${author}"]`);
}

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

const uniqueTags = new Array(); // store unique tags to generate tagList

function updateUniqueTags(tag) {
  const index = uniqueTags.findIndex(el => el.tag === tag);

  index === -1 ? uniqueTags.push({ tag, amount: 1 }) : ++uniqueTags[index].amount;
}
