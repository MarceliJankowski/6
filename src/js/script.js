const titleLinks = document.querySelectorAll(".titles > li > a");
const articles = document.querySelectorAll("article");

titleLinks.forEach(link =>
  link.addEventListener("click", event => {
    event.preventDefault();

    titleLinks.forEach(link => link.classList.remove("active"));

    const currentLink = event.currentTarget;
    currentLink.classList.add("active");
    const currentLinkHref = currentLink.getAttribute("href").slice(1);

    articles.forEach(article => {
      if (article.id !== currentLinkHref) article.classList.remove("active");
      else article.classList.add("active");
    });
  })
);
