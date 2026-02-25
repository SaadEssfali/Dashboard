<div align="center">

# 🖥️ Home Lab OS

**A beautiful, lightweight dashboard for your self-hosted infrastructure.**

Built with Next.js 15 • NextUI • Tailwind CSS

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Docker Hub](https://img.shields.io/docker/pulls/homelab-os.svg)](https://hub.docker.com/r/homelab-os)

</div>

---

## ✨ Features

- 🎨 **Beautiful UI** — Glassmorphism cards with NextUI components and Unsplash backgrounds
- 🔍 **Spotlight Search** — Press `⌘K` / `Ctrl+K` to instantly filter and launch any app
- 📊 **System Monitor** — Real-time CPU, RAM, and uptime stats in the navbar
- 🌐 **Nginx Proxy Manager** — Active proxy hosts count and SSL certificate status
- 🌙 **Dark / Light Mode** — Automatic theme switching with `next-themes`
- ⚡ **Live Status** — Ping-based health checks with animated indicators
- 🐳 **Docker Ready** — Multi-stage optimized image (~150MB)

## 🚀 Quick Start

### Docker Compose (Recommended)

```yaml
version: "3.8"
services:
  homelab-os:
    image: homelab-os:latest
    container_name: homelab-os
    restart: unless-stopped
    ports:
      - "3000:3000"
```

```bash
docker compose up -d
```

Open **http://localhost:3000** 🎉

### Docker Run

```bash
docker run -d -p 3000:3000 --name homelab-os homelab-os:latest
```

### From Source

```bash
git clone https://github.com/SaadEssfali/Dashboard.git
cd Dashboard
npm install
npm run dev
```

## ⚙️ Configuration

Edit `src/config/services.json` to add your services:

```json
{
  "services": [
    {
      "name": "Portainer",
      "url": "https://portainer.your-domain.com",
      "icon": "portainer",
      "description": "Container Management"
    }
  ]
}
```

The `icon` field uses [Simple Icons](https://simpleicons.org/) slugs.

### Custom Services via Docker Volume

```yaml
volumes:
  - ./my-services.json:/app/src/config/services.json:ro
```

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 15](https://nextjs.org/) | React framework (App Router) |
| [NextUI](https://nextui.org/) | UI component library |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [Lucide React](https://lucide.dev/) | Icons |
| [Simple Icons](https://simpleicons.org/) | Brand logos |
| [systeminformation](https://systeminformation.io/) | System stats API |

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

**Free to use, modify, and distribute.** Contributions welcome! ❤️

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/SaadEssfali">Saad Essfali</a>
</div>
