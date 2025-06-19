
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Palette, Wand2, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ColorRecommendation {
  name: string;
  color: string;
  reason: string;
  trend: string;
  season: string;
}

const NailColorRecommendation = () => {
  const [selectedSkinTone, setSelectedSkinTone] = useState<string>('');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('');
  const [recommendations, setRecommendations] = useState<ColorRecommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const skinTones = [
    { name: 'בהיר', value: 'light', description: 'עור בהיר עם גוונים ורודים' },
    { name: 'בינוני', value: 'medium', description: 'עור בינוני עם גוונים זהובים' },
    { name: 'זית', value: 'olive', description: 'עור עם גוונים ירקרקים' },
    { name: 'כהה', value: 'dark', description: 'עור כהה עם גוונים חמים' },
  ];

  const occasions = [
    { name: 'יום יום', value: 'daily' },
    { name: 'עבודה', value: 'work' },
    { name: 'אירוע מיוחד', value: 'special' },
    { name: 'בילוי', value: 'party' },
  ];

  const colorDatabase = {
    light: {
      daily: [
        { name: 'ורוד פודרה', color: '#F8BBD9', reason: 'מתאים לעור בהיר ונותן מראה טבעי', trend: 'קלאסי', season: 'אביב' },
        { name: 'קורל רך', color: '#FF7F7F', reason: 'מדגיש את הגוון הטבעי', trend: 'טרנדי', season: 'קיץ' },
      ],
      work: [
        { name: 'נוד קלאסי', color: '#D2B48C', reason: 'מקצועי ומעודן', trend: 'טיימלס', season: 'כל השנה' },
        { name: 'סגול עדין', color: '#DDA0DD', reason: 'אלגנטי ושקט', trend: 'מודרני', season: 'סתיו' },
      ],
      special: [
        { name: 'אדום יין', color: '#8B0000', reason: 'דרמטי ואלגנטי לאירועים', trend: 'קלאסי', season: 'חורף' },
        { name: 'זהב מנצנץ', color: '#FFD700', reason: 'מושך עין לאירועים מיוחדים', trend: 'גלאמור', season: 'חורף' },
      ],
      party: [
        { name: 'פוקסיה נוצץ', color: '#FF1493', reason: 'בולט ומושך עין', trend: 'נועז', season: 'קיץ' },
        { name: 'כסף מטאלי', color: '#C0C0C0', reason: 'מודרני ויוקרתי', trend: 'עתידני', season: 'חורף' },
      ],
    },
    medium: {
      daily: [
        { name: 'אפרסק חם', color: '#FFCBA4', reason: 'מתאים לגוונים זהובים', trend: 'טבעי', season: 'קיץ' },
        { name: 'ורוד אפרסק', color: '#FFEAA7', reason: 'מדגיש את החום בעור', trend: 'רך', season: 'אביב' },
      ],
      work: [
        { name: 'חום מעושן', color: '#8B4513', reason: 'מתאים לטונים חמים', trend: 'קלאסי', season: 'סתיו' },
        { name: 'בז׳ חם', color: '#DEB887', reason: 'נייטרלי ומקצועי', trend: 'טיימלס', season: 'כל השנה' },
      ],
      special: [
        { name: 'בורדו עמוק', color: '#800020', reason: 'יוקרתי ומתאים לגוונים חמים', trend: 'קלאסי', season: 'חורף' },
        { name: 'ארד זהוב', color: '#B8860B', reason: 'מדגיש את הגוונים הזהובים', trend: 'עשיר', season: 'סתיו' },
      ],
      party: [
        { name: 'כתום נוצץ', color: '#FF8C00', reason: 'אנרגטי ומתאים לגוון', trend: 'נועז', season: 'קיץ' },
        { name: 'נחושת מטאלי', color: '#B87333', reason: 'חם ומושך עין', trend: 'מטאלי', season: 'סתיו' },
      ],
    },
  };

  const generateRecommendations = () => {
    if (!selectedSkinTone || !selectedOccasion) {
      toast({
        variant: "destructive",
        title: "חסרים פרטים",
        description: "אנא בחרי גוון עור ואירוע כדי לקבל המלצות"
      });
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const recommendations = colorDatabase[selectedSkinTone as keyof typeof colorDatabase]?.[selectedOccasion as keyof typeof colorDatabase.light] || [];
      
      setRecommendations(recommendations);
      setIsGenerating(false);
      
      toast({
        title: "המלצות מוכנות! ✨",
        description: `מצאנו ${recommendations.length} צבעים מושלמים בשבילך`
      });
    }, 2000);
  };

  return (
    <Card className="max-w-4xl mx-auto" dir="rtl">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <Wand2 className="h-6 w-6 text-nail-500" />
          המלצת צבע לק חכמה
        </CardTitle>
        <p className="text-muted-foreground">
          אלגוריתם חכם שמתאים לך את הצבע המושלם לפי גוון העור והאירוע
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Palette className="h-4 w-4" />
              בחרי את גוון העור שלך
            </h3>
            <div className="space-y-2">
              {skinTones.map((tone) => (
                <Button
                  key={tone.value}
                  variant={selectedSkinTone === tone.value ? "default" : "outline"}
                  onClick={() => setSelectedSkinTone(tone.value)}
                  className="w-full text-right justify-start"
                >
                  <div>
                    <div className="font-medium">{tone.name}</div>
                    <div className="text-xs text-muted-foreground">{tone.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              איזה אירוע?
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {occasions.map((occasion) => (
                <Button
                  key={occasion.value}
                  variant={selectedOccasion === occasion.value ? "default" : "outline"}
                  onClick={() => setSelectedOccasion(occasion.value)}
                  className="text-right"
                >
                  {occasion.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={generateRecommendations}
            disabled={isGenerating}
            className="bg-nail-500 hover:bg-nail-600 text-white px-8 py-3"
          >
            {isGenerating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <Sparkles className="h-4 w-4" />
                </motion.div>
                מחשב המלצות...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                קבלי המלצות קסומות
              </>
            )}
          </Button>
        </div>

        <AnimatePresence>
          {recommendations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-center">✨ ההמלצות שלך ✨</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-2 border-nail-200 hover:border-nail-400 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className="w-12 h-12 rounded-full border-2 border-gray-300 shadow-md"
                            style={{ backgroundColor: rec.color }}
                          />
                          <div>
                            <h4 className="font-semibold">{rec.name}</h4>
                            <div className="flex gap-1 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {rec.trend}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {rec.season}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{rec.reason}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default NailColorRecommendation;
