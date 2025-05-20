
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const steps = [
  { id: 'welcome', title: 'Welcome' },
  { id: 'personal-info', title: 'Personal Information' },
  { id: 'location', title: 'Your Location' },
];

const OnboardingFlow = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Chinhoyi');
  const [address, setAddress] = useState('');
  
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: any) => {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user?.id,
          ...profileData
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      navigate('/app');
      toast.success('Profile setup complete!');
    },
    onError: (error: any) => {
      toast.error('Failed to save profile', { 
        description: error.message || 'Please try again'
      });
    }
  });
  
  const handleCompleteOnboarding = () => {
    updateProfileMutation.mutate({
      first_name: firstName,
      last_name: lastName,
      phone,
      city,
      address,
      onboarding_completed: true,
    });
  };
  
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleCompleteOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <div className="flex w-full space-x-1 mt-2">
            {steps.map((_, index) => (
              <div 
                key={index} 
                className={`h-1.5 flex-1 rounded-full ${
                  index <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardHeader>
        
        <CardContent>
          {currentStep === 0 && (
            <div className="space-y-4">
              <p>
                Welcome to Crisis Connect! Let's set up your profile to help you
                get the most out of the app.
              </p>
              <p className="text-sm text-muted-foreground">
                This information helps emergency services assist you better during emergencies.
              </p>
            </div>
          )}
          
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  type="tel"
                />
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Your city"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Your street address"
                />
              </div>
            </div>
          )}
          
          <div className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={nextStep}
            >
              {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingFlow;
