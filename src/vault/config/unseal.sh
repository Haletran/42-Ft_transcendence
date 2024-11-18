#!/bin/sh

echo "Unsealing Vault..."

# Unseal Vault with the provided unseal keys
for i in 1 2 3; do
  # Construct the variable name dynamically
  UNSEAL_KEY_VAR="UNSEAL_KEY_$i"
  
  # Use `eval` to access the value of the dynamically named variable
  eval UNSEAL_KEY=\$$UNSEAL_KEY_VAR

  if [ -z "$UNSEAL_KEY" ]; then
    echo "Unseal key $i is missing, exiting..."
    exit 1
  fi

  # Send the unseal key to Vault to unseal
  vault operator unseal "$UNSEAL_KEY"

  if [ $? -eq 0 ]; then
    echo "Vault unsealed with key $i."
  else
    echo "Failed to unseal Vault with key $i. Exiting..."
    exit 1
  fi
done

echo "Vault successfully unsealed!"