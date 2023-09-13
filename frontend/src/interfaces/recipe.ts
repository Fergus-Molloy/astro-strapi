export default interface Recipe {
    id: number;
    attributes: {
        title: string;
        slug: string;
        content: string;
        publishedAt: string | null;
    }
}
