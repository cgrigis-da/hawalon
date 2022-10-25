#!/usr/bin/env bash

base_dir=$(realpath $(dirname $0)/..)
ledger_user=${1:-henry}

cd ${base_dir}
daml trigger --dar .daml/dist/hawalon-0.1.0.dar --trigger-name HawalarBot:autoForward --ledger-host localhost --ledger-port 5011 --ledger-user "${ledger_user}"
