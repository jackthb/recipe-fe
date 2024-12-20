#!/bin/bash

docker ps > /dev/null 2>&1
[[ $? -ne 0 ]] && echo "Docker not available. Start docker daemon" && exit 1
Dockerfile=$(find . -name '*dockerfile*')
if [ -n "$Dockerfile" ]; then
  while IFS= read -r file; do
    echo -e "\nfile $file exists, running Trivy\n"
    docker run -v "$PWD:/app" --rm aquasec/trivy config -q "/app/$file"
  done <<< "$Dockerfile"
fi