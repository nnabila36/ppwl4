import { Elysia } from "elysia"
import { openapi } from "@elysiajs/openapi";


const app = new Elysia()
.use(openapi())

// Global Logger
app.onRequest(({ request }) => {
 console.log("📥", request.method, request.url)
 console.log("🕒", new Date().toISOString())
})

app.onRequest(({ request, set }) => {
  if (request.headers.get("x-block") === "true") {
    set.status = 403
    return { message: "Blocked" }
  }
})

app.get("/", () => "Hello Middleware")
app.get("/hello", () => {return "helllo global logger"})

app.get(
 "/dashboard",
 () => ({
   message: "Welcome to Dashboard"
 }),
 {
   beforeHandle({ headers, set }) {
     if (!headers.authorization) {
       set.status = 401
       return {
         success: false,
         message: "Unauthorized"
       }
     }
   }
 }
)

app.get(
 "/admin",
 () => ({
   message: "Welcome to Dashboard"
 }),
 {
   beforeHandle({ headers, set }) {
     if (!headers.authorization) {
       set.status = 401
       return {
         success: false,
         message: "Unauthorized"
       }
     }
   }
 }
)

app.get("/profile", () => ({
 name: "Billa"
}))

app.onAfterHandle(({ response }) => {
 return {
   success: true,
   data: response
 }
})

app.get("/product", () => ({ id: 1, name: "Laptop"}))

app.listen(3000)
console.log("Server running at http://localhost:3000")
