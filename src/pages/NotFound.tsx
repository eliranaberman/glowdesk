
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-warmBeige/5">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-5xl font-bold mb-6 text-neutral-700">404</h1>
        <p className="text-xl text-gray-600 mb-6">הדף שחיפשת לא נמצא</p>
        <Button 
          onClick={() => navigate("/")} 
          variant="warm"
          size="lg"
          className="mx-auto flex items-center gap-2 font-medium px-6"
        >
          <ArrowLeft className="h-5 w-5" />
          חזרה לדף הבית
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
