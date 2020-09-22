FROM ethereum/solc:0.6.10 as build-deps

FROM node:13
COPY --from=build-deps /usr/bin/solc /usr/bin/solc
