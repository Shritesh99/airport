#!/bin/bash
VERSION=$1

COMPOSE_PROJECT_NAME=net

DELAY=3
MAX_RETRY=5
VERBOSE=true

CC_RUNTIME_LANGUAGE=node
CC_SRC_PATH="/opt/gopath/src/github.com/chaincode"

PEER_CONN_PARMS="--peerAddresses peer0.dgcaoffice.example.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/dgcaoffice.example.com/peers/peer0.dgcaoffice.example.com/tls/ca.crt --peerAddresses peer0.regionaloffice.example.com:9051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/regionaloffice.example.com/peers/peer0.regionaloffice.example.com/tls/ca.crt"

# import utils
. scripts/envVar.sh

packageChaincode() {
    ORG=$1
    setGlobals $ORG
    set -x
    peer lifecycle chaincode package airport-${VERSION}.tar.gz --path ${CC_SRC_PATH} --lang ${CC_RUNTIME_LANGUAGE} --label airport-${VERSION} >&log.txt
    res=$?
    set +x
    cat log.txt
    echo "===================== Chaincode is packaged on peer0.${ORG} ===================== "
    echo
}

# installChaincode PEER ORG
installChaincode() {
    ORG=$1
    setGlobals $ORG
    set -x
    peer lifecycle chaincode install airport-${VERSION}.tar.gz >&log.txt
    res=$?
    set +x
    cat log.txt
    echo "===================== Chaincode is installed on peer0.${ORG} ===================== "
    echo
}

