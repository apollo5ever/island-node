# island-node
Help make Private Islands more resilient and decentralized by running this node


Dependencies:
ipfs, mongodb

To start run:
sh start.sh

This will switch on ipfs, mongo, and the Private Islands server. The server checks the Private Islands contract for ipfs metadata, fetches that metadata and pins it to your ipfs node and add them to your mongoDB. 

When you visit https://winter-tooth-4565.on.fleek.co it will fetch metadata from your mongoDB.
