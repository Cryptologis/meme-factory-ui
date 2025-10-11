import { TrendingUp, MessageCircle, ArrowUp, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RedditMeme {
  id: string;
  title: string;
  subreddit: string;
  upvotes: number;
  comments: number;
  trend_score: number;
  url: string;
  thumbnail?: string;
}

interface TrendingMemesProps {
  memes?: RedditMeme[];
  onCreateFromMeme?: (meme: RedditMeme) => void;
}

export default function TrendingMemes({
  memes = [],
  onCreateFromMeme = (meme) => console.log("Create token from", meme),
}: TrendingMemesProps) {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h2 className="text-3xl font-bold">Trending Memes</h2>
              <Badge className="bg-gradient-to-r from-primary to-chart-2">
                Reddit Powered
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Create tokens based on viral memes trending on Reddit
            </p>
          </div>
        </div>

        {memes.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">Loading trending memes...</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memes.map((meme) => (
              <Card
                key={meme.id}
                className="overflow-hidden hover-elevate"
                data-testid={`meme-card-${meme.id}`}
              >
                {meme.thumbnail && (
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-chart-2/20 flex items-center justify-center">
                    <img
                      src={meme.thumbnail}
                      alt={meme.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary" className="text-xs">
                      r/{meme.subreddit}
                    </Badge>
                    <div className="flex items-center gap-1 text-primary">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-semibold">
                        {meme.trend_score}%
                      </span>
                    </div>
                  </div>

                  <h3
                    className="font-semibold mb-3 line-clamp-2"
                    data-testid={`meme-title-${meme.id}`}
                  >
                    {meme.title}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <ArrowUp className="w-4 h-4" />
                      <span>{meme.upvotes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{meme.comments.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-primary to-chart-2"
                      onClick={() => onCreateFromMeme(meme)}
                      data-testid={`button-create-${meme.id}`}
                    >
                      Create Token
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(meme.url, "_blank")}
                      data-testid={`button-view-${meme.id}`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
