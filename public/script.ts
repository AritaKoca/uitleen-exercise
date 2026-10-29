import Item from "./Item.js";

const API_URI = "http://localhost:3000";

function init() {
  document.getElementById("submitForm")?.addEventListener("click", (event) => {
    event.preventDefault();
    addItem();
  });
  getItemListAndDisplay();
}

function getItemListAndDisplay() {
  const container = document.getElementById("itemList") as HTMLDivElement;
  container.innerHTML = "";

  fetch(API_URI + "/api/items")
    .then((response) => response.json())
    .then((data) => {
      // turn every plain object from the API into an Item instance and render it
      data.forEach((element: Item) => {
        const itemInstance = new Item(element.id, element.name, element.description);
        container.insertAdjacentHTML("beforeend", itemInstance.renderHtmlString());
      });

      // the archive buttons only exist after rendering, so add the listeners now
      document.querySelectorAll(".archive-button").forEach((button) => {
        button.addEventListener("click", () => {
          const id = button.id.replace("item-archive-", "");
          archiveItem(id);
        });
      });
    })
    .catch((e) => {
      console.error(e);
    });
}

function archiveItem(id: string) {
  fetch(API_URI + "/api/items/" + id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      archived: true,
    }),
  })
    .then((response) => response.json())
    .then(() => {
      document.getElementById("item-" + id)?.remove();
    })
    .catch((e) => {
      console.error(e);
    });
}

function addItem() {
  const nameElement = document.getElementById("itemName") as HTMLInputElement;
  const descriptionElement = document.getElementById("itemDescription") as HTMLInputElement;
  // id -1: the database will give the item its real id
  const item = new Item(-1, nameElement.value, descriptionElement.value);

  fetch(API_URI + "/api/items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  })
    .then((response) => response.json())
    .then(() => {
      getItemListAndDisplay();
    })
    .catch((e) => {
      console.error(e);
    });
}

init();
