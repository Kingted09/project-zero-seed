
import { useState, useEffect } from "react";
import { MapPin, Phone, Clock, ChevronRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Resource {
  id: string;
  name: string;
  category: string;
  address: string;
  phone?: string;
  hours?: string;
  distance?: number;
}

const NearbyResources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Sample data for Chinhoyi
  const chinhoyi = {
    lat: -17.3667, 
    lng: 30.2
  };
  
  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Couldn't access your location", {
            description: "Using default location: Chinhoyi"
          });
          // Use Chinhoyi as fallback location
          setUserLocation(chinhoyi);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser", {
        description: "Using default location: Chinhoyi"
      });
      // Use Chinhoyi as fallback location
      setUserLocation(chinhoyi);
    }
  }, []);

  // Fetch resources when location is available
  useEffect(() => {
    if (userLocation) {
      // Simulate fetching data
      setTimeout(() => {
        const fetchedResources: Resource[] = [
          {
            id: "1",
            name: "Chinhoyi Provincial Hospital",
            category: "hospital",
            address: "Magamba Way, Chinhoyi",
            phone: "+263 67 2122461",
            hours: "24/7",
            distance: 0.8
          },
          {
            id: "2",
            name: "ZRP Chinhoyi Central Police",
            category: "police",
            address: "Independence Way, Chinhoyi",
            phone: "+263 67 2122330",
            hours: "24/7",
            distance: 1.5
          },
          {
            id: "3",
            name: "Chinhoyi Fire Department",
            category: "fire",
            address: "Magamba Way, Chinhoyi",
            phone: "+263 67 2122664",
            hours: "24/7",
            distance: 2.1
          },
          {
            id: "4",
            name: "Makonde Christian Hospital",
            category: "hospital",
            address: "Lomagundi Road, Chinhoyi",
            phone: "+263 67 2122873",
            hours: "Mon-Sat: 8am-8pm, Sun: 9am-5pm",
            distance: 4.3
          },
          {
            id: "5",
            name: "Chinhoyi University Health Center",
            category: "clinic",
            address: "Chinhoyi University, Chinhoyi",
            phone: "+263 67 2122100",
            hours: "Mon-Fri: 8am-5pm",
            distance: 3.7
          },
          {
            id: "6",
            name: "Mzimba Pharmacy",
            category: "pharmacy",
            address: "Magamba Way, Chinhoyi",
            phone: "+263 67 2122453",
            hours: "Mon-Sat: 8am-7pm, Sun: 9am-1pm",
            distance: 0.6
          },
          {
            id: "7", 
            name: "Red Cross First Aid Station",
            category: "first_aid",
            address: "15 Magamba Way, Chinhoyi",
            phone: "+263 67 2122664",
            hours: "Mon-Fri: 8am-5pm",
            distance: 1.2
          },
          {
            id: "8",
            name: "Chinhoyi Main Shelter",
            category: "shelter",
            address: "Community Center, Chinhoyi",
            phone: "+263 67 2125431",
            hours: "Available during emergencies",
            distance: 2.8
          },
          {
            id: "9",
            name: "Chinhoyi Food Distribution Center",
            category: "food",
            address: "93 Midway Street, Chinhoyi",
            phone: "+263 67 2125431",
            hours: "Mon-Fri: 10am-3pm",
            distance: 3.2
          },
          {
            id: "10",
            name: "Cell Network Emergency Station",
            category: "communication",
            address: "Chinhoyi Tower, Chinhoyi",
            phone: "+263 67 2122287",
            hours: "24/7 during emergencies",
            distance: 5.4
          },
        ];
        
        setResources(fetchedResources);
        setIsLoading(false);
      }, 1000);
    }
  }, [userLocation]);

  const categories = [
    { id: "hospital", label: "Hospitals" },
    { id: "police", label: "Police" },
    { id: "fire", label: "Fire Dept." },
    { id: "pharmacy", label: "Pharmacy" },
    { id: "shelter", label: "Shelters" },
  ];

  const filteredResources = selectedCategory
    ? resources.filter(resource => resource.category === selectedCategory)
    : resources;

  const sortedResources = [...filteredResources].sort((a, b) => 
    (a.distance || 999) - (b.distance || 999)
  );

  const handleOpenMap = (resource: Resource) => {
    const address = encodeURIComponent(`${resource.name}, ${resource.address}, Chinhoyi, Zimbabwe`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, "_blank");
  };

  const handleCall = (phone?: string) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Nearby Resources</h1>
        <p className="text-muted-foreground">
          Find emergency resources closest to you in Chinhoyi
        </p>
      </div>

      <div className="mb-6 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="mt-3 pt-3 border-t flex justify-between">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4 pb-24">
          {sortedResources.length > 0 ? (
            sortedResources.map(resource => (
              <Card key={resource.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{resource.name}</h3>
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{resource.address}</span>
                      </div>
                      {resource.hours && (
                        <div className="flex items-center mt-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{resource.hours}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium bg-muted px-2 py-1 rounded">
                      {resource.distance ? `${resource.distance.toFixed(1)} km` : 'Unknown'}
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCall(resource.phone)}
                      className="flex-1 mr-2"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenMap(resource)}
                      className="flex-1"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-medium">No resources found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try selecting a different category or check back later
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NearbyResources;
