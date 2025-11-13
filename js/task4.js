document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("onClick");
  button.addEventListener("click", function () {
    resultArray(collection);
  });

  bindDragEvents();
});
let collection = new Map();
let dragOffsetX, dragOffsetY;

function resultArray(collection) {
  collection = new Map();
  let words = document
    .getElementById("words")
    .value.split("-")
    .map((el) => el.trim())
    .sort(function (a, b) {
      const isNumA = !isNaN(a);
      const isNumB = !isNaN(b);

      if (isNumA && !isNumB) return 1;
      if (!isNumA && isNumB) return -1;
      if (isNumA && isNumB) return a - b;

      const isLowerA = /^[a-zа-яё]/u.test(a);
      const isLowerB = /^[a-zа-яё]/u.test(b);
      const isUpperA = /^[A-ZА-ЯЁ]/u.test(a);
      const isUpperB = /^[A-ZА-ЯЁ]/u.test(b);

      if (isLowerA && !isLowerB) return -1;
      if (!isLowerA && isLowerB) return 1;

      if (isUpperA && !isUpperB) return 1;
      if (!isUpperA && isUpperB) return -1;

      return a.localeCompare(b, ["ru", "en"], { sensitivity: "base" });
    });

  let a = 1;
  let b = 1;
  let n = 1;
  for (const element of words) {
    if (/^\p{Ll}/u.test(element)) {
      collection.set("a" + a, element);
      a++;
    } else if (/^\p{Lu}/u.test(element)) {
      collection.set("b" + b, element);
      b++;
    } else if (/^[0-9]/.test(element)) {
      collection.set("n" + n, element);
      n++;
    }
  }

  const root = document.querySelector(".task4__word-list");
  root.replaceChildren();
  document.querySelector(".task4__dragzone").replaceChildren();
  function createItem(key, value) {
    const addspan = document.createElement("span");
    addspan.className = "task4__word-item";
    addspan.textContent = key + " " + value;
    addspan.draggable = true;
    addspan.id = "item-" + key;
    const fixedColor = "#f0f0f0";
    addspan.style.backgroundColor = fixedColor;
    addspan.dataset.fixedColor = fixedColor;
    root.append(addspan);
  }

  for (let [key, value] of collection) {
    createItem(key, value);
  }

  // Перепривязываем события после создания новых элементов
  bindDragEvents();
}

function bindDragEvents() {
  const zone1 = document.querySelector(".task4__dragzone");
  const zone2 = document.querySelector(".task4__word-list");
  const words = document.querySelectorAll(".task4__word-item");

  // Очищаем предыдущие обработчики
  [zone1, zone2].forEach((zone) => {
    zone.removeEventListener("dragover", dragOver);
    zone.removeEventListener("drop", dragDrop);
    zone.removeEventListener("dragenter", dragEnter);
    zone.removeEventListener("dragleave", dragLeave);

    // Добавляем новые обработчики
    zone.addEventListener("dragover", dragOver);
    zone.addEventListener("drop", dragDrop);
    zone.addEventListener("dragenter", dragEnter);
    zone.addEventListener("dragleave", dragLeave);
  });

  words.forEach((el) => {
    el.removeEventListener("dragstart", dragStart);
    el.addEventListener("dragstart", dragStart);
  });
}

function dragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.id);
  const rect = e.target.getBoundingClientRect();
  dragOffsetX = e.clientX - rect.left;
  dragOffsetY = e.clientY - rect.top;
}

function dragEnter(e) {
  e.preventDefault();
  if (e.target.classList.contains("task4__dragzone")) {
    e.target.classList.add("drag-over");
  }
}

function dragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}

function dragLeave(e) {
  if (e.target.classList.contains("task4__dragzone")) {
    e.target.classList.remove("drag-over");
  }
}

function dragDrop(e) {
  e.preventDefault();

  const data = e.dataTransfer.getData("text/plain");
  const el = document.getElementById(data);
  if (!el) return;

  const isZone1 = e.currentTarget.classList.contains("task4__dragzone");
  const isZone2 = e.currentTarget.classList.contains("task4__word-list");

  if (isZone1) {
    const container = e.currentTarget;
    const containerRect = container.getBoundingClientRect();

    // Получаем размеры элемента
    const elementRect = el.getBoundingClientRect();

    // Рассчитываем позицию с учётом смещения курсора
    let x = e.clientX - containerRect.left - dragOffsetX;
    let y = e.clientY - containerRect.top - dragOffsetY;

    // Ограничиваем координаты, чтобы элемент не выходил за границы
    const padding = 5;
    const minX = padding;
    const minY = padding;
    const maxX = containerRect.width - elementRect.width - padding;
    const maxY = containerRect.height - elementRect.height - padding;

    x = Math.max(minX, Math.min(x, maxX));
    y = Math.max(minY, Math.min(y, maxY));

    el.style.position = "absolute";
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.margin = "0";
    el.style.backgroundColor = getRandomColor();

    container.appendChild(el);
    container.classList.remove("drag-over");
  }

  if (isZone2) {
    el.style.position = "";
    el.style.left = "";
    el.style.top = "";
    el.style.margin = "";
    el.style.backgroundColor = "#f0f0f0";

    const root = e.currentTarget;
    const key = el.id.replace("item-", "");
    const items = Array.from(root.querySelectorAll(".task4__word-item"));

    let inserted = false;
    for (let i = 0; i < items.length; i++) {
      const currentKey = items[i].id.replace("item-", "");
      if (key.localeCompare(currentKey, undefined, { numeric: true }) < 0) {
        root.insertBefore(el, items[i]);
        inserted = true;
        break;
      }
    }
    if (!inserted) root.appendChild(el);
  }
}

const boshka = document.querySelector(".task4__select-word");
const dragZone = document.querySelector(".task4__dragzone");

dragZone.addEventListener("click", function (event) {
  const target = event.target;
  if (target.classList.contains("task4__word-item")) {
    const text = target.textContent;

    const value = text.split(" ").slice(1).join(" ");

    const newSpan = document.createElement("span");
    newSpan.className = "task4__boshka-item";
    newSpan.textContent = value + " ";

    boshka.appendChild(newSpan);
  }
});
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
