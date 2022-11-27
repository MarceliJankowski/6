const articles = document.querySelectorAll("article");

(function generateTitleLinks() {
  clearTitleLinks();

  // generate titleLinks
  articles.forEach(({ id }) => {
    const articleTitle = document.querySelector(`#${id} > .post-title`).innerText;

    const articleTitleLink = document.createElement("a");
    articleTitleLink.href = `#${id}`;
    articleTitleLink.innerHTML = `<span>${articleTitle}</span>`;

    const articleTitleItem = document.createElement("li");
    articleTitleItem.appendChild(articleTitleLink);

    articleTitleLink.addEventListener("click", titleClickHandler);

    document.querySelector(".titles").appendChild(articleTitleItem);
  });
})();

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
