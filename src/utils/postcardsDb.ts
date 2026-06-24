export interface PostcardRecord {
    id?: number;
    author: string;
    body: string;
    date: Date;
    isPublished?: boolean;
    marginBottom?: number;
    marginRight?: number;
    rotation?: number;
    penColor?: string;
    paperColor?: string;
    fontSizeFactor?: number;
    lineHeight?: number;
    authorLeftOffset?: number;
    authorTopOffset?: number;
    authorRotation?: number;
    dateLeftOffset?: number;
    dateTopOffset?: number;
    dateRotation?: number;
    bodyLeftOffset?: number;
    bodyTopOffset?: number;
    bodyRotation?: number;
    stampSvg?: string;
    country?: string | null;
    websiteUrl?: string | null;
    postOfficeStampTop?: number;
    postOfficeStampRight?: number;
    postOfficeStampRotation?: number;
    wavyStampTop?: number;
    wavyStampRight?: number;
    wavyStampRotation?: number;
}

export interface NewPostcardInput {
    author: string;
    body: string;
    date: Date;
    isPublished: boolean;
    marginBottom: number;
    marginRight: number;
    rotation: number;
    penColor: string;
    paperColor: string;
    fontSizeFactor: number;
    lineHeight: number;
    authorLeftOffset: number;
    authorTopOffset: number;
    authorRotation: number;
    dateLeftOffset: number;
    dateTopOffset: number;
    dateRotation: number;
    bodyLeftOffset: number;
    bodyTopOffset: number;
    bodyRotation: number;
    stampSvg: string;
    country?: string;
    websiteUrl?: string;
    postOfficeStampTop: number;
    postOfficeStampRight: number;
    postOfficeStampRotation: number;
    wavyStampTop: number;
    wavyStampRight: number;
    wavyStampRotation: number;
}

export const isAstroDbEnabled = process.env.ENABLE_ASTRO_DB === "true";

async function loadAstroDb() {
    const moduleName = "astro:" + "db";
    return import(moduleName);
}

export async function getPublishedPostcards(): Promise<PostcardRecord[]> {
    if (!isAstroDbEnabled) {
        return [];
    }

    const { db, Postcard, desc, eq } = await loadAstroDb();

    return db
        .select()
        .from(Postcard)
        .where(eq(Postcard.isPublished, true))
        .orderBy(desc(Postcard.date));
}

export async function hasRecentDuplicatePostcard(
    author: string,
    body: string,
    since: Date,
) {
    if (!isAstroDbEnabled) {
        return false;
    }

    const { db, Postcard, eq, and, gt } = await loadAstroDb();

    const existing = await db
        .select({ id: Postcard.id })
        .from(Postcard)
        .where(
            and(
                eq(Postcard.author, author),
                eq(Postcard.body, body),
                gt(Postcard.date, since),
            ),
        );

    return existing.length > 0;
}

export async function insertPostcard(postcard: NewPostcardInput) {
    if (!isAstroDbEnabled) {
        throw new Error("Astro DB is disabled. Set ENABLE_ASTRO_DB=true to store postcards.");
    }

    const { db, Postcard } = await loadAstroDb();

    await db.insert(Postcard).values(postcard);
}
