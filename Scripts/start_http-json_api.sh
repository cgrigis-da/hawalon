#!/usr/bin/env bash

base_dir=$(realpath $(dirname $0)/..)

cd ${base_dir}
daml json-api --ledger-host localhost --ledger-port 5011 --http-port 7575 --allow-insecure-tokens
