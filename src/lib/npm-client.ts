// Known service name to Simple Icons slug mapping
const ICON_MAP: Record<string, { icon: string; description: string }> = {
    portainer: { icon: "portainer", description: "Container Management" },
    nextcloud: { icon: "nextcloud", description: "Cloud Storage" },
    plex: { icon: "plex", description: "Media Server" },
    homeassistant: { icon: "homeassistant", description: "Smart Home" },
    "home-assistant": { icon: "homeassistant", description: "Smart Home" },
    grafana: { icon: "grafana", description: "Monitoring" },
    proxmox: { icon: "proxmox", description: "Virtualization" },
    pihole: { icon: "pihole", description: "DNS & Ad Blocking" },
    "pi-hole": { icon: "pihole", description: "DNS & Ad Blocking" },
    gitlab: { icon: "gitlab", description: "Code Repository" },
    github: { icon: "github", description: "Code Repository" },
    gitea: { icon: "gitea", description: "Code Repository" },
    jellyfin: { icon: "jellyfin", description: "Media Server" },
    emby: { icon: "emby", description: "Media Server" },
    sonarr: { icon: "sonarr", description: "TV Management" },
    radarr: { icon: "radarr", description: "Movie Management" },
    overseerr: { icon: "overseerr", description: "Media Requests" },
    vaultwarden: { icon: "vaultwarden", description: "Password Manager" },
    bitwarden: { icon: "bitwarden", description: "Password Manager" },
    syncthing: { icon: "syncthing", description: "File Sync" },
    traefik: { icon: "traefikproxy", description: "Reverse Proxy" },
    nginx: { icon: "nginx", description: "Web Server" },
    docker: { icon: "docker", description: "Containers" },
    wordpress: { icon: "wordpress", description: "CMS" },
    minio: { icon: "minio", description: "Object Storage" },
    wireguard: { icon: "wireguard", description: "VPN" },
    uptime: { icon: "uptimekuma", description: "Uptime Monitoring" },
    uptimekuma: { icon: "uptimekuma", description: "Uptime Monitoring" },
    "uptime-kuma": { icon: "uptimekuma", description: "Uptime Monitoring" },
    adguard: { icon: "adguard", description: "DNS & Ad Blocking" },
    truenas: { icon: "truenas", description: "Storage" },
    cockpit: { icon: "cockpit", description: "Server Manager" },
    apache: { icon: "apache", description: "Web Server" },
    mariadb: { icon: "mariadb", description: "Database" },
    postgres: { icon: "postgresql", description: "Database" },
    postgresql: { icon: "postgresql", description: "Database" },
    mysql: { icon: "mysql", description: "Database" },
    redis: { icon: "redis", description: "Cache" },
    mongodb: { icon: "mongodb", description: "Database" },
    jenkins: { icon: "jenkins", description: "CI/CD" },
    drone: { icon: "drone", description: "CI/CD" },
    prometheus: { icon: "prometheus", description: "Monitoring" },
    loki: { icon: "grafana", description: "Log Aggregation" },
    code: { icon: "visualstudiocode", description: "Code Editor" },
    vscode: { icon: "visualstudiocode", description: "Code Editor" },
    paperless: { icon: "paperlessngx", description: "Document Management" },
    immich: { icon: "immich", description: "Photo Management" },
    photoprism: { icon: "photoprism", description: "Photo Management" },
    freshrss: { icon: "rss", description: "RSS Reader" },
    calibre: { icon: "calibreweb", description: "E-Book Library" },
    npm: { icon: "nginxproxymanager", description: "Proxy Manager" },
};

/**
 * Auto-detect icon and description from the domain name
 */
export function detectServiceInfo(domain: string): {
    icon: string;
    description: string;
    name: string;
} {
    const lowerDomain = domain.toLowerCase();

    // Extract the subdomain / first part
    const parts = lowerDomain.split(".");
    const subdomain = parts[0];

    // Try matching the subdomain against known services
    for (const [keyword, meta] of Object.entries(ICON_MAP)) {
        if (subdomain.includes(keyword)) {
            // Create a nice display name from the keyword
            const name = keyword.charAt(0).toUpperCase() + keyword.slice(1);
            return { ...meta, name };
        }
    }

    // Fallback: use subdomain as name with generic icon
    const name = subdomain.charAt(0).toUpperCase() + subdomain.slice(1);
    return {
        icon: "globe",
        description: "Web Service",
        name,
    };
}

import fs from "fs";
import path from "path";

