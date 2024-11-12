#!/bin/bash
## This script will only wokrs on Debian-based distributions

## VARIABLES
packages=(software-properties-common node apt-transport-https wget curl dbus-x11 git python3 python3-pip python3-venv python3-dev python3-setuptools python3-wheel python3-apt)

if [ "$EUID" -ne 0 ]
  then echo "Veuillez exécuter ce script en tant qu'administrateur."
  exit
fi

## INSTALLATION DES PAQUETS
echo "Installation des paquets..."
sudo apt update -y && sudo apt upgrade -y
for package in "${packages[@]}"; do
  if ! sudo apt-get install -y "$package" > /dev/null; then
    echo -e "${RED}Échec de l'installation du paquet: $package${NC}"
    exit 1
  fi
done

echo "Installation de Docker... (last version)"
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
usermod -aG docker $USER
sudo systemctl enable docker
sudo systemctl start docker


echo "Installation de Portainer pour debugger..."
docker volume create portainer_data
if [ -z $(docker ps -q -f name=portainer) ]; then
    echo "Portainer already installed"
else
   docker run -d -p 8000:8000 -p 9443:9443 --name portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce:2.21.0
fi
