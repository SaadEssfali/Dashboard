import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const configPath = path.join(process.cwd(), "src/config/icons.json");

export async function GET() {
    try {
        if (fs.existsSync(configPath)) {
            const data = fs.readFileSync(configPath, "utf-8");
            return NextResponse.json(JSON.parse(data || "{}"));
        }
        return NextResponse.json({});
    } catch (error) {
        return NextResponse.json({ error: "Failed to read icons config" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { hostname, iconUrl } = body;

        if (!hostname) {
            return NextResponse.json({ error: "Hostname is required" }, { status: 400 });
        }

        let icons: Record<string, string> = {};
        if (fs.existsSync(configPath)) {
            const data = fs.readFileSync(configPath, "utf-8");
            icons = JSON.parse(data || "{}");
        }

        if (iconUrl) {
            icons[hostname] = iconUrl;
        } else {
            delete icons[hostname]; // allow clearing
        }

        fs.writeFileSync(configPath, JSON.stringify(icons, null, 2), "utf-8");

        return NextResponse.json({ success: true, icons });
    } catch (error) {
        return NextResponse.json({ error: "Failed to save icon override" }, { status: 500 });
    }
}
