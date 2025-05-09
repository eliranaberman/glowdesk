
import { Shield, Briefcase, User, Scissors } from 'lucide-react';

const RoleDescriptions = () => {
  const roles = [
    {
      name: 'מנהל מערכת (admin)',
      description: 'גישה מלאה לכל חלקי המערכת כולל ניהול משתמשים, הרשאות, והגדרות מערכת.',
      permissions: 'גישה מלאה לכל המשאבים והפעולות במערכת.',
      icon: Shield,
      color: 'text-red-500',
    },
    {
      name: 'בעל עסק (owner)',
      description: 'גישה מלאה לניהול העסק, כולל נתונים פיננסיים, דוחות, והגדרות.',
      permissions: 'גישה מלאה לנתוני העסק, ללא אפשרות לנהל הרשאות או משתמשים אחרים.',
      icon: Briefcase,
      color: 'text-blue-500',
    },
    {
      name: 'עובד (employee)',
      description: 'גישה בסיסית לניהול לקוחות, יומן, ומלאי בהתאם להרשאות.',
      permissions: 'קריאה וכתיבה בסיסית במשאבים של לקוחות, פגישות ומלאי.',
      icon: User,
      color: 'text-green-500',
    },
    {
      name: 'מנהל מדיה חברתית (social_manager)',
      description: 'מתמקד בניהול מדיה חברתית, תוכן שיווקי ותקשורת עם לקוחות.',
      permissions: 'ניהול מלא של תוכן שיווקי, פרסומים ברשתות חברתיות והודעות.',
      icon: Scissors,
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role) => (
          <div key={role.name} className="border rounded-lg p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full bg-muted ${role.color}`}>
                <role.icon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">{role.name}</h3>
                <p className="text-sm text-muted-foreground">{role.description}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  <span className="font-semibold">הרשאות:</span> {role.permissions}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-3 rounded-md bg-muted/50 border text-sm">
        <p className="font-medium mb-1">הערה חשובה:</p>
        <p className="text-muted-foreground">
          משתמש יכול להחזיק במספר תפקידים במקביל. ההרשאות שלו יהיו סכום כל ההרשאות מכל התפקידים.
        </p>
      </div>
    </div>
  );
};

export default RoleDescriptions;