# queryInstalled PEER ORG
queryInstalled() {
    ORG=$1
    setGlobals $ORG
    set -x
    peer lifecycle chaincode queryinstalled >&log.txt
    res=$?
    set +x
    cat log.txt
    PACKAGE_ID=$(sed -n "/airport-${VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
    echo "===================== Query installed successful on peer0.${ORG} on channel ===================== "
    echo
}

# approveForMyOrg VERSION PEER ORG
approveForMyOrg() {
    ORG=$1
    setGlobals $ORG
    set -x
    PACKAGE_ID=$(sed -n "/airport-${VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
    peer lifecycle chaincode approveformyorg -o orderer.example.com:7050 --tls --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name chaincode --version ${VERSION} --init-required --package-id ${PACKAGE_ID} --sequence "${VERSION%%.*}" >&log.txt
    set +x
    cat log.txt
    echo "===================== Chaincode definition approved on peer0.${ORG} on channel '$CHANNEL_NAME' ===================== "
    echo
}

# checkCommitReadiness VERSION PEER ORG
checkCommitReadiness() {
    ORG=$1
    shift 1
    setGlobals $ORG
    echo "===================== Checking the commit readiness of the chaincode definition on peer0.${ORG} on channel '$CHANNEL_NAME'... ===================== "
	local rc=1
	local COUNTER=1
	# continue to poll
    # we either get a successful response, or reach MAX RETRY
	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
        echo "Attempting to check the commit readiness of the chaincode definition on peer0.org${ORG}, Retry after $DELAY seconds."
        set -x
        peer lifecycle chaincode checkcommitreadiness --channelID $CHANNEL_NAME --name chaincode --version ${VERSION} --sequence "${VERSION%%.*}" --output json --init-required >&log.txt
        res=$?
        set +x
        let rc=0
        for var in "$@"
        do
            grep "$var" log.txt &>/dev/null || let rc=1
        done
        COUNTER=$(expr $COUNTER + 1)
    done
    cat log.txt
    if test $rc -eq 0; then
        echo "===================== Checking the commit readiness of the chaincode definition successful on peer0.org${ORG} on channel '$CHANNEL_NAME' ===================== "
    else
        echo "!!!!!!!!!!!!!!! After $MAX_RETRY attempts, Check commit readiness result on peer0.${ORG} is INVALID !!!!!!!!!!!!!!!!"
        echo
        exit 1
    fi
}

# commitChaincodeDefinition VERSION PEER ORG (PEER ORG)...
commitChaincodeDefinition() {
    # while 'peer chaincode' command can get the orderer endpoint from the
    # peer (if join was successful), let's supply it directly as we know
    # it using the "-o" option
    set -x
    peer lifecycle chaincode commit -o orderer.example.com:7050 --tls --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name chaincode --version ${VERSION} --sequence "${VERSION%%.*}" $PEER_CONN_PARMS --init-required >&log.txt
    res=$?
    set +x
    cat log.txt
    echo "===================== Chaincode definition committed on channel '$CHANNEL_NAME' ===================== "
    echo
}

# queryCommitted ORG
queryCommitted() {
    ORG=$1
    setGlobals $ORG
    EXPECTED_RESULT="Version: ${VERSION}, Sequence: "${VERSION%%.*}", Endorsement Plugin: escc, Validation Plugin: vscc"
    echo "===================== Querying chaincode definition on peer0.${ORG} on channel '$CHANNEL_NAME'... ===================== "
	local rc=1
	local COUNTER=1
	# continue to poll
    # we either get a successful response, or reach MAX RETRY
	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
    echo "Attempting to Query committed status on peer0.org${ORG}, Retry after $DELAY seconds."
    set -x
    peer lifecycle chaincode querycommitted --channelID $CHANNEL_NAME --name chaincode --cafile $ORDERER_CA >&log.txt
    res=$?
    set +x
		test $res -eq 0 && VALUE=$(cat log.txt | grep -o '^Version: [0-9], Sequence: [0-9], Endorsement Plugin: escc, Validation Plugin: vscc')
    test "$VALUE" = "$EXPECTED_RESULT" && let rc=0
		COUNTER=$(expr $COUNTER + 1)
	done
    echo
    cat log.txt
    if test $rc -eq 0; then
        echo "===================== Query chaincode definition successful on peer0.${ORG} on channel '$CHANNEL_NAME' ===================== "
            echo
    else
        echo "!!!!!!!!!!!!!!! After $MAX_RETRY attempts, Query chaincode definition result on peer0.${ORG} is INVALID !!!!!!!!!!!!!!!!"
        echo
        exit 1
    fi
}

chaincodeInvokeInit() {
    # while 'peer chaincode' command can get the orderer endpoint from the
    # peer (if join was successful), let's supply it directly as we know
    # it using the "-o" option
    set -x
    peer chaincode invoke -o orderer.example.com:7050 --tls --cafile $ORDERER_CA -C $CHANNEL_NAME $PEER_CONN_PARMS -n chaincode --isInit -c '{"function":"initLedger","Args":[]}' >&log.txt
    res=$?
    set +x
    cat log.txt
    echo "===================== Invoke transaction successful on $PEERS on channel '$CHANNEL_NAME' ===================== "
    echo
}

## at first we package the chaincode
packageChaincode 1

## Install chaincode on peer0.org1 and peer0.org2
echo "Installing chaincode on peer0.org1..."
installChaincode 1
echo "Install chaincode on peer0.org2..."
installChaincode 2

# ## query whether the chaincode is installed
queryInstalled 1

# ## approve the definition for org1
approveForMyOrg 1

# ## check whether the chaincode definition is ready to be committed
# ## expect org1 to have approved and org2 not to
checkCommitReadiness 1
checkCommitReadiness 2

# ## query whether the chaincode is installed
queryInstalled 2

# ## now approve also for org2
approveForMyOrg 2

# ## check whether the chaincode definition is ready to be committed
# ## expect them both to have approved
checkCommitReadiness 1
checkCommitReadiness 2

# ## now that we know for sure both orgs have approved, commit the definition
commitChaincodeDefinition

# ## query on both orgs to see that the definition committed successfully
queryCommitted 1
queryCommitted 2

## Invoke the chaincode
# chaincodeInvokeInit

exit 0