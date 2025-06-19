
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, Scissors } from 'lucide-react';

interface OnboardingStep3Props {
  data: any;
  onUpdate: (data: any) => void;
}

const OnboardingStep3 = ({ data, onUpdate }: OnboardingStep3Props) => {
  const frequencies = [
    { name: 'כל שבוע', value: 'weekly' },
    { name: 'כל שבועיים', value: 'biweekly' },
    { name: 'פעם בחודש', value: 'monthly' },
    { name: 'לפי צורך', value: 'as-needed' },
  ];

  const commonAllergies = [
    { name: 'אקריליק', value: 'acrylic' },
    { name: 'ג׳ל', value: 'gel' },
    { name: 'אצטון', value: 'acetone' },
    { name: 'לא ידוע על אלרגיות', value: 'none' },
  ];

  const updateHistory = (field: string, value: any) => {
    onUpdate({
      history: {
        ...data.history,
        [field]: value
      }
    });
  };

  const toggleAllergy = (allergyValue: string) => {
    const currentAllergies = data.history.allergies || [];
    const newAllergies = currentAllergies.includes(allergyValue)
      ? currentAllergies.filter((a: string) => a !== allergyValue)
      : [...currentAllergies, allergyValue];
    updateHistory('allergies', newAllergies);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-nail-700 mb-2">ספרי על הניסיון שלך 📚</h3>
        <p className="text-muted-foreground">זה יעזור לנו לתת לך שירות מותאם</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-right mb-3 block">
            <Scissors className="inline h-4 w-4 ml-2" />
            את מגיעה לסלון ציפורניים באופן קבוע?
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={data.history.previousSalon === true ? "default" : "outline"}
              onClick={() => updateHistory('previousSalon', true)}
            >
              כן, אני לקוחה קבועה
            </Button>
            <Button
              variant={data.history.previousSalon === false ? "default" : "outline"}
              onClick={() => updateHistory('previousSalon', false)}
            >
              לא, זה החלטה חדשה
            </Button>
          </div>
        </div>

        <div>
          <Label className="text-right mb-3 block">
            <Clock className="inline h-4 w-4 ml-2" />
            באיזו תדירות את מעדיפה לעשות ציפורניים?
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {frequencies.map((freq) => (
              <Button
                key={freq.value}
                variant={data.history.frequency === freq.value ? "default" : "outline"}
                onClick={() => updateHistory('frequency', freq.value)}
              >
                {freq.name}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-right mb-3 block">
            <AlertTriangle className="inline h-4 w-4 ml-2" />
            יש לך אלרגיות לחומרים מסוימים?
          </Label>
          <div className="space-y-2">
            {commonAllergies.map((allergy) => (
              <div key={allergy.value} className="flex items-center space-x-2 justify-end">
                <Label htmlFor={allergy.value} className="text-sm font-normal">
                  {allergy.name}
                </Label>
                <Checkbox
                  id={allergy.value}
                  checked={data.history.allergies?.includes(allergy.value)}
                  onCheckedChange={() => toggleAllergy(allergy.value)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OnboardingStep3;
