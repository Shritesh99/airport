# Airport License

Built on Hyperledger Fabric 2.2

### Directories Walkthrough

- **chaincode**: Chaincode specific code
- **network**: Network specific code
    - crypto-config Crypto Materials
- **server**: Appollo Graphql server

### Network definition
```
OrdererOrgs:
  - Name: Orderer # Operator service
    Domain: example.com

PeerOrgs:
  - Name: DGCAOFFICE # DGCA Office org
    Domain: dgcaoffice.example.com
    

  - Name: REGIONALOFFICE # Regional offices org
    Domain: regionaloffice.example.com
```

### Server Documentation
Check out Developer Documentation [here](https://github.com/Shritesh99/airport/tree/master/server)

### Chaincode docs (DB docs)
Check out Developer Documentation [here](https://github.com/Shritesh99/airport/tree/master/chaincode)

### Network docs
Check out Developer Documentation [here](https://github.com/Shritesh99/airport/tree/master/network)


### License
MIT