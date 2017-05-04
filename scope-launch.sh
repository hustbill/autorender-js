#!/bin/sh

sudo curl -L git.io/scope -o /usr/local/bin/scope
sudo chmod a+x /usr/local/bin/scope
sudo scope launch 192.168.56.101 192.168.56.102
