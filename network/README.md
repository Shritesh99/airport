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
```

##### Steps to create network
1. Current dir
```
cd airport/network/
```
2. Generate crypto materials
```
~/fabric-samples/bin/cryptogen generate --config=./crypto-config.yaml --output="./crypto-config"
```
3. Generate genesis.block (first block)
```
~/fabric-samples/bin/configtxgen -profile SupplyOrdererGenesis -outputBlock ./channel-artifacts/genesis.block -channelID system-channel
```
4. Generate Channel.tx
```
~/fabric-samples/bin/configtxgen -profile SupplyChannel -channelID mychannel -outputCreateChannelTx ./channel-artifacts/channel.tx
```
5. Generate Anchor channel.tx
```
~/fabric-samples/bin/configtxgen -profile SupplyChannel -outputAnchorPeersUpdate ./channel-artifacts/DGCAOfficeMSPanchors.tx -channelID mychannel -asOrg DGCAOfficeMSP

~/fabric-samples/bin/configtxgen -profile SupplyChannel -outputAnchorPeersUpdate ./channel-artifacts/RegionalOfficeMSPanchors.tx -channelID mychannel -asOrg RegionalOfficeMSP
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

