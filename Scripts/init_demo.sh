#!/usr/bin/env bash

base_dir=$(realpath $(dirname $0)/..)

cd ${base_dir}
daml script --dar .daml/dist/hawalon-0.1.0.dar --script-name Setup:setup --ledger-host localhost --ledger-port 5011
