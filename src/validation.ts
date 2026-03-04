import { Elysia, t } from "elysia";
import { openapi } from "@elysiajs/openapi";

const app = new Elysia()
  .use(openapi())

  // ==============================
  // PRAKTIKUM 1 - VALIDASI BODY
  // ==============================
  .post(
    "/request",
    ({ body }) => ({
      message: "Success",
      data: body
    }),
    {
      body: t.Object({
        name: t.String({ minLength: 3 }),
        email: t.String({ format: "email" }),
        age: t.Number({ minimum: 18 })
      }),
      response: t.Object({
        message: t.String(),
        data: t.Object({
          name: t.String(),
          email: t.String(),
          age: t.Number()
        })
      })
    }
  )

  // ==============================
  // PRAKTIKUM 2 - PARAMS & QUERY
  // ==============================
  .get(
    "/products/:id",
    ({ params, query }) => {
      return {
        success: true,
        productId: Number(params.id),
        sort: query.sort ?? "asc"
      };
    },
    {
      params: t.Object({
        id: t.Numeric()
      }),
      query: t.Object({
        sort: t.Optional(
          t.Union([t.Literal("asc"), t.Literal("desc")])
        )
      }),
      response: t.Object({
        success: t.Boolean(),
        productId: t.Number(),
        sort: t.String()
      })
    }
  )

  // ==============================
  // PRAKTIKUM 3 - VALIDASI RESPONSE
  // ==============================
  .get(
    "/stats",
    () => {
      return {
        total: 100,
        active: 80
      };
    },
    {
      response: t.Object({
        total: t.Number(),
        active: t.Number()
      })
    }
  )

  .listen(3000);

console.log("🦊 Elysia is running at http://localhost:3000");