Excellent idea! Let me create a **comprehensive MD file** for you to save and reference later.

## Copy this entire block into your `PROJECT-1-SUMMARY.md` file:

```markdown
# Project 1 - Full Stack App on AWS EC2

## 📁 Project Structure
```
project1-task-manager/
├── backend/
│   └── index.js (Express server on port 3001)
├── frontend/
│   ├── src/
│   │   └── App.jsx (React app)
│   └── .env (VITE_API_URL=/api)
├── .github/workflows/
│   └── deploy.yml (CI/CD pipeline)
└── .gitignore
```

## 🚀 Quick Commands Reference

### Connect to EC2
```bash
ssh -i task-manager-key.pem ubuntu@54.145.25.171
```

### Exit EC2
```bash
exit
```

### Copy files to EC2 (alternative to git)
```bash
scp -i task-manager-key.pem -r . ubuntu@54.145.25.171:~/task-manager
```

### On EC2 - Pull latest code & rebuild
```bash
cd ~/task-manager
git pull origin main
cd backend && npm install
cd ../frontend && npm install && npm run build
sudo systemctl reload nginx
pm2 restart task-backend
```

### Check PM2 status
```bash
pm2 status
pm2 logs task-backend
pm2 restart task-backend
pm2 stop task-backend
pm2 delete task-backend
```

### Nginx commands
```bash
sudo nginx -t              # Test config
sudo systemctl reload nginx # Reload config
sudo systemctl status nginx # Check status
sudo tail -f /var/log/nginx/error.log  # View errors
```

## 🔐 GitHub Secrets (Add in repo Settings → Secrets → Actions)

| Secret Name | Value |
|-------------|-------|
| `EC2_HOST` | `54.145.25.171` |
| `EC2_USER` | `ubuntu` |
| `EC2_SSH_KEY` | Private key from `~/.ssh/github_deploy` on EC2 |

## 📝 Workflow File (`.github/workflows/deploy.yml`)

```yaml
name: Deploy to EC2

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to EC2
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            set -e
            cd ~/task-manager
            git pull origin main
            cd backend && npm install --omit=dev
            cd ../frontend && npm install && VITE_API_URL=/api npm run build
            pm2 restart task-backend
            sudo systemctl reload nginx
```

## 🌐 URLs

| Service | URL |
|---------|-----|
| **Live App** | `http://54.145.25.171` |
| **GitHub Repo** | `https://github.com/sharifme04/project1-task-manager` |
| **GitHub Actions** | `https://github.com/sharifme04/project1-task-manager/actions` |

## 🛠️ AWS Setup Summary

### EC2 Instance
| Setting | Value |
|---------|-------|
| AMI | Ubuntu 24.04 LTS |
| Type | t3.micro (free tier) |
| Storage | 8 GB gp3 |
| Key Pair | task-manager-key.pem |

### Security Group Rules (Inbound)

| Type | Port | Source | Purpose |
|------|------|--------|---------|
| SSH | 22 | My IP (94.139.23.119/32) | Admin access |
| HTTP | 80 | 0.0.0.0/0 | React app |
| HTTPS | 443 | 0.0.0.0/0 | Future SSL |

### Software Installed on EC2
```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx
sudo npm install -g pm2
```

## 🔑 Key Files Location

| File | Location |
|------|----------|
| SSH private key | `~/Downloads/task-manager-key.pem` (local) |
| GitHub deploy key | `~/.ssh/github_deploy` (on EC2) |
| Authorized keys | `~/.ssh/authorized_keys` (on EC2) |
| Nginx config | `/etc/nginx/sites-available/task-manager` |
| App code | `~/task-manager/` (on EC2) |

## 📋 Nginx Configuration

File: `/etc/nginx/sites-available/task-manager`

```nginx
server {
    listen 80;
    server_name 54.145.25.171;

    root /home/ubuntu/task-manager/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🎯 What You Learned

| Concept | What you did |
|---------|--------------|
| **EC2** | Launched and managed virtual server |
| **SSH** | Connected to server securely |
| **Security Groups** | Configured firewall rules |
| **Key Pairs** | Created and used `.pem` files |
| **Nginx** | Reverse proxy + static file serving |
| **PM2** | Kept Node.js app running continuously |
| **GitHub Actions** | Automated deployment on push |
| **Secrets Management** | Stored sensitive data securely |

## 📝 CV Bullet Points

- Deployed a full-stack React + Node.js application on AWS EC2 (Ubuntu), configuring Nginx as a reverse proxy and PM2 for process management.
- Implemented a CI/CD pipeline using GitHub Actions that automatically deploys to EC2 on every push to the main branch via SSH.
- Managed Linux server setup including package installation, security group configuration, and service management with systemctl.

## ⚠️ Troubleshooting

### App not loading?
```bash
# Check Nginx
sudo systemctl status nginx
sudo nginx -t

# Check backend
pm2 status
pm2 logs task-backend

# Check permissions
sudo chmod 755 /home/ubuntu/task-manager/frontend/dist
```

### GitHub Actions fails?
- Verify secrets are set in GitHub repo
- Check SSH key is in `~/.ssh/authorized_keys` on EC2
- Ensure security group allows SSH from GitHub (or set to 0.0.0.0/0 temporarily)

### Tasks disappear after restart?
- This is expected (in-memory storage)
- To fix: Add MongoDB Atlas for persistence

## 🎉 Project Complete!

App is live at: **http://54.145.25.171**
```

