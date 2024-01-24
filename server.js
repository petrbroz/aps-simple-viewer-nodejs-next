import * as path from "node:path";
import { fastify } from "fastify";
import { fastifyStatic } from "@fastify/static";
import { fastifyMultipart } from "@fastify/multipart";
import { getAccessToken, listObjects, uploadObject, translateObject, urnify } from "./aps.js";
import { PORT } from "./config.js";

const server = fastify({ logger: true });
server.register(fastifyStatic, {
    root: path.join(import.meta.dirname, "wwwroot")
}); // import.meta.dirname requires Node.js v20 or newer
server.register(fastifyMultipart, {
    attachFieldsToBody: true,
    limits: { fileSize: Infinity }
});
server.get("/token", async (request, reply) => getAccessToken());
server.get("/models", async (request, reply) => {
    const objects = await listObjects();
    return objects.map(obj => ({
        name: obj.objectKey,
        urn: urnify(obj.objectId)
    }));
});
server.post("/models", async (request, reply) => {
    const field = request.body["model-file"];
    if (!field) {
        throw new Error("The required field 'model-file' is missing.");
    }
    const buffer = await field.toBuffer();
    const obj = await uploadObject(field.filename, buffer);
    const urn = urnify(obj.objectId);
    await translateObject(urn, request.body['model-zip-entrypoint']);
    return {
        name: field.filename,
        urn: urn
    };
});

try {
    await server.listen({ port: PORT });
} catch (err) {
    console.error(err);
    process.exit(1);
}