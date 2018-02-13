nuxt-auth-routes-on-express

> Nuxt auth-routes example ported to express server run universal Nuxt app

## Instructions for use

* Copy `.env.example` in the docroot to `.env` and enter a fully qualified domain name or IP for the express api server (which in this case is the same server that is serving up Nuxt itself).
    * 'localhost' or '0.0.0.0' didn't work for me
* Then the standard Nuxt commands work as usual
* Please read the third section where I explain how this app was created.

## Build Setup

``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).

## How this app was made

Having discovered [create-nuxt-app](https://github.com/nuxt-community/create-nuxt-app) I was anxious to try out the great flexibility and power offered there. So my objective was:

* Use create-nuxt-app to generate an independent express app (in the `./server` directory) which actually sets up a series of independent api routes which operate outside of nuxt, and which will then bring up the nuxt app itself.
* Port the [Nuxt.js auth-routes example](https://github.com/nuxt/nuxt.js/tree/dev/examples/auth-routes) to this new setup. Not as ServerMiddleware on the usual Nuxt stack, but rather connecting to an express server which for all intents and purposes is external and independent and capable of doing all kinds of things.
* The endpoints should be reachable from the regular Nuxt universal app, and also externally, via curl or Postman.

Steps taken:

```
vk@example:~/nuxt/try-stuff$ create-nuxt-app nuxt-auth-routes-on-express
> Generating Nuxt.js project in /home/vk/nuxt/try-stuff/nuxt-auth-routes-on-express
? Project name nuxt-auth-routes-on-express
? Project description My beautiful Nuxt.js project
? Use a custom server framework express
? Use a custom UI framework vuetify
? Choose rendering mode Universal
? Use axios module yes
? Use eslint yes
? Author name (victorkane)
? Choose a package manager npm
Initialized empty Git repository in /home/vk/nuxt/try-stuff/nuxt-auth-routes-on-express/.git/
added 1303 packages in 58.553s

  To get started:

    cd nuxt-auth-routes-on-express
    npm run dev

  To build & start for production:

    cd nuxt-auth-routes-on-express
    npm run build
    npm start

vk@example:~/nuxt/try-stuff$
```

Interesting to see how the `package.json` scripts section changes from what we are used to. The `npm run dev` actually executes:

```
"dev": "cross-env NODE_ENV=development nodemon server/index.js --watch server",
```

I then proceeded as follows:

* package.json
    * same dependencies (express, body-parser, express-session, nuxt) except we are using the nuxt axios module and they are using the npm dependency. Also we have vuetify.
* nuxt-config
    * no servermiddleware or anything, since express is in control anyway (is that right?)
* express code
    * in their's, it's in the ServerMiddleware, in ours it's under the server directory, no need for declaration as ServerMiddleware cuz it runs Nuxt and not the inverse.
    * for the same reason, ours is not a module and need not export any variables for ServerMiddleware
    * they have this req, res transformation thingie
    * we add in express-session options in the code
* middleware: auth.js (copy as is)
* store (copy as is, but adjust for $axios mod
* pages
    * index.vue merged in
    * secret.vue copied in 

The end result works. First of all, curl can be used right from the command line to access the login API, as if it were an entirely separate express server app, which, actually, it is:

```
curl --request POST \
  --url http://localhost:4300/api/login \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --data '{
    "username": "victorkane",
    "email": "victorkane@linguathon.com",
    "password": "password"
}'
{"data":{"username":"victorkane"}}

curl --request POST \
  --url http://localhost:4300/api/login \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --data '{
    "username": "demo",
    "email": "victorkane@linguathon.com",
    "password": "demo"
}'
```

And the app works as advertised:

* From the Vuetify Welcome page, fill in the form with "demo" + "demo"
* Works like the original [auth-routes example](https://nuxtjs.org/examples/auth-routes) and [demo](https://nuxt-auth-routes.gomix.me/). You can even refresh the browser and you're still logged in.

Please send any (welcome) feedback in the [issue queue](https://github.com/victorkane/nuxt-auth-routes-on-express/issues).
