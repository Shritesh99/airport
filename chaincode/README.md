# CHAINCODE

## Airport network chaincode db structure

As Hyperledger fabric stores data in states as in key-value pair (NOSQL Db). Airport Network's state's keys basically look like.

```
"Key": Buffer(Array of Data)
```

The DB is diveded into different keys values.

```
    STATE: [...ids...]
    ADDRESS: [...ids...],
    PERSON: [...ids...],
    LICENSE: [...ids...],
    REGIONALOFFICE: Object
```

These DB contains list of ids of objects.

#### Different DB Object schemas

-   **STATE**

```
    "state-{id}":
        {
            id: "uuidv4()", # string
            state: "...", # string
            country: "...", # string
        }
```

-   **ADDRESS**

```
    "address-{id}":
        {
            id: "uuidv4()", # string
            line1: "...", # string
            line2: "...", # string
            city: "..., # string
            state: "STATE.id", # string
            pinCode: ..., # int
        }

```
