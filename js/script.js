const articles = document.querySelectorAll("article");

const templates = {
  articleLink: Handlebars.compile(document.querySelector("#template-article-link").innerHTML),
  articleTag: Handlebars.compile(document.querySelector("#template-article-tag").innerHTML),
  articleAuthor: Handlebars.compile(document.querySelector("#template-article-author").innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector("#template-tag-cloud-link").innerHTML),
  authorLink: Handlebars.compile(document.querySelector("#template-author-link").innerHTML),
};

generateTitleLinks();

function generateTitleLinks(customSelector = "") {
  clearTitleLinks();

  const curatedArticles = document.querySelectorAll(`article${customSelector}`);

  // generate titleLinks
  curatedArticles.forEach(({ id }) => {
    const articleTitle = document.querySelector(`#${id} > .post-title`).innerText;

    const linkHTMLData = { id, title: articleTitle };
    const linkHTML = templates.articleLink(linkHTMLData);

    document.querySelector(".titles").insertAdjacentHTML("beforeend", linkHTML);
  });

  // Why not double time complexity right?
  const createdTitleLinks = document.querySelectorAll(".titles a");
  createdTitleLinks.forEach(link => link.addEventListener("click", titleClickHandler));
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

      const tagHTMLData = { tag };
      const tagHTML = templates.articleTag(tagHTMLData);

      articleTagList.insertAdjacentHTML("beforeend", tagHTML);
    });
  });

  generateTagList(uniqueTags.values);
})();

function generateTagList(tags) {
  const tagList = document.querySelector(".tags");
  const allTagsData = {
    tags: [],
  };

  tags.forEach(({ val, amount }) => {
    allTagsData.tags.push({
      tag: val,
      amount,
    });
  });

  tagList.innerHTML = templates.tagCloudLink(allTagsData);

  document.querySelectorAll(".tags a").forEach(tag => tag.addEventListener("click", tagListItemClickHandler));
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

    const authorHTMLData = { author, authorSlug };
    const authorHTML = templates.articleAuthor(authorHTMLData);

    const articleAuthorWrapper = article.querySelector(".post-author");
    articleAuthorWrapper.insertAdjacentHTML("beforeend", authorHTML);
  });

  document
    .querySelectorAll(".post-author > a")
    .forEach(author => author.addEventListener("click", articleAuthorClickHandler));

  generateAuthorList(uniqueAuthors.values);
})();

function generateAuthorList(authors) {
  const authorList = document.querySelector(".authors");

  const allAuthorsData = {
    tags: [],
  };

  authors.forEach(({ val, amount }) => {
    allAuthorsData.tags.push({
      authorSlug: slugify(val),
      author: val,
      amount,
    });
  });

  authorList.innerHTML = templates.authorLink(allAuthorsData);

  document
    .querySelectorAll(".authors a")
    .forEach(author => author.addEventListener("click", authorListItemClickHandler));
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
