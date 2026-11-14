import { NextResponse } from "next/server";

export async function GET() {
  const pubId =
    process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID ||
    process.env.ADSENSE_PUB_ID ||
    "pub-0000000000000000";

  // Normalize pub id format (strip "ca-" if entered as ca-pub-XXXX)
  const cleanPubId = pubId.replace(/^ca-/, "");

  const content = `# StudyTrack Official Authorized Digital Sellers (ads.txt)
# Google AdSense Authorization
google.com, ${cleanPubId}, DIRECT, f08c47fec0942fa0
`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
