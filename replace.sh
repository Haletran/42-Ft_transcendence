#!/bin/bash

CURRENT_IP=$(hostname -I | awk '{print $1}')
SEARCH_DIR="."

if [ $# -eq 1 ]; then
    SEARCH_DIR="$1"
fi

echo "Replacing 'localhost' with '$CURRENT_IP' in files under '$SEARCH_DIR'..."
find "$SEARCH_DIR" -type f ! -name "$(basename "$0")" ! -path "*/crypto/*" -exec sed -i "s/localhost/$CURRENT_IP/g" {} +
echo "Replacement completed!"
