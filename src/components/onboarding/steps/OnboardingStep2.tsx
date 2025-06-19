
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Palette, Hand, Sparkles } from 'lucide-react';

interface OnboardingStep2Props {
  data: any;
  onUpdate: (data: any) => void;
}

const OnboardingStep2 = ({ data, onUpdate }: OnboardingStep2Props) => {
  const colors = [
    { name: 'אדום קלאסי', value: 'red', color: '#DC2626' },
    { name: 'ורוד רך', value: 'pink', color: '#EC4899' },
    { name: 'סגול מלכותי', value: 'purple', color: '#7C3AED' },
    { name: 'כחול נייבי', value: 'blue', color: '#1D4ED8' },
    { name: 'ירוק עדין', value: 'green', color: '#059669' },
    { name: 'שחור אלגנטי', value: 'black', color: '#000000' },
    { name: 'לבן טהור', value: 'white', color: '#FFFFFF' },
    { name: 'נוד טבעי', value: 'nude', color: '#D2B48C' },
  ];

  const skinTones = [
    { name: 'בהיר', value: 'light' },
    { name: 'בינוני', value: 'medium' },
    { name: 'כהה', value: 'dark' },
    { name: 'זית', value: 'olive' },
  ];

  const nailLengths = [
    { name: 'קצר', value: 'short' },
    { name: 'בינוני', value: 'medium' },
    { name: 'ארוך', value: 'long' },
    { name: 'מאוד ארוך', value: 'extra-long' },
  ];

  const styles = [
    { name: 'קלאסי', value: 'classic' },
    { name: 'טרנדי', value: 'trendy' },
    { name: 'אלגנטי', value: 'elegant' },
    { name: 'עכשווי', value: 'modern' },
  ];

  const updatePreferences = (field: string, value: any) => {
    onUpdate({
      preferences: {
        ...data.preferences,
        [field]: value
      }
    });
  };

  const toggleColor = (colorValue: string) => {
    const currentColors = data.preferences.favoriteColors || [];
    const newColors = currentColors.includes(colorValue)
      ? currentColors.filter((c: string) => c !== colorValue)
      : [...currentColors, colorValue];
    updatePreferences('favoriteColors', newColors);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-nail-700 mb-2">מה הסטייל שלך? 💅</h3>
        <p className="text-muted-foreground">בואי נכיר את ההעדפות שלך</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-right mb-3 block">
            <Palette className="inline h-4 w-4 ml-2" />
            אילו צבעים את הכי אוהבת? (אפשר לבחור כמה)
          </Label>
          <div className="grid grid-cols-4 gap-2">
            {colors.map((color) => (
              <Button
                key={color.value}
                variant={data.preferences.favoriteColors?.includes(color.value) ? "default" : "outline"}
                onClick={() => toggleColor(color.value)}
                className="h-16 flex flex-col items-center justify-center gap-1 text-xs"
              >
                <div 
                  className="w-6 h-6 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: color.color }}
                />
                {color.name}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-right mb-3 block">
            <Hand className="inline h-4 w-4 ml-2" />
            איך תאפיינת את גוון העור שלך?
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {skinTones.map((tone) => (
              <Button
                key={tone.value}
                variant={data.preferences.skinTone === tone.value ? "default" : "outline"}
                onClick={() => updatePreferences('skinTone', tone.value)}
              >
                {tone.name}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-right mb-3 block">איזה אורך ציפורניים את מעדיפה?</Label>
          <div className="grid grid-cols-2 gap-2">
            {nailLengths.map((length) => (
              <Button
                key={length.value}
                variant={data.preferences.nailLength === length.value ? "default" : "outline"}
                onClick={() => updatePreferences('nailLength', length.value)}
              >
                {length.name}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-right mb-3 block">
            <Sparkles className="inline h-4 w-4 ml-2" />
            איזה סטייל מתאים לך?
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {styles.map((style) => (
              <Button
                key={style.value}
                variant={data.preferences.style === style.value ? "default" : "outline"}
                onClick={() => updatePreferences('style', style.value)}
              >
                {style.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OnboardingStep2;
