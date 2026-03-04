import { Elysia, t } from "elysia";
import { openapi } from "@elysiajs/openapi";

const app = new Elysia()
  .use(openapi())

  .onAfterHandle(({ response }) => {
    if (
      typeof response === "object" &&
      response !== null &&
      "id" in response &&
      "name" in response
    ) {
      return {
        success: true,
        message: "data tersedia",
        data: response
      };
    }
    return response; // penting supaya tidak undefined
  })

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

  .get(
    "/products/:id",
    ({ params, query }) => ({
      success: true,
      productId: Number(params.id),
      sort: query.sort ?? "asc"
    }),
    {
      params: t.Object({
        id: t.Number() // ganti dari t.Numeric()
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

  .get(
    "/stats",
    () => ({
      total: 100,
      active: 80
    }),
    {
      response: t.Object({
        total: t.Number(),
        active: t.Number()
      })
    }
  )

  .get(
    "/admin",
    () => ({
      stats: 99
    }),
    {
      beforeHandle({ headers, set }) {
        if (headers.authorization !== "Bearer 123") {
          set.status = 401;
          return {
            success: false,
            message: "Unauthorized"
          };
        }
      },
      response: {
        200: t.Object({
          stats: t.Number()
        }),
        401: t.Object({
          success: t.Boolean(),
          message: t.String()
        })
      }
    }
  )

  .get(
    "/product",
    () => ({
      success: true,
      message: "OK",
      data: {
        id: 1,
        name: "Laptop"
      }
    }),
    {
      response: t.Object({
        success: t.Boolean(),
        message: t.String(),
        data: t.Object({
          id: t.Number(),
          name: t.String()
        })
      })
    }
  )

  .listen(3000);

console.log("🦊 Elysia is running at http://localhost:3000");
