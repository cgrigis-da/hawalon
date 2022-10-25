#!/usr/bin/env bash

cd ~/Canton/canton-enterprise-2.3.2
./bin/canton --config examples/01-simple-topology/simple-topology.conf --auto-connect-local
