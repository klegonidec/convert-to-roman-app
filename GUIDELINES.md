# Guidelines

- Be framework-less for node application : No Express, No Sails, just vanilla Node.js for exposing the web application 
- Having Typescript support all the way
- Provides a good Developer Experience. Hoping in this project must be a breeze
- Develops the whole thing in around 4 hours

# Architecture

- The project is spliting responsabilities across 4 folders
``` text
src/
    api/
        Adapters between Hosting and Domain
    hosting/
        Expose the Web Application, both apis and static files 
    number-roman-converter/
        Core Domain library, knowing how to convert numbers
    public/
        Represents the front-end application 
    app.ts
        Entry point                  

```

# Testing

- Being time-gated, only the developement of domain lib `number-roman-converter` was Test Driven
- The Jest library was used to ease developments of those tests


# Limitation

Current integration of TypeScript in limited for the Front-end, since it use the same configuration as the node web application.
It will be enough for now, but will need a rework to use its own tsconfig for more advanced usage.

Current implementation in Front-End is dependent of the `fetch` Javascript API, [which is not usable in some browser](https://caniuse.com/fetch)