import { NextResponse } from "next/server";

interface IconItem {
    name: string;
    url: string;
}

let cachedIcons: IconItem[] | null = null;
let lastFetchTime = 0;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toLowerCase() || "";

    // Refresh cache if it's null or older than 24 hours
    if (!cachedIcons || Date.now() - lastFetchTime > 24 * 60 * 60 * 1000) {
        try {
            const res = await fetch("https://api.github.com/repos/selfhst/icons/git/trees/main?recursive=1", {
                headers: {
                    "User-Agent": "HomeLab-OS-Dashboard",
                },
                next: { revalidate: 3600 } // Next.js cache
            });

            if (res.ok) {
                const data = await res.json();
                const paths: string[] = data.tree
                    .filter((i: any) => i.path.startsWith("webp/") && i.path.endsWith(".webp"))
                    .map((i: any) => i.path);

                cachedIcons = paths.map((p) => {
                    const name = p.replace("webp/", "").replace(".webp", "");
                    return {
                        name,
                        url: `https://cdn.jsdelivr.net/gh/selfhst/icons/${p}`,
                    };
                });
                lastFetchTime = Date.now();
            } else {
                console.error("Failed to fetch selfhst icons from GitHub API:", res.statusText);
            }
        } catch (error) {
            console.error("Error fetching selfhst icons:", error);
        }
    }

    let results = cachedIcons || [];

    if (query) {
        results = results.filter((icon) => icon.name.toLowerCase().includes(query));
    }

    // Return top 100 hits
    return NextResponse.json({ icons: results.slice(0, 100) });
}
