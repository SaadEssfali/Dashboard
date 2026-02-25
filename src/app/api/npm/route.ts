import { NextResponse } from "next/server";
import fs from "fs";

export async function GET() {
    try {
        // For MVP: We return mock data if the SQLite DB is not mounted
        // In production, you would mount NPM's database.sqlite to /data/npm/database.sqlite
        // and use a SQLite client to query: "SELECT count(*) FROM proxy_host WHERE enabled = 1"

        return NextResponse.json({
            activeHosts: 4, // Mock value
            expiringCerts: 0, // Mock value
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to read NPM data" },
            { status: 500 }
        );
    }
}
