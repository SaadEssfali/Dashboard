import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const configPath = path.join(dataDir, "npm.json");

// Ensure the data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

export async function GET() {
    try {
        if (fs.existsSync(configPath)) {
            const configData = fs.readFileSync(configPath, "utf-8");
            const config = JSON.parse(configData);

            return NextResponse.json({
                configured: !!(config.url && config.email && config.password),
                url: config.url || "",
                email: config.email || "",
                // Do not return password for security
            });
        }

        return NextResponse.json({
            configured: false,
            url: "",
            email: "",
        });
    } catch (error) {
        console.error("Failed to read NPM settings:", error);
        return NextResponse.json(
            { error: "Failed to read config" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { url, email, password } = body;

        if (!url || !email || !password) {
            return NextResponse.json(
                { error: "URL, Email, and Password are required" },
                { status: 400 }
            );
        }

        // 1. Test connection from backend
        try {
            const testRes = await fetch(`${url}/api/tokens`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identity: email, secret: password }),
            });

            if (!testRes.ok) {
                return NextResponse.json(
                    { error: `NPM Connection failed: ${testRes.status} ${testRes.statusText}` },
                    { status: 400 }
                );
            }
        } catch (fetchErr: any) {
            return NextResponse.json(
                { error: `NPM Network error: ${fetchErr.message}` },
                { status: 400 }
            );
        }

        // 2. Save to npm.json
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        fs.writeFileSync(
            configPath,
            JSON.stringify({ url, email, password }, null, 2),
            "utf-8"
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to save NPM settings:", error);
        return NextResponse.json(
            { error: "Failed to save config" },
            { status: 500 }
        );
    }
}
