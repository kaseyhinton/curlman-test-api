import Fastify from "fastify";
import countries from "./countries.js";
import fastifyStatic from "fastify-static";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(path.join(__dirname, "static"));

const fastify = Fastify({
  logger: false,
});

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "./static"),
});

fastify.setNotFoundHandler((request, reply) => {
  reply.sendFile("index.html");
});

fastify.addContentTypeParser(
  "application/x-www-form-urlencoded",
  function (_, payload, done) {
    let body = "";
    payload.on("data", function (data) {
      console.log(data);
      body += data;
    });
    payload.on("end", function () {
      try {
        const parsed = JSON.parse(body);
        done(null, parsed);
      } catch (e) {
        done(e);
      }
    });
    payload.on("error", done);
  }
);

fastify.get("/countries", (request, reply) => {
  const filter = request.query?.filter;
  console.log(request.headers);
  if (filter) {
    const filteredCountries =
      countries.filter((country) =>
        country.name.toLowerCase().includes(filter.toLowerCase())
      ) ?? [];
    console.log(filteredCountries);
    console.log(filter);
    return filteredCountries;
  }
  return countries;
});

fastify.put("/countries", (request, reply) => {
  reply.code(201);
  return {
    message: "PUT Success",
  };
});

fastify.post("/countries", (request, reply) => {
  reply.code(201);
  return {
    message: "POST Success",
  };
});

fastify.patch("/countries", (request, reply) => {
  reply.code(201);
  return {
    message: "PATCH Success",
  };
});

fastify.delete("/countries", (request, reply) => {
  reply.code(201);
  return {
    message: "DELETE Success",
  };
});

fastify.post("/login", {}, async (request, reply) => {
  const username = request?.body?.username;
  const password = request?.body?.password;
  if (username === "admin" && password === "admin") {
    reply.code(200);
    return {
      token: "Bearer a1b2c3d4e5f6g7",
    };
  } else {
    reply.code(401);
    return {
      message: "Invalid credentials",
    };
  }
});

fastify.listen(4000, (err, address) => {
  if (err) throw err;
  // Server is now listening on ${address}
});
