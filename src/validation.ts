import { Elysia, t } from "elysia";
import { openapi } from "@elysiajs/openapi";

const app = new Elysia()
  .use(openapi())

  // afterHandle untuk praktikum 6
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
    return response;
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
        id: t.Number()
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

  // Praktikum 7: Endpoint login dengan validasi
  .post(
    "/login",
    ({ body }) => ({
      success: true,
      message: "Login berhasil",
      data: body
    }),
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 8 })
      }),
      response: t.Object({
        success: t.Boolean(),
        message: t.String(),
        data: t.Object({
          email: t.String(),
          password: t.String()
        })
      })
    }
  )

  // Hook onError untuk menangani error
  .onError(({ code, error, set }) => {
    if (code === "VALIDATION") {
      set.status = 400;
      return {
        success: false,
        error: "Validation Error"
      };
    }

    if (code === "NOT_FOUND") {
      set.status = 404;
      return {
        success: false,
        error: "Route not found"
      };
    }

    set.status = 500;
    return {
      success: false,
      error: "Internal Server Error"
    };
  })

  .listen(3000);

console.log("🦊 Elysia is running at http://localhost:3000");
