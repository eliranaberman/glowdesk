
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Client, ClientGender, ClientStatus } from '@/types/clients';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  full_name: string;
}

interface ClientFormProps {
  initialData?: Client;
  onSubmit: (data: Partial<Client>) => Promise<void>;
  isSubmitting: boolean;
}

const ClientForm = ({ initialData, onSubmit, isSubmitting }: ClientFormProps) => {
  const [formData, setFormData] = useState<Partial<Client>>(
    initialData || {
      full_name: '',
      phone_number: '',
      email: '',
      status: 'lead',
      tags: [],
    }
  );
  const [tagInput, setTagInput] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name')
          .order('full_name');

        if (error) throw error;
        setUsers(data || []);
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };

    loadUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();

      if (formData.tags?.includes(newTag)) {
        return;
      }

      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag)
    }));
  };

  const handleAddTagButton = () => {
    if (tagInput.trim()) {
      const newTag = tagInput.trim();

      if (formData.tags?.includes(newTag)) {
        return;
      }

      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag]
      }));
      setTagInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>פרטים אישיים</CardTitle>
          <CardDescription>הזן את פרטי הלקוח</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="full_name">שם מלא *</Label>
              <Input
                id="full_name"
                name="full_name"
                placeholder="שם מלא"
                required
                value={formData.full_name}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">מספר טלפון *</Label>
              <Input
                id="phone_number"
                name="phone_number"
                placeholder="מספר טלפון"
                required
                dir="ltr"
                value={formData.phone_number}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">אימייל *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="אימייל"
                required
                dir="ltr"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">מגדר</Label>
              <Select
                name="gender"
                value={formData.gender || ''}
                onValueChange={value => handleSelectChange('gender', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר מגדר" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="male">זכר</SelectItem>
                    <SelectItem value="female">נקבה</SelectItem>
                    <SelectItem value="other">אחר</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">סטטוס *</Label>
              <Select
                name="status"
                value={formData.status || 'lead'}
                onValueChange={value => handleSelectChange('status', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר סטטוס" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="lead">ליד</SelectItem>
                    <SelectItem value="active">פעיל</SelectItem>
                    <SelectItem value="inactive">לא פעיל</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assigned_rep">נציג מטפל</Label>
              <Select
                name="assigned_rep"
                value={formData.assigned_rep || ''}
                onValueChange={value => handleSelectChange('assigned_rep', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר נציג מטפל" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.full_name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="registration_date">תאריך הצטרפות</Label>
              <Input
                id="registration_date"
                name="registration_date"
                type="date"
                dir="ltr"
                value={formData.registration_date?.split('T')[0] || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">הערות</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="הערות על הלקוח..."
              value={formData.notes || ''}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="space-y-3">
            <Label>תגיות</Label>
            <div className="flex">
              <Input
                placeholder="הוסף תגית ולחץ Enter"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="rounded-r-none"
              />
              <Button 
                type="button" 
                onClick={handleAddTagButton}
                className="rounded-l-none"
              >
                <Plus className="size-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags?.map(tag => (
                <Badge key={tag} variant="soft" className="flex gap-1 items-center">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:bg-primary/10 rounded-full p-1"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex justify-end w-full">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'שומר...' : initialData ? 'עדכן פרטים' : 'צור לקוח'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
};

export default ClientForm;
