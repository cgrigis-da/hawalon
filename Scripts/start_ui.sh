#!/usr/bin/env bash

base_dir=$(realpath $(dirname $0)/..)

cd ${base_dir}/ui
REACT_APP_LEDGER_ID=participant1 npm start
