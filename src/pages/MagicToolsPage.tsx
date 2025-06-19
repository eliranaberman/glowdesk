
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Wand2, 
  Brain, 
  Users, 
  Palette,
  ArrowRight 
} from 'lucide-react';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import NailColorRecommendation from '@/components/magic-tools/NailColorRecommendation';
import SmartInsights from '@/components/insights/SmartInsights';
import { AnimatedCard, SparkleButton } from '@/components/ui/enhanced-animations';

const MagicToolsPage = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleOnboardingComplete = (data: any) => {
    console.log('Onboarding completed with data:', data);
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  const magicTools = [
    {
      id: 'color-recommendation',
      title: 'המלצת צבע לק חכמה',
      description: 'אלגוריתם שמתאים לך את הצבע המושלם לפי גוון העור והאירוע',
      icon: <Palette className="h-6 w-6" />,
      color: 'from-pink-500 to-purple-600',
    },
    {
      id: 'smart-insights',
      title: 'תובנות עסקיות מה-AI',
      description: 'המלצות מותאמות אישית לשיפור הביצועים שלך',
      icon: <Brain className="h-6 w-6" />,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      id: 'client-onboarding',
      title: 'חוויית אונבורדינג ללקוחות',
      description: 'מסך היכרות אינטראקטיבי ללקוחות חדשים',
      icon: <Users className="h-6 w-6" />,
      color: 'from-green-500 to-teal-600',
    },
  ];

  return (
    <Layout>
      <Helmet>
        <title>כלי קסם | GlowDesk</title>
      </Helmet>

      <div className="container mx-auto py-6 space-y-6" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-nail-600 to-nail-400 bg-clip-text text-transparent">
            ✨ כלי הקסם שלך ✨
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            טכנולוגיה חכמה שהופכת את העבודה שלך לקסומה ויעילה יותר
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8 bg-white border">
            <TabsTrigger value="overview" className="data-[state=active]:bg-nail-100">
              סקירה
            </TabsTrigger>
            <TabsTrigger value="color-tool" className="data-[state=active]:bg-pink-100">
              המלצת צבעים
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-blue-100">
              תובנות חכמות
            </TabsTrigger>
            <TabsTrigger value="onboarding" className="data-[state=active]:bg-green-100">
              אונבורדינג
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {magicTools.map((tool, index) => (
                <AnimatedCard key={tool.id} delay={index * 0.1}>
                  <Card className="group cursor-pointer border-2 border-transparent hover:border-nail-200 transition-all duration-300">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tool.color} flex items-center justify-center text-white mb-4`}>
                        {tool.icon}
                      </div>
                      <CardTitle className="text-right">{tool.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 text-right">
                        {tool.description}
                      </p>
                      <SparkleButton
                        onClick={() => setActiveTab(tool.id.replace('-', '-tool'))}
                        className="w-full bg-gradient-to-r from-nail-500 to-nail-600 text-white py-2 px-4 rounded-md"
                      >
                        נסי עכשיו
                        <ArrowRight className="mr-2 h-4 w-4" />
                      </SparkleButton>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              ))}
            </div>

            <AnimatedCard delay={0.4}>
              <Card className="bg-gradient-to-r from-nail-50 to-purple-50 border-nail-200">
                <CardContent className="p-8 text-center">
                  <Wand2 className="h-12 w-12 mx-auto mb-4 text-nail-500" />
                  <h3 className="text-2xl font-semibold mb-4">חוויית המשתמש החדשה</h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    אנחנו הוספנו אנימציות חלקות, מעברים רכים, ואפקטי "קסם" שהופכים את השימוש במערכת לחוויה מהנה ואינטואיטיבית יותר.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <span className="px-3 py-1 bg-white rounded-full text-sm">✨ אנימציות חלקות</span>
                    <span className="px-3 py-1 bg-white rounded-full text-sm">🎯 מעברים רכים</span>
                    <span className="px-3 py-1 bg-white rounded-full text-sm">💫 אפקטי hover</span>
                    <span className="px-3 py-1 bg-white rounded-full text-sm">🌟 loading אינטליגנטי</span>
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>
          </TabsContent>

          <TabsContent value="color-tool">
            <NailColorRecommendation />
          </TabsContent>

          <TabsContent value="insights">
            <SmartInsights />
          </TabsContent>

          <TabsContent value="onboarding">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">חוויית אונבורדינג ללקוחות חדשים</CardTitle>
                <p className="text-muted-foreground">
                  מסך היכרות חכם שיוצר פרופיל מותאם אישית לכל לקוחה
                </p>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">מה כלול?</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 text-right">
                      <li>• איסוף פרטים אישיים</li>
                      <li>• זיהוי העדפות צבע וסטייל</li>
                      <li>• היסטוריה וחוויות קודמות</li>
                      <li>• מטרות ותקציב</li>
                    </ul>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">היתרונות</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 text-right">
                      <li>• שירות מותאם אישית</li>
                      <li>• המלצות מדויקות</li>
                      <li>• חסכון בזמן</li>
                      <li>• חוויה מקצועית</li>
                    </ul>
                  </Card>
                </div>
                
                <SparkleButton
                  onClick={() => setShowOnboarding(true)}
                  className="bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 px-8 rounded-lg text-lg font-semibold"
                >
                  <Users className="mr-2 h-5 w-5" />
                  התחילי חוויית אונבורדינג
                </SparkleButton>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MagicToolsPage;
