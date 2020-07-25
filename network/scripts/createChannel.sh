#!/bin/bash
echo "Creating channel..."
# import utils
. scripts/envVar.sh

createChannel() {
	setGlobals 1
	# Poll in case the raft leader is not set yet
	peer channel create -o orderer.example.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx --outputBlock ./channel-artifacts/${CHANNEL_NAME}.block --tls --cafile $ORDERER_CA >&log.txt	
	cat log.txt
	echo
	echo "===================== Channel '$CHANNEL_NAME' created ===================== "
	echo
}

# queryCommitted ORG
joinChannel() {
    ORG=$1
    setGlobals $ORG
    peer channel join -b ./channel-artifacts/$CHANNEL_NAME.block >&log.txt
	cat log.txt
	echo
}

updateAnchorPeers() {
    ORG=$1
    setGlobals $ORG
	peer channel update -o orderer.example.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/${CORE_PEER_LOCALMSPID}anchors.tx --tls --cafile $ORDERER_CA >&log.txt
	cat log.txt
    echo "===================== Anchor peers updated for org '$CORE_PEER_LOCALMSPID' on channel '$CHANNEL_NAME' ===================== "
    echo
}

## Create channel
echo "Creating channel "$CHANNEL_NAME
createChannel

## Join all the peers to the channel
echo "Join Org1 peers to the channel..."
joinChannel 1
echo "Join Org2 peers to the channel..."
joinChannel 2

## Set the anchor peers for each org in the channel
echo "Updating anchor peers for org1..."
updateAnchorPeers 1
echo "Updating anchor peers for org2..."
updateAnchorPeers 2

echo
echo "========= Channel successfully joined =========== "
echo

exit 0