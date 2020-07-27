# NETWORK

### Airport network structure

```
OrdererOrgs:
  - Name: Orderer # Operator service
    Domain: example.com

PeerOrgs:
  - Name: DGCAOFFICE # DGCA Office org
    Domain: dgcaoffice.example.com


  - Name: REGIONALOFFICE1 # Regional offices org
    Domain: regionaloffice.example.com
    .
    .
    .
    Regional offices
```

##### Steps to create network

1. Current dir

```
cd airport/network/
```

2. Generate crypto materials

```
cryptogen generate --config=./crypto-config.yaml --output="./crypto-config"
```

3. Generate genesis.block (first block)

```
configtxgen -profile SupplyOrdererGenesis -outputBlock ./channel-artifacts/genesis.block -channelID system-channel
```

4. Generate Channel.tx

```
configtxgen -profile SupplyChannel -channelID mychannel -outputCreateChannelTx ./channel-artifacts/channel.tx
```

5. Generate Anchor channel.tx

```
configtxgen -profile SupplyChannel -outputAnchorPeersUpdate ./channel-artifacts/DGCAOfficeMSPanchors.tx -channelID mychannel -asOrg DGCAOfficeMSP

configtxgen -profile SupplyChannel -outputAnchorPeersUpdate ./channel-artifacts/RegionalOfficeMSPanchors.tx -channelID mychannel -asOrg RegionalOfficeMSP
```

6. **Fire up the network**

```
docker-compose -f docker-compose-cli.yaml up -d
```

7. Create channel

```
docker exec -it cli chmod +x ./scripts/createChannel.sh
docker exec -it cli ./scripts/createChannel.sh
```

8. Install ChainCode (Version: 1.0, 2.0, etc)

```
docker exec -it cli ./scripts/install-cc.sh 1.0
```

### To upgrade cc

Version: 1.0, 2.0, etc

```
docker exec -it cli ./scripts/install-cc.sh 2.0
```

### To restart Network

1. Go to fabric-samples

```
cd ~/fabric-samples/test-network/
```

2. Down the network

```
./network.sh down
```

3. Docker cleanup

```
docker volume prune
```

4. Docker cleanup

```
docker system prune
```

5. Change to airport dir

```
cd ~/BlockchainProjects/airport/network/
```

6. **Fire up the network**

```
docker-compose -f docker-compose-cli.yaml up -d
```

7. Create channel

```
docker exec -it cli chmod +x ./scripts/createChannel.sh
docker exec -it cli ./scripts/createChannel.sh
```

8. Install ChainCode (Version: 1.0, 2.0, etc)

```
docker exec -it cli ./scripts/install-cc.sh 1.0
```
