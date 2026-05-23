#!/bin/bash
# Run this script on your Alibaba Cloud Ubuntu server to set up nginx for Obsidian site
# Usage: SSH into your server, then run: bash server-setup.sh
set -e

echo "=== Setting up Obsidian web server ==="

# Install nginx
echo "[1/4] Installing nginx..."
sudo apt update -qq
sudo apt install -y nginx

# Create web directory
echo "[2/4] Creating web directory..."
sudo mkdir -p /var/www/obsidian
sudo chown -R $USER:$USER /var/www/obsidian

# Copy nginx config
echo "[3/4] Configuring nginx..."
sudo cp nginx-obsidian.conf /etc/nginx/sites-available/obsidian
sudo ln -sf /etc/nginx/sites-available/obsidian /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# Setup deploy user with SSH key
echo "[4/4] Setting up deploy user..."
if ! id deploy &>/dev/null; then
    sudo useradd -m -s /bin/bash deploy
    sudo mkdir -p /home/deploy/.ssh
    sudo chmod 700 /home/deploy/.ssh
fi

echo ""
echo "=== Server setup complete! ==="
echo ""
echo "Next steps:"
echo "1. Generate SSH key for deploy user:"
echo "   ssh-keygen -t ed25519 -f ~/.ssh/deploy_key -N ''"
echo ""
echo "2. Add the public key to deploy user:"
echo "   sudo tee -a /home/deploy/.ssh/authorized_keys < ~/.ssh/deploy_key.pub"
echo "   sudo chmod 600 /home/deploy/.ssh/authorized_keys"
echo "   sudo chown -R deploy:deploy /home/deploy/.ssh"
echo ""
echo "3. Grant deploy user write access to web directory:"
echo "   sudo chown -R deploy:deploy /var/www/obsidian"
echo ""
echo "4. Copy the private key (deploy_key) to GitHub Secrets as SSH_PRIVATE_KEY"
echo "5. Add REMOTE_HOST (server IP) and REMOTE_USER (deploy) to GitHub Secrets"
echo ""
echo "6. Open port 80 in Alibaba Cloud security group (控制台 > 安全组 > 入方向)"
