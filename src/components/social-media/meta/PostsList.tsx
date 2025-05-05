
import { useState, useEffect } from 'react';
import { SocialMediaAccount, SocialMediaPost } from '@/types/socialMedia';
import { fetchPosts, deleteDraftPost } from '@/services/socialMediaService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Loader2, CalendarClock, Check, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PostsListProps {
  account?: SocialMediaAccount;
}

const PostsList = ({ account }: PostsListProps) => {
  const [posts, setPosts] = useState<SocialMediaPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewPost, setViewPost] = useState<SocialMediaPost | null>(null);
  const { toast } = useToast();

  const loadPosts = async () => {
    if (!account) return;
    
    setIsLoading(true);
    const result = await fetchPosts(account.platform, account.account_id);
    
    if (result.success) {
      setPosts(result.posts || []);
    } else {
      toast({
        title: 'שגיאה',
        description: result.error || 'אירעה שגיאה בטעינת הפוסטים',
        variant: 'destructive',
      });
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    if (account) {
      loadPosts();
    } else {
      setPosts([]);
    }
  }, [account]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="success" className="flex items-center gap-1"><Check className="h-3 w-3" /> פורסם</Badge>;
      case 'scheduled':
        return <Badge variant="warning" className="flex items-center gap-1"><CalendarClock className="h-3 w-3" /> מתוזמן</Badge>;
      case 'failed':
        return <Badge variant="destructive" className="flex items-center gap-1"><AlertCircle className="h-3 w-3" /> נכשל</Badge>;
      default:
        return <Badge variant="outline">טיוטה</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">פוסטים אחרונים</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadPosts}
          disabled={isLoading || !account}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {!account ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">בחר חשבון כדי לראות את הפוסטים</p>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">אין פוסטים בחשבון זה</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                {post.image_url ? (
                  <img 
                    src={post.image_url} 
                    alt={post.caption || 'Post image'} 
                    className="w-full h-full object-cover"
                    onClick={() => setViewPost(post)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <p className="text-muted-foreground">אין תמונה</p>
                  </div>
                )}
              </div>
              
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <p className="line-clamp-1 flex-1">
                    {post.caption || 'אין כיתוב'}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {getStatusBadge(post.status)}
                  
                  {post.published_at && (
                    <Badge variant="outline" className="text-xs">
                      פורסם: {formatDate(post.published_at)}
                    </Badge>
                  )}
                  
                  {post.scheduled_for && (
                    <Badge variant="outline" className="text-xs">
                      מתוזמן: {formatDate(post.scheduled_for)}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Post View Dialog */}
      <Dialog open={!!viewPost} onOpenChange={() => setViewPost(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>צפייה בפוסט</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              {viewPost?.image_url && (
                <img 
                  src={viewPost.image_url} 
                  alt={viewPost.caption || 'Post image'} 
                  className="w-full h-auto object-contain"
                />
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">סטטוס</h4>
                {viewPost && getStatusBadge(viewPost.status)}
              </div>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">תוכן</h4>
                <p className="whitespace-pre-wrap">{viewPost?.caption || 'אין כיתוב'}</p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">פרטים</h4>
                <div className="space-y-1 text-sm">
                  {viewPost?.published_at && (
                    <p>תאריך פרסום: {formatDate(viewPost.published_at)}</p>
                  )}
                  {viewPost?.scheduled_for && (
                    <p>מתוזמן ל: {formatDate(viewPost.scheduled_for)}</p>
                  )}
                  <p>נוצר ב: {viewPost && formatDate(viewPost.created_at)}</p>
                  <p>פלטפורמה: {viewPost?.platform === 'facebook' ? 'פייסבוק' : 'אינסטגרם'}</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostsList;
