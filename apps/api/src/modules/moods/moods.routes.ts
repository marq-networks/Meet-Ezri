import { FastifyInstance } from "fastify";
import { createMoodHandler, getMyMoodsHandler, getAllMoodsHandler } from "./moods.controller";
import { createMoodSchema } from "./moods.schema";

export async function moodRoutes(app: FastifyInstance) {
  app.post(
    "/",
    {
      schema: {
        body: createMoodSchema,
        tags: ["Moods"],
      },
      preHandler: [app.authenticate],
    },
    createMoodHandler
  );

  app.get(
    "/",
    {
      schema: {
        tags: ["Moods"],
      },
      preHandler: [app.authenticate],
    },
    getMyMoodsHandler
  );
  
  app.get(
    "/admin",
    {
       schema: {
        tags: ["Moods", "Admin"],
      },
      preHandler: [app.authenticate, app.authorize(['super_admin', 'org_admin', 'team_admin'])],
    },
    getAllMoodsHandler
  );
}
