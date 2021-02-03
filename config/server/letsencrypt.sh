sudo apt install certbot -y
sudo apt install python3-certbot-nginx -y

sudo certbot certonly -a nginx --agree-tos --no-eff-email --staple-ocsp --email rizalghz@gmail.com -d accounts.aiva.store