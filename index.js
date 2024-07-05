const input = document.querySelector(".input");
const listRepositories = document.querySelector(".list");
const repositoriesContainer = document.querySelector(".repositories");
const repository = document.querySelector(".repositories__element");
let loadedRepositories = [];

function renderRepoUsers(name) {
  if (listRepositories.children.length >= 5) {
    clearRepo();
  }
  const tagLi = document.createElement("li");
  tagLi.classList.add("list__element");
  tagLi.textContent = name;
  listRepositories.append(tagLi);
}

function clearRepo() {
  listRepositories.innerHTML = "";
}

function requestRepositories(evt) {
  const param = evt.target.value;
  if (param.length !== 0 && evt.data != " ") {
    fetch(`https://api.github.com/search/repositories?q=${param}&per_page=5`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("В запросе к серверу произошла ошибка...");
        }
      })
      .then((data) => {
        loadedRepositories = data.items;
        data.items.forEach((element) => {
          renderRepoUsers(element.name);
        });
      })
      .catch((err) => console.log(err));
  } else {
    clearRepo();
  }
}

function debounce(fn, ms) {
  let timer;
  return function (...arg) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...arg);
    }, ms);
  };
}

input.addEventListener("input", debounce(requestRepositories, 400));

function closeRepoElement(evt) {
  if (evt.target.closest(".repositories__btn")) {
    evt.target.parentNode.remove();
  } else {
    return;
  }
}

function createCardRepository(element) {
  const { name, language, stargazers_count } = element;
  const liContainer = document.createElement("li");
  liContainer.classList.add("repositories__element");
  const div = document.createElement("div");
  div.classList.add("repositories__text");
  const spanName = document.createElement("span");
  spanName.classList.add("repositories__text-element");
  spanName.textContent = name;
  div.append(spanName);
  const spanOwner = document.createElement("span");
  spanOwner.classList.add("repositories__text-element");
  spanOwner.textContent = language;
  div.append(spanOwner);
  const spanStars = document.createElement("span");
  spanStars.classList.add("repositories__text-element");
  spanStars.textContent = stargazers_count;
  div.append(spanStars);
  liContainer.append(div);
  const buttonClose = document.createElement("button");
  buttonClose.classList.add("repositories__btn");
  liContainer.append(buttonClose);
  repositoriesContainer.append(liContainer);
}

repositoriesContainer.addEventListener("click", closeRepoElement);
listRepositories.addEventListener("click", (evt) => {
  loadedRepositories.find((item) => {
    if (item.name === evt.target.textContent) {
      createCardRepository(item);
      input.value = "";
      clearRepo();
    }
    return;
  });
});
