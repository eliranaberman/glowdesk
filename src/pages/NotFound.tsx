
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-warmBeige/10 to-background">
      <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-4xl font-bold mb-4 text-primary">404</h1>
        <p className="text-xl text-gray-600 mb-6">הדף שחיפשת לא נמצא</p>
        <Button 
          onClick={() => navigate("/")} 
          className="mx-auto flex items-center"
        >
          <ArrowRight className="mr-2 h-4 w-4" />
          חזרה לדף הבית
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
