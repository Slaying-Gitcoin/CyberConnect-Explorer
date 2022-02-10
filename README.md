# CyberConnect Explorer

[Explore](https://cyberconnect-explorer.vercel.app) CyberConnect's decentralized social graph protocol!
Built for Schelling Point virtual [Gitcoin hackathon](https://gitcoin.co/issue/cyberconnecthq/explorer-and-cyberconnected-dapps/1/100027517) 

[![cyberlab](https://s10.gifyu.com/images/image0b51f6a34d170380.png)](https://gifyu.com/image/Szqto)
[![wearehiring](https://s10.gifyu.com/images/image32e65ee6c8723c56.png)](https://gifyu.com/image/Szqrn)

## Features

- Search by address or ENS
- WebGL rendered social graph with +200 nodes
- Nodes are scaled according to importance
- Etherscan labelcloud labels on transactions
- Side panel with the selected user's socials and ether balance displayed

## How we calculate node importance

Since some users have thousands of followers and transactions we need to sort those connections according to their importance

### Graph display priorities

We display a user's node in this order, this means that if you send money to bob and he is your friend than his node will be displayed at the friends section with the aggregated transaction value:
- Friend
- Following
- Follower
- Transactions

### Transactions

We query the selected user's last 10000 transactions and aggregate(if bob sent you 1 eth and you sent him back 20 ETH than that equals -19 ETH aggregated transaction to bob) transactions that were from/to the same address. Then we select the 50 largest ones to display. The more realtive aggregated value the bigger the node.

### CyberConnect Users

A user's importance is determined according to this model(higher in the list = more important):
- Aggregated transaction volume
- Profile picture
- ENS domain

## Tech Stack

- NodeJS 16
- React
- Next.js
- Sigma.js
- Etherscan api
- CyberConnect api
- Postgres
- Vercel
- Graphology [(Custom fork)](https://github.com/Slaying-Gitcoin/graphology)
- React Sigma v2 [(Custom fork)](https://github.com/Slaying-Gitcoin/react-sigma-v2)

## How did we manage mapping between addresses and labels
We created a remote Posgresql database for getting labels for a specific address. This project uses [this repository](https://github.com/Slaying-Gitcoin/blockchain-address-database) for creating the database. It's obtained by page scraping & API-querying etherscan's labelcloud. For each address it has some subset of [name tag, labels, ownership entity]. It page scraped each labelcloud (i.e. etherscan.io/labelcloud) for all labels, and then got all the addresses for each labels with their name tags.

## How to get running

1. Make sure to get an Etherscan api key and set it in the .env file.
2. Build & deploy the labelcloud database
3. Install dependencies and start the web server :D

```
yarn; yarn dev
```

## Disclaimer

- This is just a prototype and shouldn't be used in a production environment
- Currently the mobile experience sucks, you can't click on nodes and the graph is very laggy. This can be improved with some time but requires modifying Sigma.js
- Under heavy traffic this site will break because we are using a free Etherscan api key and that limits the amount of requests the webserver can send


