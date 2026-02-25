import { NextResponse } from "next/server";
import si from "systeminformation";

export async function GET() {
    try {
        const [load, mem, time] = await Promise.all([
            si.currentLoad(),
            si.mem(),
            si.time(),
        ]);

        // Format CPU
        const cpu = `${Math.round(load.currentLoad)}%`;

        // Format RAM
        const totalRamGB = mem.total / (1024 ** 3);
        const usedRamGB = mem.used / (1024 ** 3);
        const ram = `${usedRamGB.toFixed(1)}GB / ${totalRamGB.toFixed(1)}GB`;

        // Format Uptime
        const uptimeSeconds = time.uptime;
        const hours = Math.floor(uptimeSeconds / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        const uptime = `${hours}h ${minutes}m`;

        return NextResponse.json({ cpu, ram, uptime });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch system stats" },
            { status: 500 }
        );
    }
}
