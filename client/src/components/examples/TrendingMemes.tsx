import TrendingMemes from "../TrendingMemes";

const mockMemes = [
  {
    id: "1",
    title: "Dogwifhat takes over the internet again",
    subreddit: "CryptoCurrency",
    upvotes: 12500,
    comments: 342,
    trend_score: 95,
    url: "https://reddit.com/r/cryptocurrency",
  },
  {
    id: "2",
    title: "When you finally understand blockchain",
    subreddit: "memes",
    upvotes: 8900,
    comments: 156,
    trend_score: 87,
    url: "https://reddit.com/r/memes",
  },
  {
    id: "3",
    title: "Pepe vs Wojak: The eternal battle",
    subreddit: "dankmemes",
    upvotes: 15200,
    comments: 428,
    trend_score: 92,
    url: "https://reddit.com/r/dankmemes",
  },
];

export default function TrendingMemesExample() {
  return <TrendingMemes memes={mockMemes} />;
}
