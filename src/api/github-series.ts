export interface Series {
    title: string;
    season: string;
    genre: string[];
    director: string[];
    rating: number | null;
    imdbScore: number;
    cast: string[];
    cover: string;
    released: string;
    finished: string | null;
    added: string;
    status: string;
    favorite?: boolean;
}

export interface SeriesData {
    lastUpdated: string;
    count: number;
    aktiv: Series[];
    merkliste: Series[];
    pausiert: Series[];
    abgeschlossen: Record<string, Series[]>;
}

const TIMEOUT_MS = 5000;

const emptySeriesData: SeriesData = {
    lastUpdated: "",
    count: 0,
    aktiv: [],
    merkliste: [],
    pausiert: [],
    abgeschlossen: {},
};

export async function fetchSeries(): Promise<SeriesData> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        const response = await fetch(
            "https://raw.githubusercontent.com/iam-robin/obsidian-personal-website-data/main/output/series.json",
            {
                headers: {
                    Authorization: `token ${import.meta.env.GITHUB_TOKEN}`,
                    Accept: "application/vnd.github.v3.raw",
                },
                signal: controller.signal,
            },
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
            console.warn(`Skipped remote series: ${response.statusText}`);
            return emptySeriesData;
        }

        return response.json();
    } catch (error) {
        clearTimeout(timeoutId);
        console.warn("Skipped remote series:", error);
        return emptySeriesData;
    }
}
