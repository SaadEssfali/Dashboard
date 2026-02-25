import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
        return NextResponse.json({ status: "down", error: "URL is required" }, { status: 400 });
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 sec timeout

        const res = await fetch(url, {
            method: "HEAD", // Use HEAD for a lightweight ping
            signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (res.ok || res.status < 400 || res.status === 401 || res.status === 403) {
            // 401/403 often means the service is up but requires auth (e.g., Proxmox, TrueNAS)
            return NextResponse.json({ status: "up" });
        } else {
            return NextResponse.json({ status: "down", code: res.status });
        }
    } catch (error) {
        return NextResponse.json({ status: "down", error: (error as Error).message });
    }
}
