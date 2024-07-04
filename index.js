const input = document.querySelector(".input");
const listRepositories = document.querySelector(".list");
const repositoriesContainer = document.querySelector(".repositories");
const repository = document.querySelector(".repositories__element");
let loadedRepositories = [];

function renderRepoUsers(name) {
  if (listRepositories.children.length >= 5) {
    clearRepo();
  }
  listRepositories.insertAdjacentHTML(
    "beforeend",
    `
      <li class="list__element">${name}</li>
    `
  );
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

input.addEventListener("input", debounce(requestRepositories, 500));

function closeRepoElement(evt) {
  if (evt.target.closest(".repositories__btn")) {
    evt.target.parentNode.remove();
  } else {
    return;
  }
}

function createCardRepository(data) {
  const {
    name,
    owner: { login },
    stargazers_count,
  } = data;
  repositoriesContainer.insertAdjacentHTML(
    "beforeend",
    `
    <li class="repositories__element">
          <div class="repositories__text">
            <span class="repositories__text-element name">Name: ${name}</span>
            <span class="repositories__text-element owner"
              >Owner: ${login}</span
            >
            <span class="repositories__text-element stars">Stars: ${stargazers_count}</span>
          </div>
          <button class="repositories__btn"></button>
        </li>`
  );
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
