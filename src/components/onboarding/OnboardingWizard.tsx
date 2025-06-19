
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import OnboardingStep1 from './steps/OnboardingStep1';
import OnboardingStep2 from './steps/OnboardingStep2';
import OnboardingStep3 from './steps/OnboardingStep3';
import OnboardingStep4 from './steps/OnboardingStep4';

interface OnboardingData {
  personalInfo: {
    name: string;
    phone: string;
    email: string;
    birthday?: string;
  };
  preferences: {
    favoriteColors: string[];
    skinTone: string;
    nailLength: string;
    style: string;
  };
  history: {
    previousSalon: boolean;
    frequency: string;
    allergies: string[];
  };
  goals: {
    occasion: string;
    budget: string;
    maintenance: string;
  };
}

const OnboardingWizard = ({ onComplete }: { onComplete: (data: OnboardingData) => void }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    personalInfo: { name: '', phone: '', email: '' },
    preferences: { favoriteColors: [], skinTone: '', nailLength: '', style: '' },
    history: { previousSalon: false, frequency: '', allergies: [] },
    goals: { occasion: '', budget: '', maintenance: '' }
  });
  const { toast } = useToast();

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    toast({
      title: "ברוכה הבאה! ✨",
      description: "פרופיל הלקוחה שלך נוצר בהצלחה",
    });
    onComplete(data);
  };

  const updateData = (stepData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...stepData }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <OnboardingStep1 data={data} onUpdate={updateData} />;
      case 2:
        return <OnboardingStep2 data={data} onUpdate={updateData} />;
      case 3:
        return <OnboardingStep3 data={data} onUpdate={updateData} />;
      case 4:
        return <OnboardingStep4 data={data} onUpdate={updateData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nail-50 to-nail-100 flex items-center justify-center p-4" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-6 w-6 text-nail-500 animate-pulse" />
              <CardTitle className="text-2xl font-display text-nail-700">
                בואי ניצור את הפרופיל שלך
              </CardTitle>
            </div>
            <p className="text-muted-foreground">
              כמה שאלות קצרות כדי להכין לך חוויה מותאמת אישית
            </p>
            <div className="mt-4">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                שלב {currentStep} מתוך {totalSteps}
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="px-6 pb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
            
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                חזור
              </Button>
              
              <Button
                onClick={nextStep}
                className="gap-2 bg-nail-500 hover:bg-nail-600"
              >
                {currentStep === totalSteps ? 'סיום' : 'הבא'}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default OnboardingWizard;
