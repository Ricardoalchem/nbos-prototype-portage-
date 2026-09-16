#!/usr/bin/env bash
export NODE_INSTALLATION_VERSION=$(sed 's/^v//' "$(dirname "${BASH_SOURCE[0]}")/../.nvmrc")
export REPOSITORY_RID="ri.stemma.main.repository.b40e72c3-e653-4471-9902-c9e63316018b"
export REQUESTS_CA_BUNDLE=${SSL_CERT_FILE} # Used by the Python requests module
