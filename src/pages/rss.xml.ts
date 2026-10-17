// Conventional feed path. Feed readers often guess `/rss.xml`, so serve the
// same document there as at `/blog/rss.xml`.
export { GET } from "./blog/rss.xml"
