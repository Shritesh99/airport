# CHAINCODE

## Airport network chaincode db structure

As Hyperledger fabric stores data in states as in key-value pair (NOSQL Db). Airport Network's state's keys basically look like.
```
"Key": Buffer(Array of Data)
```

#### Different keys

- **STATE**
```
    "state": [
        ...
            {
                id: "uuidv4()", # string
                state: "...", # string
                country: "...", # string
            }
        ...     
    ]
```
- **ADDRESS**  
```
    "address": [
        ...
            {
                id: "uuidv4()", # string
                line1: "...", # string
                line2: "...", # string
                city: "..., # string
                state: "STATE.id", # string
                pinCode: ..., # int
            }
        ...     
    ]
```
