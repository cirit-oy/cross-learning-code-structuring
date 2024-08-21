# Structuring code in serverless applications

## Introduction

- name, company
- experience
- cross learning
- what we are going to talk about and why
  - code structuring (or the lack of it) is a common issue

## Problem

- in monolithic software projects in order to maintain any sense of cohesion and maintainability, structuring code is mandatory
  - breaking the system in smaller parts (services, modules, etc...)
  - utility libraries

- in serverless projects however, especially with microservice architecture, the some structure comes naturally with microservice and lambda boundaries
-> in almost all serverless projects (in my experience) developers tend to lean too much on microservice/lambda boundaries to act as the sole code structure while almost no other common rules or structuring are enforced

-> in larger projects this can lead to
  - splintered and hard to maintain codebase even inside one microservice
  - lot of duplication
  - in other words: difficult to understand, expensive to make changes

### Sharing is caring

- even if the project consists of small well defined microservices, where the size of the codebase of each of the microservices would not mandate well defined code structure in itself (rare!), structuring the code so that commonly used logic can be separated easily into shareable modules can help avoiding code duplication across the whole application
- examples of things implemented in most of microservices:
  - db-boilerplate
  - external service accessors (e.g. other microservices in the project and third party APIs)
  - input validation
  - common error handling logic

### Size matters

- even if starting small, microservices tend to grow in size and complexity as time goes on and new features are added
- sometimes bigger microservices (which I like to call microliths) can be even preferrable from the get-go, since communication between isolated microservices is complex:
      - transactions spanning multiple microservices are difficult (orhcestration, sagas, rollbacks)
      - even if no hard dependencies between microservices (e.g. event based communication, which can be very complex in itself), making changes to one microservice can ripple to many others
      -> given the organizational structure permits such a thing, it makes sense to collect functionality that would otherwise incur a lot of calls between microservices into a larger microlith

- either way (by organical growth or by design), when the microservice codebase gets bigger the need for a defined structure gets more obvious

## Enough is enough

- structuring code has also its costs, and enforcing and sticking by the rules adds mental load for developers (and sometimes even resistance)
  - sometimes its okay to go simple if the scope of the microservice is known to never go too big

## One tried and true solution for structuring code in a complex serverless environment, step by step

Lets have a look at a concrete example on one possible way of structuring code in a serverless project. (As you know there are countless of ways to structure projects)

The aim is to try to demonstrate how we have concrete improvements in our app by adopting different levels of code structuring.

This has been tried and true in an ongoing serverless project with a complex domain and serverless microlith architecture

The example for this demo is almost pseudocode, focus should be on the structural changes, not the details

It is also quite small and barebones but let's hope it is enough to depict the benefits from code structuring

All the steps are self contained, and may be used independently. Not all projects require every step, some times too much structure can bring more overhead than necessary

### Starting point

- show handlers, go through what kind of operations they contain
  - transport layer stuff like status codes and event handling
  - calls to other microservices
  - db calls
  - calls to external api's
  - business logic

- simple and not too convoluted
- BUT: handler does many things, tests need to test a lot of stuff (single responsibility violation)
- assuming we have a lot of similar handlers in our microservice, consider following:
  - the obvious one but not so common: change external service, db, etc
  - microservice access changed, for example authenticate with IAM instead of API token
  - forgot to add pagination for dynamodb query, need to change everywhere
  - all tests in all of these cases would need to be updated

### Step 1 - isolating external services

- probably the most no brainer step with big benefits and not too much overhead

- isolate all functonality that calls any external service:
  - db calls
  - microservice calls
  - external api calls

- we can have multiple levels of abstraction, e.g. isolate http-lib, then create modules for each individual service using the http lib Same with db-driver/lib and individual repositories

- most of the time at least using the db/repository has been proven to be worth it.

Biggest pros:

- reusability (apis predefined, same accross all microservices)
- readability, single responsibility
- testing easier, not every test needs to mock db driver or http lib

### Step 2 - Separation of handler and application layer

- can keep transport layer stuff in handler, usecase flow management in application layer

- can test separately what handler needs to return, and what the usecase needs to do

- can easily re-use already defined usecases in other usecases as well

- can easily serve usecases via some other ways (e.g. events, cli, scripts)

### Step 3 Isolating business logic / domain

- defining what is business logic / domain can be tricky

- having business logic isolated can make intent more clear, easier to make test cases, more resilient to changes from outer layers

### Step 4 Unidirectional dependencies with dependency inversion / dependency injection

- most intesive of the steps, can add quite bit of overhead

- also quite difficult to explain in short amount of time, bear with me :D

- Since we now have 3 layers (external/application/domain), in order to make our inner layers are shielded as much as possible from the changes in the more volatile outer layers, we can start enforcing a rule that  each layer must have no direct dependency to outer layers

- e.g. no direct imports into external layer from application layer

- use interfaces, import them instead. Implementation adheres to the interface. Dependency only to the interface, not the implementation

- in addition of shielding inner layers, improves DX since developers can start working on the service-layer, and only define interfaces for the outer layers and implement later

- makes testing really easy since no mocking required, only inject dependencies

- in practice, can use di-libraries (almost if not all of them class based in TS/JS), or homebaked factory function pattern (which is demoed)

- requires experimenting, can take time to find what suits the project the best

### Final words

- some might have noticed that there is a name for the pattern with all of the steps combined, hexagonal architecure

- Enforcing a project wide code structure can be valuable.

- The level of structuring depends on the project. Too much structure can add a lot of overhead and mental load. Too little structure hurts maintainability and cohesion.