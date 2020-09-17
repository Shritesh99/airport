# Airport License

Built on Hyperledger Fabric 2.2

### Abstract
A web based application using Blockchain technology is sought from Airport Licensing to retrieve important and relevant Project Related information from pool of data source i.e. SAP, E-mail, E-office, Scan documents and Database. Below features are desired in an application: 

- Concerned Officers can upload relevant data related to Airport Licensing from Airports. 
- Seamless Approval process, Centralized Monitoring and Suggestion Mechanism. 
- Relevant information should be fetched from data source, linked to a particular project which can be used in the hour of need.

**Check out the entire presentation from [here](https://bit.ly/3fAnjeA)**

**Check out the video from [here](https://drive.google.com/file/d/1gLuQTiAaS8mhC3pmVI9g24RAh1nJ-VPf/view?usp=sharing)**
<h1 align="center">
<br>
<img src="https://github.com/Shritesh99/airport/blob/master/ss/ss.png" />
</h1>




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
