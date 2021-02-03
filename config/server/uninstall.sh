sudo apt remove postgresql postgresql-contrib -y
sudo apt purge postgresql postgresql-contrib -y

sudo apt remove certbot python3-certbot-nginx -y
sudo apt purge certbot python3-certbot-nginx -y

sudo apt remove nginx -y
sudo apt purge nginx -y

sudo apt remove nodejs build-essential -y
sudo apt purge nodejs build-essential -y

sudo apt autoremove -y