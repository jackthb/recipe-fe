#!/bin/bash

mkdir -p ./output/prod/ ./output/dev/

prod_req="./output/prod/requirements.txt"
dev_req="./output/dev/requirements.txt"
licenses="./output/licenses.txt"

req_py=$(find . -name "requirements.txt")
req_dev_py=$(find . -name "requirements-dev.txt")
req_pnpm=$(find . -name "pnpm-lock.yaml" -not -path "./node_modules/*")

echo -e "\nRunning Licenses pre-commit\n"

if [[ -n "$req_py" ]]; then
    pip-licenses --version &>/dev/null
    [[ $? -ne 0 ]] && echo "pip-licenses package not found please run: pip install pip-licenses" && rm -rf ./output/ && exit 1
    pip-licenses | grep 'GPL\|GPLv2\|GPLv3\|Artistic\|MPL\|ASL\|GNU\|Eclipse\|CNRI' | grep -v 'Lesser' | awk '{print tolower($0)}' > "$licenses"
    [[ -f $req_py ]] && cat $req_py | grep '^[a-zA-Z].*=[^=]*$' | cut -d= -f1 > "$prod_req"
    result=$(awk 'NR==FNR{words[$0]=1;next} $1 in words' "$prod_req" "$licenses")
    [[ -n "$result" ]] && echo "Processing requirements.txt. The following packages are not allowed due to their licenses:\n $result"
fi
if [[ -n "$req_dev_py" ]]; then
    [[ -f $req_dev_py ]] && cat $req_dev_py | grep '^[a-zA-Z].*=[^=]*$' | cut -d= -f1 > "$dev_req"
    result=$(awk 'NR==FNR{words[$0]=1;next} $1 in words' "$dev_req" "$licenses")
    [[ -n "$result" ]] && echo "Processing requirements-dev.txt. The following packages are not allowed due to their licenses:\n $result"
fi
if [[ -n "$req_pnpm" ]]; then
    pnpm install license-checker
    [[ $? -ne 0 ]] && echo "license-checker package not found please run: npm install license-checker" && rm -rf ./output/ && exit 1
    license-checker --exclude 'MIT,ISC,BSD,CC0-1.0,Python-2.0,CC-BY-3.0,Apache-2.0' --json
fi

rm -rf ./output/