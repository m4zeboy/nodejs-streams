import csvtojson from "csvtojson";
import { createReadStream } from "node:fs";
import { createServer } from "node:http";
import { Readable, Transform } from "node:stream";
import { WritableStream } from "node:stream/web";

const PORT = 3000;
// curl -i -X OPTIONS -N localhost:3000
// curl -N localhost:3000
createServer(async (req, res) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
  };

  if (req.method === "OPTIONS") {
    res.writeHead(204, headers);
    res.end();
    return;
  }
  req.once("close", (_) => console.log("connection was closed", items));
  let items = 0;
  Readable.toWeb(createReadStream("./animeflv.csv"))
    // o passo a passo que cada item individual vai trafegar
    .pipeThrough(Transform.toWeb(csvtojson()))
    .pipeThrough(
      new TransformStream({
        transform(chunk, controller) {
          const data = JSON.parse(Buffer.from(chunk));
          const mappedData = {
            title: data.title,
            description: data.description,
            url_anime: data.url_anime,
          };
          // quqbra de linha porque é um NDJSON
          controller.enqueue(JSON.stringify(mappedData).concat("\n"));
        },
      })
    )
    // pipeTo é a ultima etapa do pipeline
    .pipeTo(
      new WritableStream({
        async write(chunk) {
          // await setTimeout(100);
          items++;
          res.write(chunk);
        },
        close() {
          res.end();
        },
      })
    );

  res.writeHead(200, headers);
  // res.end("ok2")
})
  .listen(PORT)
  .on("listening", (_) =>
    console.log(`Server is running on http://localhost:${PORT}`)
  );
