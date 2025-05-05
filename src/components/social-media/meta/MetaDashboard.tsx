
import { useState, useEffect } from 'react';
import { SocialMediaAccount } from '@/types/socialMedia';
import { usePermissions } from '@/hooks/use-permissions';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import AccountsList from './AccountsList';
import PostsList from './PostsList';
import CreatePostForm from './CreatePostForm';
import { useIsMobile } from '@/hooks/use-mobile';

const MetaDashboard = () => {
  const [selectedAccount, setSelectedAccount] = useState<SocialMediaAccount | undefined>();
  const [activeTab, setActiveTab] = useState('view');
  const { isAdmin, isSocialManager, checkRole, loading } = usePermissions();
  const isMobile = useIsMobile();
  const canCreatePosts = isAdmin || isSocialManager;

  // Reset selected tab when switching accounts
  useEffect(() => {
    setActiveTab('view');
  }, [selectedAccount]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar with accounts list - shown as a sidebar on desktop */}
        <div className={`${isMobile ? 'order-1' : 'md:col-span-1'}`}>
          <AccountsList 
            onSelectAccount={setSelectedAccount}
            selectedAccount={selectedAccount}
          />
          
          {/* In mobile view, show the tab switcher below the accounts list */}
          {isMobile && canCreatePosts && (
            <div className="mt-4">
              <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="view">צפייה בפוסטים</TabsTrigger>
                  <TabsTrigger value="create">יצירת פוסט</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}
        </div>
        
        {/* Main content area - takes full width on mobile */}
        <div className={`${isMobile ? 'order-2' : 'md:col-span-3'}`}>
          {!isMobile && canCreatePosts ? (
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 w-full mb-6">
                <TabsTrigger value="view">צפייה בפוסטים</TabsTrigger>
                <TabsTrigger value="create">יצירת פוסט</TabsTrigger>
              </TabsList>
              
              <TabsContent value="view">
                <PostsList account={selectedAccount} />
              </TabsContent>
              
              <TabsContent value="create">
                <CreatePostForm 
                  selectedAccount={selectedAccount}
                  onSuccess={() => setActiveTab('view')}
                />
              </TabsContent>
            </Tabs>
          ) : isMobile && canCreatePosts ? (
            <>
              <TabsContent value="view" className={activeTab === 'view' ? 'block' : 'hidden'}>
                <PostsList account={selectedAccount} />
              </TabsContent>
              
              <TabsContent value="create" className={activeTab === 'create' ? 'block' : 'hidden'}>
                <CreatePostForm 
                  selectedAccount={selectedAccount}
                  onSuccess={() => setActiveTab('view')}
                />
              </TabsContent>
            </>
          ) : (
            // For users without create permission, always show posts view
            <PostsList account={selectedAccount} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MetaDashboard;
