
import { Phone, ArrowLeft, MapPin, Users, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DefaultContacts = () => {
  const navigate = useNavigate();
  
  // Default emergency contacts for Chinhoyi
  const emergencyContacts = [
    {
      name: "Chinhoyi Provincial Hospital",
      phone: "+263 67 2122461",
      address: "Magamba Way, Chinhoyi",
      category: "health",
      description: "Main provincial hospital offering emergency services"
    },
    {
      name: "Chinhoyi Central Police Station",
      phone: "+263 67 2122330",
      address: "Independence Way, Chinhoyi",
      category: "police",
      description: "Main police station for emergencies and crime reporting"
    },
    {
      name: "Chinhoyi Fire Department",
      phone: "+263 67 2122664",
      address: "Magamba Way, Chinhoyi",
      category: "fire",
      description: "Fire emergency services for Chinhoyi and surrounding areas"
    },
    {
      name: "Chinhoyi Ambulance Services",
      phone: "+263 67 2122461",
      address: "Provincial Hospital, Chinhoyi",
      category: "ambulance",
      description: "Emergency medical transportation services"
    },
    {
      name: "ZESA Emergency (Electricity)",
      phone: "+263 67 2122225",
      address: "23 Commercial Road, Chinhoyi",
      category: "utility",
      description: "Power outages and electrical emergencies"
    },
    {
      name: "Chinhoyi Municipality",
      phone: "+263 67 2125431",
      address: "93 Midway Street, Chinhoyi",
      category: "government",
      description: "Municipal emergency services and reporting"
    },
    {
      name: "Makonde Christian Hospital",
      phone: "+263 67 2122873",
      address: "Lomagundi Road, Chinhoyi",
      category: "health",
      description: "Private hospital with emergency department"
    },
    {
      name: "Zimbabwe Red Cross (Chinhoyi)",
      phone: "+263 67 2122664",
      address: "15 Magamba Way, Chinhoyi",
      category: "health",
      description: "Disaster response and emergency relief services"
    },
    {
      name: "Chinhoyi Traffic Department",
      phone: "+263 67 2122287",
      address: "Independence Way, Chinhoyi",
      category: "police",
      description: "Traffic emergencies and accidents reporting"
    },
    {
      name: "Chinhoyi Civil Protection Unit",
      phone: "+263 67 2125665",
      address: "Government Complex, Chinhoyi",
      category: "government",
      description: "Disaster management and civil protection"
    },
  ];

  const handleCallContact = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleOpenMap = (address: string) => {
    const encodedAddress = encodeURIComponent(`${address}, Chinhoyi, Zimbabwe`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="page-header border-b border-border">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold flex items-center">
              <Phone className="h-5 w-5 mr-2 text-crisis-red" />
              Emergency Contacts
            </h1>
            <p className="text-xs text-muted-foreground">
              Important contacts for emergencies in Chinhoyi
            </p>
          </div>
        </div>
      </div>
      
      <div className="page-container">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="police">Police</TabsTrigger>
            <TabsTrigger value="fire">Fire</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {emergencyContacts.map((contact, index) => (
              <ContactCard 
                key={index} 
                contact={contact} 
                onCall={handleCallContact} 
                onMap={handleOpenMap} 
              />
            ))}
          </TabsContent>
          
          <TabsContent value="health" className="space-y-4">
            {emergencyContacts
              .filter(contact => contact.category === 'health' || contact.category === 'ambulance')
              .map((contact, index) => (
                <ContactCard 
                  key={index} 
                  contact={contact} 
                  onCall={handleCallContact} 
                  onMap={handleOpenMap} 
                />
              ))}
          </TabsContent>
          
          <TabsContent value="police" className="space-y-4">
            {emergencyContacts
              .filter(contact => contact.category === 'police')
              .map((contact, index) => (
                <ContactCard 
                  key={index} 
                  contact={contact} 
                  onCall={handleCallContact} 
                  onMap={handleOpenMap} 
                />
              ))}
          </TabsContent>
          
          <TabsContent value="fire" className="space-y-4">
            {emergencyContacts
              .filter(contact => contact.category === 'fire')
              .map((contact, index) => (
                <ContactCard 
                  key={index} 
                  contact={contact} 
                  onCall={handleCallContact} 
                  onMap={handleOpenMap} 
                />
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface ContactCardProps {
  contact: {
    name: string;
    phone: string;
    address: string;
    category: string;
    description: string;
  };
  onCall: (phone: string) => void;
  onMap: (address: string) => void;
}

const ContactCard = ({ contact, onCall, onMap }: ContactCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="mb-1">{contact.name}</CardTitle>
            <CardDescription className="text-xs">{contact.description}</CardDescription>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium
            ${contact.category === 'health' || contact.category === 'ambulance' ? 'bg-red-100 text-red-800' : ''}
            ${contact.category === 'police' ? 'bg-blue-100 text-blue-800' : ''}
            ${contact.category === 'fire' ? 'bg-orange-100 text-orange-800' : ''}
            ${contact.category === 'utility' || contact.category === 'government' ? 'bg-green-100 text-green-800' : ''}
          `}>
            {contact.category === 'health' ? 'Health' : ''}
            {contact.category === 'ambulance' ? 'Ambulance' : ''}
            {contact.category === 'police' ? 'Police' : ''}
            {contact.category === 'fire' ? 'Fire' : ''}
            {contact.category === 'utility' ? 'Utility' : ''}
            {contact.category === 'government' ? 'Government' : ''}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          <span>{contact.address}</span>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1 bg-crisis-red hover:bg-crisis-red/90"
            onClick={() => onCall(contact.phone)}
          >
            <Phone className="h-4 w-4 mr-2" /> Call {contact.phone}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onMap(contact.address)}
          >
            <MapPin className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DefaultContacts;
