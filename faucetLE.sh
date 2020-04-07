#!/bin/bash
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get install certbot
sudo certbot certonly --standalone -d faucet.galleass.io
sudo cp /etc/letsencrypt/live/faucet.galleass.io/fullchain.pem . -f
cp /etc/letsencrypt/live/faucet.galleass.io/privkey.pem . -f
cp /etc/letsencrypt/live/faucet.galleass.io/cert.pem . -f
