const API_URL = "http://localhost:3000";

let counter = 0;
const itemBuffer = [];
let isRendering = false;
let hasMoreItems = true;

async function consumeAPI(signal) {
  const response = await fetch(API_URL, {
    signal,
  });
  const reader = response.body
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(parseNDJSON());
  // .pipeTo(
  //   new WritableStream({
  //     write(chunk) {
  //       console.log(++counter, chunk);
  //     },
  //   })
  // );

  return reader;
}

// Função para processar o stream e guardar itens no buffer
function proccessStream(reader) {
  const itemProcessor = new WritableStream({
    async write(chunk) {
      itemBuffer.push(chunk);

      if (!isRendering) {
        await renderVisibleItems();
      }
    },
    close() {
      hasMoreItems = false;
      console.log("Stream concluído.");
    },
    abort(reason) {
      console.log("Stream abortado: ", reason);
    },
  });

  return reader.pipeTo(itemProcessor);
}

async function renderVisibleItems() {
  if (isRendering || itemBuffer.length === 0) return;

  // Renderiza em pequenos lotes para não travar a UI
  const batchSize = 10;
  const container = document.querySelector("#cards");
  while (itemBuffer.length > 0 && shouldLoadMoreItems()) {
    const batch = itemBuffer.splice(0, batchSize);

    for (const item of batch) {
      const { title, description, url_anime } = item;
      const articleElement = document.createElement("article");
      articleElement.innerHTML = `
        <div class="text">
          <h3>[${++counter}]${title}</h3>
          <p>${description.slice(0, 100).concat("...")}</p>
          <a href="${url_anime}">Clique para assistir</a>
        </div>
      `;

      container.appendChild(articleElement);
    }
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
  isRendering = false;
}

function shouldLoadMoreItems() {
  const container = document.querySelector("#cards");
  const lastItem = container.lastElementChild;
  if (!lastItem) return true;

  const rect = lastItem.getBoundingClientRect();
  const buffer = window.innerHeight * 2;

  return rect.top < window.innerHeight + buffer;
}

function setupIntersectionObserver() {
  const options = {
    rootMargin: "100px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting) && !isRendering) {
      renderVisibleItems();

      updateSentinel();
    }
  }, options);

  let sentinel = document.getElementById("sentinel");
  if (!sentinel) {
    sentinel = document.createElement("div");
    sentinel.id = "sentinel";
    sentinel.style.height = "10px";
    document.getElementById("cards").appendChild(sentinel);
  }
  observer.observe(sentinel);
}

function updateSentinel() {
  const sentinel = document.getElementById("sentinel");
  if (sentinel) {
    const cards = document.getElementById("cards");
    cards.appendChild(sentinel); // Move para o final
  }
}

function appendToHTML(element) {
  return new WritableStream({
    write({ title, description, url_anime }) {
      element.innerHTML += `
      <article> 
          <div class="text">
            <h3>[${++counter}]${title}</h3>
            <p>${description.slice(0, 100).concat("...")}</p>
            <a href="${url_anime}">Clique para assistir</a>
          </div>
        </article>
        `;
    },
    abort(reason) {
      console.log("***aborted***", reason);
    },
  });
}

// essa função vai se certifcar que caso dois chunks chegem em uma unica transmissão,
// converta corretamente para JSON
// dado: {}\n{}
// converte:
//        {}
//        {}
function parseNDJSON() {
  let ndjsonBuffer = "";
  return new TransformStream({
    transform(chunk, controller) {
      ndjsonBuffer += chunk;
      const items = ndjsonBuffer.split("\n");
      items
        .slice(0, -1)
        .forEach((item) => controller.enqueue(JSON.parse(item)));

      ndjsonBuffer = items[items.length - 1];
    },
    flush(controller) {
      if (!ndjsonBuffer) return;
      controller.enqueue(JSON.parse(ndjsonBuffer));
    },
  });
}

let abortController = new AbortController();

window.addEventListener("scroll", () => {
  if (!isRendering && hasMoreItems) {
    renderVisibleItems();
    updateSentinel();
  }
});

const readable = await consumeAPI(abortController.signal);
cards.innerHTML = "";
counter = 0;
setupIntersectionObserver();
proccessStream(readable);

// start.addEventListener("click", async () => {
//   const readable = await consumeAPI(abortController.signal);
//   cards.innerHTML = "";
//   counter = 0;
//   setupIntersectionObserver();
//   proccessStream(readable);
// });

// stop.addEventListener("click", () => {
//   abortController.abort();
//   console.log("aborting...");
//   abortController = new AbortController();
// });
