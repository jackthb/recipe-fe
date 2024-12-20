set -eo pipefail

./pre-commit-hooks/security/secrets/gitleaks.sh
./pre-commit-hooks/security/SCA/trivy.sh
./pre-commit-hooks/security/SCA/licenses.sh
./pre-commit-hooks/security/SAST/trivy.sh
./pre-commit-hooks/security/SAST/semgrep.sh
