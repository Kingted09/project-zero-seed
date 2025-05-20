
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, MapPin, Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useGetProfile } from "@/services/profileService";
import { useUpdateProfile } from "@/services/profileService";
import { Skeleton } from "@/components/ui/skeleton";

const PersonalInfo = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profileData, isLoading, error } = useGetProfile();
  const updateProfileMutation = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    dob: "1985-06-15"
  });

  useEffect(() => {
    if (profileData) {
      console.log("Profile data loaded:", profileData);
      // Extract user metadata from auth or profile data
      const firstName = profileData.first_name || '';
      const lastName = profileData.last_name || '';
      const displayName = profileData.display_name || '';
      
      // Build user name with preference for display_name, then first_name + last_name
      const name = displayName || 
                  (firstName || lastName ? `${firstName} ${lastName}`.trim() : 
                  user?.user_metadata?.full_name || 
                  user?.user_metadata?.name ||
                  user?.email?.split('@')[0] || 
                  '');
      
      setUserInfo({
        name: name,
        firstName: firstName,
        lastName: lastName,
        email: user?.email || '',
        phone: profileData.phone || '',
        address: profileData.address || '',
        dob: profileData.date_of_birth || "1985-06-15" // Use profile DOB if available
      });
    }
  }, [profileData, user]);

  const handleSave = async () => {
    try {
      const [firstName, ...lastNameParts] = userInfo.name.split(' ');
      const lastName = lastNameParts.join(' ');
      
      await updateProfileMutation.mutateAsync({
        first_name: firstName || null,
        last_name: lastName || null,
        phone: userInfo.phone || null,
        address: userInfo.address || null,
        date_of_birth: userInfo.dob || null
      });
      
      toast.success("Profile updated", {
        description: "Your personal information has been updated successfully"
      });
      
      setIsEditing(false);
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      toast.error("Update failed", {
        description: error.message || "There was an error updating your profile"
      });
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-4">
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4">
          <h3 className="font-medium">Failed to load profile</h3>
          <p className="text-sm">{error instanceof Error ? error.message : "Unknown error"}</p>
        </div>
        <Button onClick={() => window.location.reload()}>Try again</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className="page-header border-b border-border">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/app/profile")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Personal Information</h1>
            <p className="text-xs text-muted-foreground">
              Manage your basic profile information
            </p>
          </div>
        </div>
      </div>
      
      <div className="page-container pb-24">
        {isLoading ? (
          <div className="space-y-4 pt-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6 pt-4">
              <h2 className="text-lg font-semibold">Your Details</h2>
              <Button 
                variant={isEditing ? "outline" : "default"} 
                onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
              >
                {isEditing ? "Cancel" : "Edit Information"}
              </Button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-primary mr-2" />
                  <label className="text-sm font-medium">Full Name</label>
                </div>
                {isEditing ? (
                  <Input 
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                  />
                ) : (
                  <div className="p-3 bg-card rounded-md border">
                    {userInfo.name || 'Not set'}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-primary mr-2" />
                  <label className="text-sm font-medium">Email</label>
                </div>
                <div className="p-3 bg-card rounded-md border">
                  {userInfo.email}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-primary mr-2" />
                  <label className="text-sm font-medium">Phone</label>
                </div>
                {isEditing ? (
                  <Input 
                    type="tel"
                    value={userInfo.phone}
                    onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                  />
                ) : (
                  <div className="p-3 bg-card rounded-md border">
                    {userInfo.phone || 'Not set'}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-primary mr-2" />
                  <label className="text-sm font-medium">Address</label>
                </div>
                {isEditing ? (
                  <Textarea 
                    value={userInfo.address}
                    onChange={(e) => setUserInfo({...userInfo, address: e.target.value})}
                  />
                ) : (
                  <div className="p-3 bg-card rounded-md border whitespace-pre-line">
                    {userInfo.address || 'Not set'}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-primary mr-2" />
                  <label className="text-sm font-medium">Date of Birth</label>
                </div>
                {isEditing ? (
                  <Input 
                    type="date"
                    value={userInfo.dob}
                    onChange={(e) => setUserInfo({...userInfo, dob: e.target.value})}
                  />
                ) : (
                  <div className="p-3 bg-card rounded-md border">
                    {userInfo.dob ? new Date(userInfo.dob).toLocaleDateString() : 'Not set'}
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="pt-4">
                  <Button 
                    className="w-full" 
                    onClick={handleSave}
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PersonalInfo;
