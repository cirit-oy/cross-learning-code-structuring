# Structuring code in serverless applications

## Introduction

## Problem

- with monoliths common coding structure is practically mandatory

- with serverless apps (especially microservice architecture), some structure comes naturally with microservice and lambda boundaries

- with large projects and when time goes on, this might not be enough

## Sharing is caring

- even with well defined small microservices, code structure is beneficial for sharing common boilerplate between micoservices

## Size matters

- microservices tend to grow in size as time goes on

- sometimes bigger microservices (microliths) are even preferred

- the bigger/more complex, the more we need structure inside the microservices

## Enough is enough

- adding too much structure and rules add overhead and mental load

## Demo: a solution for structuring code, divided into self contained steps

- starting point

- step 1: isolating external services

- step 2: separating handlers and application layer

- step 3: isolating business logic

- step 4: unidirectional dependencies between layers

## Conclusion