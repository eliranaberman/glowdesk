
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateWrapperProps {
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  helpText?: string;
  children?: React.ReactNode;
}

export const EmptyStateWrapper = ({
  title,
  description,
  actionText,
  actionHref,
  helpText,
  children
}: EmptyStateWrapperProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center">
          <div className="mb-4">
            <div className="bg-muted/20 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          <p className="text-muted-foreground mb-6">{description}</p>
          
          <div className="space-y-3">
            {actionHref && actionText && (
              <Link to={actionHref} className="block">
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  {actionText}
                </Button>
              </Link>
            )}
            
            {helpText && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <HelpCircle className="h-4 w-4" />
                <span>{helpText}</span>
              </div>
            )}
          </div>
          
          {children}
        </CardContent>
      </Card>
    </div>
  );
};
