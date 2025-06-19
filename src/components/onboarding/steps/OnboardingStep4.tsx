
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Target, DollarSign, Calendar } from 'lucide-react';

interface OnboardingStep4Props {
  data: any;
  onUpdate: (data: any) => void;
}

const OnboardingStep4 = ({ data, onUpdate }: OnboardingStep4Props) => {
  const occasions = [
    { name: 'יום יום', value: 'daily' },
    { name: 'אירועים מיוחדים', value: 'special-events' },
    { name: 'עבודה/פגישות', value: 'work' },
    { name: 'בילויים', value: 'social' },
  ];

  const budgets = [
    { name: 'עד 100 ש״ח', value: 'low' },
    { name: '100-200 ש״ח', value: 'medium' },
    { name: '200-300 ש״ח', value: 'high' },
    { name: 'מעל 300 ש״ח', value: 'premium' },
  ];

  const maintenanceOptions = [
    { name: 'אני אוהבת לטפח בבית', value: 'diy' },
    { name: 'אני מעדיפה שירות מלא', value: 'full-service' },
    { name: 'משהו באמצע', value: 'mixed' },
  ];

  const updateGoals = (field: string, value: any) => {
    onUpdate({
      goals: {
        ...data.goals,
        [field]: value
      }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-nail-700 mb-2">מה המטרה שלך? 🎯</h3>
        <p className="text-muted-foreground">בואי נותאם את השירות בדיוק לצרכים שלך</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-right mb-3 block">
            <Target className="inline h-4 w-4 ml-2" />
            לאיזה מטרה בעיקר את רוצה לעשות ציפורניים?
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {occasions.map((occasion) => (
              <Button
                key={occasion.value}
                variant={data.goals.occasion === occasion.value ? "default" : "outline"}
                onClick={() => updateGoals('occasion', occasion.value)}
              >
                {occasion.name}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-right mb-3 block">
            <DollarSign className="inline h-4 w-4 ml-2" />
            איזה תקציב נוח לך לטיפול?
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {budgets.map((budget) => (
              <Button
                key={budget.value}
                variant={data.goals.budget === budget.value ? "default" : "outline"}
                onClick={() => updateGoals('budget', budget.value)}
              >
                {budget.name}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-right mb-3 block">
            <Calendar className="inline h-4 w-4 ml-2" />
            איך את מעדיפה לתחזק את הציפורניים?
          </Label>
          <div className="space-y-2">
            {maintenanceOptions.map((option) => (
              <Button
                key={option.value}
                variant={data.goals.maintenance === option.value ? "default" : "outline"}
                onClick={() => updateGoals('maintenance', option.value)}
                className="w-full"
              >
                {option.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-nail-50 rounded-lg text-center">
        <p className="text-sm text-nail-700">
          🎉 כמעט סיימנו! עוד רגע תקבלי המלצות מותאמות אישית
        </p>
      </div>
    </motion.div>
  );
};

export default OnboardingStep4;
