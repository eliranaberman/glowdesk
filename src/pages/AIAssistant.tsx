
import React, { useState, useEffect, useRef } from 'react';
import { Bot, Calendar, Send, UserRound, Instagram, DollarSign, Bell, ArrowRight, Sparkles, CheckCircle2, Clock, PanelRight, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'completed' | 'in-progress';
  type: 'appointment' | 'message' | 'post' | 'analysis';
  createdAt: Date;
}

interface Suggestion {
  id: string;
  title: string;
  type: 'post' | 'task' | 'reminder' | 'campaign';
  content: string;
  imageUrl?: string;
}

const AIAssistant = () => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'בוקר טוב! איך אני יכולה לעזור לך היום?',
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [todaysName, setTodaysName] = useState('שיר');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const tasks: Task[] = [
    { 
      id: '1', 
      title: 'תזכורת ללקוחה מיכל לגבי התור שלה מחר',
      status: 'completed',
      type: 'message',
      createdAt: new Date(),
    },
    { 
      id: '2', 
      title: 'פוסט שבועי לאינסטגרם הוכן ומחכה לאישור',
      status: 'pending',
      type: 'post',
      createdAt: new Date(),
    },
    { 
      id: '3', 
      title: 'ניתוח הכנסות לשבוע האחרון',
      status: 'in-progress',
      type: 'analysis',
      createdAt: new Date(),
    },
  ];
  
  const suggestions: Suggestion[] = [
    {
      id: '1',
      title: 'פוסט מוצע לאינסטגרם',
      type: 'post',
      content: 'נראה שיש לך 3 מקומות פנויים ביום שלישי. אולי כדאי לפרסם הצעה מיוחדת?',
      imageUrl: 'https://picsum.photos/seed/nails1/300/200'
    },
    {
      id: '2',
      title: 'תזכורת ללקוחה',
      type: 'reminder',
      content: 'רותי לא קבעה תור כבר חודש, כדאי לשלוח לה הודעה.',
    },
    {
      id: '3',
      title: 'משימה מומלצת',
      type: 'task',
      content: 'המלאי של לק ג\'ל בגוון ורוד עומד להיגמר. כדאי להזמין עוד השבוע.',
    },
    {
      id: '4',
      title: 'רעיון לקמפיין',
      type: 'campaign',
      content: 'הקיץ מתקרב! מה דעתך על מבצע "קיץ נוצץ" עם 15% הנחה על מניקור+פדיקור?',
      imageUrl: 'https://picsum.photos/seed/summer/300/200'
    },
  ];
  
  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  const handleSend = () => {
    if (!inputText.trim()) return;
    
    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputText('');
    setIsProcessing(true);
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponses = [
        "אני עובדת על זה! אעדכן אותך בהקדם.",
        "בהחלט, אטפל בזה מיד.",
        "אני מבינה את הבקשה ומטפלת בה.",
        "מעבדת את המידע... רגע בבקשה.",
        "מתחילה לעבוד על זה עכשיו!"
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const newAiMessage: Message = {
        id: Date.now().toString(),
        text: randomResponse,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newAiMessage]);
      setIsProcessing(false);
      
      toast({
        title: "המשימה נוצרה בהצלחה",
        description: "התחלתי לעבוד על הבקשה שלך",
      });
    }, 1500);
  };
  
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    
    // Generate message based on selected category
    let message = '';
    switch(category) {
      case 'appointments':
        message = "אני רוצה לקבוע תורים";
        break;
      case 'messages':
        message = "אני רוצה לשלוח הודעות ללקוחות";
        break;
      case 'instagram':
        message = "אני רוצה הצעה לפוסט יומי לאינסטגרם";
        break;
      case 'analysis':
        message = "אני רוצה לנתח הכנסות והוצאות";
        break;
      case 'follow-ups':
        message = "אני רוצה לעקוב אחרי ביטולים ושינויים";
        break;
    }
    
    if (message) {
      setInputText(message);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'בוקר טוב';
    if (hour < 18) return 'צהריים טובים';
    return 'ערב טוב';
  };
  
  const getTaskStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">הושלם</Badge>;
      case 'in-progress':
        return <Badge variant="inProgress">בתהליך</Badge>;
      case 'pending':
        return <Badge variant="open">ממתין</Badge>;
      default:
        return <Badge>לא ידוע</Badge>;
    }
  };
  
  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="h-4 w-4" />;
      case 'message':
        return <MessageSquare className="h-4 w-4" />;
      case 'post':
        return <Instagram className="h-4 w-4" />;
      case 'analysis':
        return <DollarSign className="h-4 w-4" />;
      default:
        return <CheckCircle2 className="h-4 w-4" />;
    }
  };
  
  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'post':
        return <Instagram className="h-5 w-5 text-primary" />;
      case 'task':
        return <CheckCircle2 className="h-5 w-5 text-oliveGreen" />;
      case 'reminder':
        return <Bell className="h-5 w-5 text-deepNavy" />;
      case 'campaign':
        return <Sparkles className="h-5 w-5 text-softRose" />;
      default:
        return <Bot className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="w-full md:w-auto">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight flex items-center gap-2">
            <Bot className="h-8 w-8 text-primary animate-pulse" />
            העוזרת החכמה שלך
          </h1>
          <p className="text-muted-foreground">
            {getGreeting()}, {todaysName}! הנה כמה דברים שאני יכולה לעזור בהם היום.
          </p>
        </div>
        
        <Button 
          variant="warm" 
          size="lg" 
          className="font-display w-full md:w-auto transform hover:scale-105 transition-all duration-300 group"
        >
          יש לך דקה? תני לי לייעל לך את היום
          <ArrowRight className="mr-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card 
          onClick={() => handleCategoryClick('appointments')}
          className="cursor-pointer transform hover:-translate-y-1 transition-all duration-300 hover:shadow-soft-lg"
        >
          <CardContent className="p-4 flex flex-col items-center">
            <Calendar className="h-8 w-8 text-primary mb-2 mt-2" />
            <span className="text-center">תורים</span>
          </CardContent>
        </Card>
        
        <Card 
          onClick={() => handleCategoryClick('messages')}
          className="cursor-pointer transform hover:-translate-y-1 transition-all duration-300 hover:shadow-soft-lg"
        >
          <CardContent className="p-4 flex flex-col items-center">
            <MessageSquare className="h-8 w-8 text-primary mb-2 mt-2" />
            <span className="text-center">הודעות</span>
          </CardContent>
        </Card>
        
        <Card 
          onClick={() => handleCategoryClick('instagram')}
          className="cursor-pointer transform hover:-translate-y-1 transition-all duration-300 hover:shadow-soft-lg"
        >
          <CardContent className="p-4 flex flex-col items-center">
            <Instagram className="h-8 w-8 text-primary mb-2 mt-2" />
            <span className="text-center">פוסטים</span>
          </CardContent>
        </Card>
        
        <Card 
          onClick={() => handleCategoryClick('analysis')}
          className="cursor-pointer transform hover:-translate-y-1 transition-all duration-300 hover:shadow-soft-lg"
        >
          <CardContent className="p-4 flex flex-col items-center">
            <DollarSign className="h-8 w-8 text-primary mb-2 mt-2" />
            <span className="text-center">ניתוח כלכלי</span>
          </CardContent>
        </Card>
        
        <Card 
          onClick={() => handleCategoryClick('follow-ups')}
          className="cursor-pointer transform hover:-translate-y-1 transition-all duration-300 hover:shadow-soft-lg"
        >
          <CardContent className="p-4 flex flex-col items-center">
            <Bell className="h-8 w-8 text-primary mb-2 mt-2" />
            <span className="text-center">מעקבים</span>
          </CardContent>
        </Card>
      </div>
      
      <Accordion type="single" collapsible defaultValue="suggestions" className="w-full">
        <AccordionItem value="suggestions">
          <AccordionTrigger className="text-lg font-display hover:text-primary">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>המלצות חכמות</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {suggestions.map((suggestion) => (
                <Card key={suggestion.id} className="overflow-hidden transition-all duration-300 hover:shadow-soft-lg transform hover:-translate-y-1">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {getSuggestionIcon(suggestion.type)}
                      <h3 className="font-medium">{suggestion.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{suggestion.content}</p>
                    
                    {suggestion.imageUrl && (
                      <div className="mt-3 rounded-md overflow-hidden">
                        <img 
                          src={suggestion.imageUrl} 
                          alt={suggestion.title}
                          className="w-full h-32 object-cover" 
                        />
                      </div>
                    )}
                    
                    <div className="mt-3 flex justify-end gap-2">
                      <Button size="sm" variant="ghost">דחה</Button>
                      <Button size="sm" variant="warm">אשר</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="tasks">
          <AccordionTrigger className="text-lg font-display hover:text-primary">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>AI עושה בשבילך</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 mt-2">
              {tasks.map((task) => (
                <Card key={task.id} className="transition-all duration-300 hover:shadow-soft-lg">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {getTaskIcon(task.type)}
                        <span className="font-medium">{task.title}</span>
                      </div>
                      {getTaskStatusBadge(task.status)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {task.createdAt.toLocaleDateString('he-IL')} {task.createdAt.toLocaleTimeString('he-IL')}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="history">
          <AccordionTrigger className="text-lg font-display hover:text-primary">
            <div className="flex items-center gap-2">
              <PanelRight className="h-5 w-5 text-primary" />
              <span>היסטוריית שיחות</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 mt-2">
              <Tabs defaultValue="today">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="today">היום</TabsTrigger>
                  <TabsTrigger value="yesterday">אתמול</TabsTrigger>
                  <TabsTrigger value="week">השבוע</TabsTrigger>
                </TabsList>
                <TabsContent value="today">
                  <div className="space-y-2">
                    <div className="bg-accent/30 rounded-lg p-3">
                      <p className="font-medium">בקשה לניתוח לקוחות</p>
                      <p className="text-sm text-muted-foreground">09:45</p>
                    </div>
                    <div className="bg-accent/30 rounded-lg p-3">
                      <p className="font-medium">יצירת פוסט לאינסטגרם</p>
                      <p className="text-sm text-muted-foreground">11:20</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="yesterday">
                  <div className="space-y-2">
                    <div className="bg-accent/30 rounded-lg p-3">
                      <p className="font-medium">שליחת תזכורות ללקוחות</p>
                      <p className="text-sm text-muted-foreground">15:30</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="week">
                  <div className="space-y-2">
                    <div className="bg-accent/30 rounded-lg p-3">
                      <p className="font-medium">ניתוח הכנסות שבועי</p>
                      <p className="text-sm text-muted-foreground">יום ראשון, 14:00</p>
                    </div>
                    <div className="bg-accent/30 rounded-lg p-3">
                      <p className="font-medium">עדכון רשימת תורים</p>
                      <p className="text-sm text-muted-foreground">יום שני, 10:15</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Card className="border-primary/20 transition-all duration-300">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="h-5 w-5 text-primary" />
            <h3 className="font-medium">צ'אט עם העוזרת החכמה</h3>
          </div>
          
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-2xl p-3 ${
                      message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-accent/50 text-foreground'
                    }`}
                  >
                    {message.text}
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-accent/50 text-foreground max-w-[80%] rounded-2xl p-3">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                      <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-.15s]"></div>
                      <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="flex gap-2 mt-4">
            <Input 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="מה תרצי שאעשה עבורך היום?"
              className="flex-1"
            />
            <Button 
              onClick={handleSend} 
              disabled={isProcessing || !inputText.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistant;
