import { Application } from "jsr:@oak/oak/application";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import connectDB  from "./database.ts";
import questionsRouter from "./api/routes/questions.ts";
import categoriesRouter from "./api/routes/categories.ts";
import gameRouter from "./api/routes/game.ts";
import seedData from "./seed.ts";
import { Router, RouterContext } from "oak/router";
// Load environment variables
await import("./env.ts");

const app = new Application();
const port = Number(Deno.env.get("PORT")) || 3001;

// Middleware
app.use(oakCors());

// Connect to database
try {
  await connectDB();
  console.log('Connected to MongoDB');
} catch (error) {
  console.error('Failed to connect to MongoDB:', error);
}

// Routes
const appRouter = new Router();
appRouter.get('/', (ctx: RouterContext<"/">) => {
  ctx.response.body = 'Hello World';
});
app.use(appRouter.routes());
app.use(appRouter.allowedMethods());
app.use(questionsRouter.routes());
app.use(questionsRouter.allowedMethods());
app.use(categoriesRouter.routes());
app.use(categoriesRouter.allowedMethods());
app.use(gameRouter.routes());
app.use(gameRouter.allowedMethods());
// Error handling middleware
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error(err);
    ctx.response.status = 500;
    ctx.response.body = { error: 'Something broke!' };
  }
});

// seedData();
console.log(`Server is running on port ${port}`);
await app.listen({ port });