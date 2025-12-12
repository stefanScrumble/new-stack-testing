# Introduction
Laravel Wayfinder bridges your Laravel backend and TypeScript frontend with zero friction. It automatically generates fully-typed, importable TypeScript functions for your controllers and routes — so you can call your Laravel endpoints directly in your client code just like any other function. No more hardcoding URLs, guessing route parameters, or syncing backend changes manually.

# Genrating typescript definitions
php artisan wayfinder:generate

# Usage
Wayfinder functions return an object that contains the resolved URL and default HTTP method:

import { show } from "@/actions/App/Http/Controllers/PostController";

show(1); // { url: "/posts/1", method: "get" }
If you just need the URL, or would like to choose a method from the HTTP methods defined on the server, you can invoke additional methods on the Wayfinder generated function:

import { show } from "@/actions/App/Http/Controllers/PostController";

show.url(1); // "/posts/1"
show.head(1); // { url: "/posts/1", method: "head" }
## Wayfinder functions accept a variety of shapes for their arguments:

import { show, update } from "@/actions/App/Http/Controllers/PostController";

// Single parameter action...
show(1);
show({ id: 1 });

// Multiple parameter action...
update([1, 2]);
update({ post: 1, author: 2 });
update({ post: { id: 1 }, author: { id: 2 } });

## Invokable Controllers
If your controller is an invokable controller, you may simply invoke the imported Wayfinder function directly:

import StorePostController from "@/actions/App/Http/Controllers/StorePostController";

StorePostController();
Importing Controllers
## You may also import the Wayfinder generated controller definition and invoke its individual methods on the imported object:

import PostController from "@/actions/App/Http/Controllers/PostController";

PostController.show(1);
Note

In the example above, importing the entire controller prevents the PostController from being tree-shaken, so all PostController actions will be included in your final bundle.

Importing Named Routes
Wayfinder can also generate methods for your application's named routes as well:

import { show } from "@/routes/post";

// Named route is `post.show`...
show(1); // { url: "/posts/1", method: "get" }

# Wayfinder and Inertia
When using Inertia, you can pass the result of a Wayfinder method directly to the submit method of useForm, it will automatically resolve the correct URL and method:

https://inertiajs.com/forms#wayfinder

import { useForm } from "@inertiajs/react";
import { store } from "@/actions/App/Http/Controllers/PostController";

const form = useForm({
name: "My Big Post",
});

form.submit(store()); // Will POST to `/posts`...
You may also use Wayfinder in conjunction with Inertia's Link component:

https://inertiajs.com/links#wayfinder

import { Link } from "@inertiajs/react";
import { show } from "@/actions/App/Http/Controllers/PostController";

const Nav = () => <Link href={show(1)}>Show me the first post</Link>;
