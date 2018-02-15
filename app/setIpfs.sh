#!/bin/bash
cd ..
echo "Setting IPFS to $1"
clevis contract setIpfs Ipfs 0 $1
