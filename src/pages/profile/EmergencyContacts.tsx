
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Plus, User, Phone, Heart, Mail, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useGetContacts, useAddEmergencyContact, useDeleteContact, Contact } from "@/services/contactsService";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

const EmergencyContacts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: contacts, isLoading, error } = useGetContacts();
  const addEmergencyContactMutation = useAddEmergencyContact();
  const deleteContactMutation = useDeleteContact();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<Partial<Contact>>({
    name: "",
    relationship: "",
    phone: "",
    email: ""
  });
  const [editIndex, setEditIndex] = useState<string | null>(null);

  const handleOpenDialog = (contact?: Contact) => {
    if (contact) {
      setCurrentContact(contact);
      setEditIndex(contact.id);
    } else {
      setCurrentContact({ 
        name: "", 
        relationship: "", 
        phone: "", 
        email: "",
        is_emergency_contact: true
      });
      setEditIndex(null);
    }
    setIsDialogOpen(true);
  };

  const handleSaveContact = async () => {
    if (!currentContact.name || !currentContact.phone) {
      toast.error("Missing information", {
        description: "Please provide at least a name and phone number"
      });
      return;
    }

    // Validate phone number
    const phoneRegex = /^[+\d\s()-]{7,20}$/;
    if (!phoneRegex.test(currentContact.phone || "")) {
      toast.error("Invalid phone number", {
        description: "Please enter a valid phone number"
      });
      return;
    }

    // Validate email if provided
    if (currentContact.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(currentContact.email)) {
        toast.error("Invalid email", {
          description: "Please enter a valid email address"
        });
        return;
      }
    }
    
    try {
      // Remove the is_emergency_contact flag from currentContact to avoid potential conflicts
      // and let the service handle this properly
      const { is_emergency_contact, ...contactData } = currentContact;
      
      await addEmergencyContactMutation.mutateAsync({
        name: contactData.name || "",
        phone: contactData.phone || "",
        email: contactData.email || null,
        relationship: contactData.relationship || null,
      });
      
      toast.success(editIndex !== null ? "Contact updated" : "Contact added", {
        description: editIndex !== null 
          ? "Your emergency contact has been updated successfully" 
          : "Your emergency contact has been added successfully"
      });
      
      setIsDialogOpen(false);
    } catch (e) {
      console.error("Failed to save contact:", e);
      toast.error("Save failed", {
        description: "There was an error saving your contact"
      });
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      await deleteContactMutation.mutateAsync(id);
      
      toast.success("Contact deleted", {
        description: "Your emergency contact has been removed"
      });
      
      setIsDialogOpen(false);
    } catch (e) {
      console.error("Failed to delete contact:", e);
      toast.error("Delete failed", {
        description: "There was an error removing your contact"
      });
    }
  };

  // Filter only emergency contacts
  const emergencyContacts = contacts?.filter(contact => contact.is_emergency_contact) || [];

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Emergency Contacts</h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" /> Add Contact
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-full flex items-center p-4 bg-card rounded-lg shadow-subtle">
              <Skeleton className="h-10 w-10 rounded-full mr-3" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-6" />
            </div>
          ))}
        </div>
      ) : emergencyContacts.length > 0 ? (
        <div className="space-y-3">
          {emergencyContacts.map((contact) => (
            <button
              key={contact.id}
              className="w-full flex items-center justify-between p-4 bg-card rounded-lg shadow-subtle hover:bg-accent/50 transition-colors"
              onClick={() => handleOpenDialog(contact)}
            >
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">{contact.name}</h3>
                  <p className="text-xs text-muted-foreground">{contact.relationship || "Emergency Contact"}</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground mr-2">{contact.phone}</span>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted rounded-lg">
          <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
          <h3 className="text-xl font-medium mb-2">No Emergency Contacts</h3>
          <p className="text-muted-foreground mb-6">Add contacts to notify during emergencies</p>
          <Button onClick={() => handleOpenDialog()}>
            Add Your First Contact
          </Button>
        </div>
      )}

      <div className="mt-8">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate("/app/profile")}
        >
          Back to Profile
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editIndex !== null ? "Edit" : "Add"} Emergency Contact</DialogTitle>
            <DialogDescription>
              These contacts will be notified during emergencies
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                placeholder="Contact name"
                value={currentContact.name || ""}
                onChange={(e) => setCurrentContact({...currentContact, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Relationship</label>
              <Input
                placeholder="E.g. Spouse, Parent, Friend"
                value={currentContact.relationship || ""}
                onChange={(e) => setCurrentContact({...currentContact, relationship: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input
                type="tel"
                placeholder="Phone number"
                value={currentContact.phone || ""}
                onChange={(e) => setCurrentContact({...currentContact, phone: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input
                type="email"
                placeholder="Email address for notifications"
                value={currentContact.email || ""}
                onChange={(e) => setCurrentContact({...currentContact, email: e.target.value})}
              />
              <p className="text-xs text-muted-foreground">
                Email is required for emergency notifications
              </p>
            </div>
          </div>
          
          <DialogFooter className="flex items-center justify-between">
            {editIndex !== null && (
              <Button 
                variant="destructive" 
                onClick={() => {
                  if (editIndex) {
                    handleDeleteContact(editIndex);
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
            )}
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveContact}>
                {editIndex !== null ? "Update" : "Add"} Contact
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmergencyContacts;
