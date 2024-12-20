#!/bin/bash

req_py=$(find . -name "requirements.txt")
req_dev_py=$(find . -name "requirements-dev.txt")
req_pnpm=$(find . -name "pnpm-lock.yaml" -not -path "./node_modules/*")

echo -e "\nRunning SCA trivy pre-commit\n"
[[ -f $req_py  ]] && echo "requirements.txt exists, running trivy" && docker run --rm -v "$PWD":/myapp aquasec/trivy fs "myapp/$req_py" --ignore-unfixed -q --scanners vuln || exit 0
[[ -f $req_dev_py ]] && echo "requirements-dev.txt exists, running trivy" && docker run --rm -v "$PWD":/myapp aquasec/trivy fs "myapp/$req_dev_py" --ignore-unfixed -q --scanners vuln || exit 0
[[ -f $req_pnpm  ]] && echo "pnpm-lock.yaml exists, running trivy" && docker run --rm -v "$PWD":/myapp aquasec/trivy fs "myapp/$req_pnpm" --ignore-unfixed -q --scanners vuln || exit 0