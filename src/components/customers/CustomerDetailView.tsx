
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Edit, ChevronLeft } from 'lucide-react';
import { useCustomerDetail } from './hooks/useCustomerDetail';
import CustomerContactInfo from './detail-sections/CustomerContactInfo';
import CustomerNotesCard from './detail-sections/CustomerNotesCard';
import CustomerAppointmentsCard from './detail-sections/CustomerAppointmentsCard';
import CustomerTagDialog from './detail-sections/CustomerTagDialog';
import CustomerLoadingSkeleton from './detail-sections/CustomerLoadingSkeleton';

const CustomerDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  const {
    customer,
    loading,
    notes,
    setNotes,
    showTagDialog,
    setShowTagDialog,
    newTag,
    setNewTag,
    saveNotes,
    addTag,
    removeTag,
    formatDate,
    getLoyaltyText,
    getStatusText
  } = useCustomerDetail(id);
  
  // Loading state
  if (loading) {
    return <CustomerLoadingSkeleton />;
  }
  
  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold mb-2">לקוח לא נמצא</h2>
        <p className="text-muted-foreground mb-4">הלקוח המבוקש אינו קיים או שאין לך הרשאות לצפות בו.</p>
        <Button onClick={() => navigate('/customers')}>חזרה לרשימת הלקוחות</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{customer.full_name}</h2>
        {isAdmin && (
          <Button onClick={() => navigate(`/customers/edit/${customer.id}`)}>
            <Edit className="h-4 w-4 ml-2" />
            עריכת לקוח
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Contact Info Card */}
        <CustomerContactInfo 
          customer={customer}
          isAdmin={isAdmin}
          openTagDialog={() => setShowTagDialog(true)}
          removeTag={removeTag}
          formatDate={formatDate}
          getLoyaltyText={getLoyaltyText}
          getStatusText={getStatusText}
        />
        
        {/* Notes Card */}
        <CustomerNotesCard 
          notes={notes}
          isAdmin={isAdmin}
          onSaveNotes={saveNotes}
          onNotesChange={setNotes}
        />
        
        {/* Appointments Card */}
        <CustomerAppointmentsCard customerId={customer.id} />
      </div>
      
      {/* Tag Dialog */}
      <CustomerTagDialog
        open={showTagDialog}
        onOpenChange={setShowTagDialog}
        newTag={newTag}
        onNewTagChange={setNewTag}
        onAddTag={addTag}
      />
    </div>
  );
};

export default CustomerDetailView;
