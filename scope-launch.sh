#!/bin/sh

sudo curl -L git.io/scope -o /usr/local/bin/scope
sudo chmod a+x /usr/local/bin/scope
sudo scope launch 10.145.240.137 10.145.240.104
