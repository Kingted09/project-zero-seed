
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Droplet, AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useGetProfile, useUpdateProfile } from "@/services/profileService";
import { Skeleton } from "@/components/ui/skeleton";

const MedicalInfo = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading } = useGetProfile();
  const updateProfileMutation = useUpdateProfile();
  
  const [isAllergyDialogOpen, setIsAllergyDialogOpen] = useState(false);
  const [newAllergy, setNewAllergy] = useState("");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [bloodType, setBloodType] = useState("");
  const [medications, setMedications] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  
  // Load profile data
  useEffect(() => {
    if (profile) {
      setBloodType(profile.blood_type || "");
      setMedications(profile.medications || "");
      setMedicalConditions(profile.medical_conditions || "");
      
      // Parse allergies from comma-separated string
      if (profile.allergies) {
        setAllergies(profile.allergies.split(',').map(item => item.trim()));
      }
    }
  }, [profile]);
  
  const handleAddAllergy = async () => {
    if (!newAllergy.trim()) return;
    
    const updatedAllergies = [...allergies, newAllergy.trim()];
    setAllergies(updatedAllergies);
    
    // Update in the database
    try {
      await updateProfileMutation.mutateAsync({
        allergies: updatedAllergies.join(', ')
      });
      
      toast.success("Allergy Added", {
        description: `Added ${newAllergy} to your medical information`
      });
      
      setNewAllergy("");
      setIsAllergyDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update allergies", {
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    }
  };
  
  const handleRemoveAllergy = async (index: number) => {
    const updatedAllergies = allergies.filter((_, i) => i !== index);
    setAllergies(updatedAllergies);
    
    // Update in the database
    try {
      await updateProfileMutation.mutateAsync({
        allergies: updatedAllergies.join(', ')
      });
      
      toast.success("Allergy Removed", {
        description: "Your medical information has been updated"
      });
    } catch (error) {
      toast.error("Failed to update allergies", {
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    }
  };
  
  const handleSaveMedicalInfo = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        blood_type: bloodType,
        medications,
        medical_conditions: medicalConditions
      });
      
      toast.success("Medical Information Updated", {
        description: "Your medical information has been saved"
      });
      
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update medical information", {
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    }
  };

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
            <h1 className="text-xl font-bold flex items-center">
              <Droplet className="h-5 w-5 mr-2 text-red-500" />
              Medical Information
            </h1>
            <p className="text-xs text-muted-foreground">
              Your important medical details for emergencies
            </p>
          </div>
        </div>
      </div>
      
      <div className="page-container pb-24">
        {isLoading ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Personal Health Record</h2>
              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={() => isEditing ? handleSaveMedicalInfo() : setIsEditing(true)}
              >
                {isEditing ? "Save Changes" : "Edit Information"}
              </Button>
            </div>
            
            <div className="space-y-6">
              {/* Blood Type */}
              <div className="space-y-2">
                <Label htmlFor="bloodType">Blood Type</Label>
                {isEditing ? (
                  <Select 
                    value={bloodType} 
                    onValueChange={setBloodType}
                  >
                    <SelectTrigger id="bloodType">
                      <SelectValue placeholder="Select your blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unknown">Unknown</SelectItem>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-3 bg-card rounded-md border">
                    {bloodType || "Not specified"}
                  </div>
                )}
              </div>
              
              {/* Allergies */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Allergies</Label>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsAllergyDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
                
                {allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {allergies.map((allergy, index) => (
                      <div 
                        key={index} 
                        className="px-2 py-1 text-xs bg-red-50 text-red-700 rounded-full flex items-center"
                      >
                        {allergy}
                        <button 
                          className="ml-1 p-0.5 rounded-full hover:bg-red-200"
                          onClick={() => handleRemoveAllergy(index)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-card rounded-md border text-muted-foreground text-sm">
                    No allergies specified
                  </div>
                )}
              </div>
              
              {/* Medications */}
              <div className="space-y-2">
                <Label htmlFor="medications">Current Medications</Label>
                {isEditing ? (
                  <Textarea 
                    id="medications"
                    value={medications}
                    onChange={(e) => setMedications(e.target.value)}
                    placeholder="List your current medications"
                    className="min-h-[100px]"
                  />
                ) : (
                  <div className="p-3 bg-card rounded-md border text-sm whitespace-pre-line">
                    {medications || "No medications specified"}
                  </div>
                )}
              </div>
              
              {/* Medical Conditions */}
              <div className="space-y-2">
                <Label htmlFor="conditions">Medical Conditions</Label>
                {isEditing ? (
                  <Textarea 
                    id="conditions"
                    value={medicalConditions}
                    onChange={(e) => setMedicalConditions(e.target.value)}
                    placeholder="List any medical conditions"
                    className="min-h-[100px]"
                  />
                ) : (
                  <div className="p-3 bg-card rounded-md border text-sm whitespace-pre-line">
                    {medicalConditions || "No medical conditions specified"}
                  </div>
                )}
              </div>
              
              <div className="flex pt-4">
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/app/profile")}
                >
                  Back to Profile
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Add Allergy Dialog */}
      <Dialog open={isAllergyDialogOpen} onOpenChange={setIsAllergyDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Allergy</DialogTitle>
            <DialogDescription>
              Add allergies to your medical profile for emergency situations.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="allergy" className="text-sm font-medium">
                Allergy
              </label>
              <Input
                id="allergy"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="e.g., Penicillin, Nuts, Shellfish"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAllergyDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddAllergy}>
              Add Allergy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicalInfo;
