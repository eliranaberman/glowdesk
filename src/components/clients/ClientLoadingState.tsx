
const ClientLoadingState = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
        <p className="text-muted-foreground">טוען פרטי לקוח...</p>
      </div>
    </div>
  );
};

export default ClientLoadingState;
