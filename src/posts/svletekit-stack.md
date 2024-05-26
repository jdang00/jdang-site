---
title: SvelteKit - The Full-Stack Framework for Svelte
description: Discover how SvelteKit extends Svelte to full-stack development.
date: '2024-05-29'
categories:
  - javascript
  - svelte
  - sveltekit
  - web
published: true
---

## Introduction

SvelteKit is the official framework for building full-stack applications with Svelte. It offers a powerful and flexible way to create modern web applications.

## Features

- **File-based Routing:** Automatically creates routes based on your file structure.
- **Server-side Rendering (SSR):** Improves performance and SEO by rendering pages on the server.
- **API Routes:** Easily create backend endpoints alongside your frontend code.
- **Static Site Generation (SSG):** Generate static sites for better performance and lower costs.

## Getting Started

To create a new SvelteKit project, use the following commands:

```bash
npm init svelte@next my-app
cd my-app
npm install
npm run dev
```

## Example

Create a simple route:

```javascript
<script>
  export let name;
</script>

<h1>Hello {name}!</h1>
```

Create a file `src/routes/[name].svelte` and navigate to `/your-name` to see the result.

## Conclusion

SvelteKit extends the capabilities of Svelte to full-stack development, providing powerful tools for building modern web applications.