export function getNPMConfig() {
    const configPath = path.join(process.cwd(), "src/config/npm.json");
    let url = process.env.NPM_API_URL || "";
    let email = process.env.NPM_API_EMAIL || "";
    let password = process.env.NPM_API_PASSWORD || "";

    if (fs.existsSync(configPath)) {
        try {
            const data = fs.readFileSync(configPath, "utf-8");
            if (data.trim() !== "") {
                const config = JSON.parse(data);
                if (config.url && config.email && config.password) {
                    url = config.url;
                    email = config.email;
                    password = config.password;
                }
            }
        } catch (e) {
            console.error("Error parsing npm.json", e);
        }
    }

    return { url, email, password };
}

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

async function getToken(): Promise<string> {
    const { url, email, password } = getNPMConfig();

    if (!url || !email || !password) {
        throw new Error("NPM_API_URL, NPM_API_EMAIL, NPM_API_PASSWORD are required");
    }

    // Reuse token if still valid (cache for 50 min)
    if (cachedToken && Date.now() < tokenExpiry) {
        return cachedToken;
    }

    const res = await fetch(`${url}/api/tokens`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identity: email, secret: password }),
    });

    if (!res.ok) {
        throw new Error(`NPM auth failed: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    cachedToken = data.token;
    tokenExpiry = Date.now() + 50 * 60 * 1000; // 50 min
    return cachedToken!;
}

export interface NPMProxyHost {
    id: number;
    domain_names: string[];
    forward_host: string;
    forward_port: number;
    forward_scheme: string;
    enabled: number | boolean;
    ssl_forced: number | boolean;
    meta: {
        letsencrypt_agree?: boolean;
        dns_challenge?: boolean;
    };
    certificate_id: number;
    certificate?: {
        expires_on?: string;
    };
}

export interface ServiceItem {
    name: string;
    url: string;
    icon: string;
    customIcon?: string;
    description: string;
    source: "npm" | "static";
}

/**
 * Fetch all enabled proxy hosts from NPM
 */
export async function fetchNPMHosts(): Promise<ServiceItem[]> {
    const token = await getToken();
    const { url } = getNPMConfig();

    const res = await fetch(`${url}/api/nginx/proxy-hosts?expand=certificate`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
        throw new Error(`NPM fetch failed: ${res.status} ${res.statusText}`);
    }

    const hosts: NPMProxyHost[] = await res.json();

    // Load custom icons
    let customIcons: Record<string, string> = {};
    const iconsPath = path.join(process.cwd(), "src/config/icons.json");
    if (fs.existsSync(iconsPath)) {
        try {
            customIcons = JSON.parse(fs.readFileSync(iconsPath, "utf-8") || "{}");
        } catch (e) {
            console.error("Failed to parse custom icons config", e);
        }
    }

    return hosts
        .filter((h) => h.enabled === 1 || h.enabled === true)
        .map((host) => {
            const domain = host.domain_names[0] || "unknown";
            const scheme = host.ssl_forced ? "https" : host.forward_scheme || "http";
            const detected = detectServiceInfo(domain);

            // Check for custom override
            const customIconUrl = customIcons[domain];

            return {
                name: detected.name,
                url: `${scheme}://${domain}`,
                icon: detected.icon,
                customIcon: customIconUrl, // Add this new property
                description: detected.description,
                source: "npm" as const,
            };
        });
}

/**
 * Fetch NPM stats (active host count + expiring certificates)
 */
export async function fetchNPMStats(): Promise<{
    activeHosts: number;
    expiringCerts: number;
}> {
    const token = await getToken();
    const { url } = getNPMConfig();

    const res = await fetch(`${url}/api/nginx/proxy-hosts?expand=certificate`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
        throw new Error(`NPM stats failed: ${res.status}`);
    }

    const hosts: NPMProxyHost[] = await res.json();
    const activeHosts = hosts.filter((h) => h.enabled === 1).length;

    // Count certificates expiring in the next 30 days
    const thirtyDaysFromNow = Date.now() + 30 * 24 * 60 * 60 * 1000;
    const expiringCerts = hosts.filter((h) => {
        if (!h.certificate?.expires_on) return false;
        const expiry = new Date(h.certificate.expires_on).getTime();
        return expiry < thirtyDaysFromNow;
    }).length;

    return { activeHosts, expiringCerts };
}

/**
 * Check if NPM is configured
 */
export function isNPMConfigured(): boolean {
    const { url, email, password } = getNPMConfig();
    return !!(url && email && password);
}
