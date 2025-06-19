
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { User, Phone, Mail, Calendar } from 'lucide-react';

interface OnboardingStep1Props {
  data: any;
  onUpdate: (data: any) => void;
}

const OnboardingStep1 = ({ data, onUpdate }: OnboardingStep1Props) => {
  const updatePersonalInfo = (field: string, value: string) => {
    onUpdate({
      personalInfo: {
        ...data.personalInfo,
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
        <h3 className="text-xl font-semibold text-nail-700 mb-2">בואי נכיר! 👋</h3>
        <p className="text-muted-foreground">ספרי לנו קצת על עצמך</p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Label htmlFor="name" className="text-right">שם מלא</Label>
          <div className="relative">
            <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              placeholder="איך קוראים לך?"
              value={data.personalInfo.name}
              onChange={(e) => updatePersonalInfo('name', e.target.value)}
              className="pr-10"
              dir="rtl"
            />
          </div>
        </div>

        <div className="relative">
          <Label htmlFor="phone" className="text-right">מספר טלפון</Label>
          <div className="relative">
            <Phone className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              placeholder="050-123-4567"
              value={data.personalInfo.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              className="pr-10"
              dir="rtl"
            />
          </div>
        </div>

        <div className="relative">
          <Label htmlFor="email" className="text-right">אימייל (אופציונלי)</Label>
          <div className="relative">
            <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={data.personalInfo.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              className="pr-10"
              dir="ltr"
            />
          </div>
        </div>

        <div className="relative">
          <Label htmlFor="birthday" className="text-right">תאריך לידה (אופציונלי)</Label>
          <div className="relative">
            <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="birthday"
              type="date"
              value={data.personalInfo.birthday || ''}
              onChange={(e) => updatePersonalInfo('birthday', e.target.value)}
              className="pr-10"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OnboardingStep1;
