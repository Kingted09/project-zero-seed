
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Define a type for our resource
type Resource = {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  contact_info: string;
  website?: string;
  image_url?: string;
  created_at: string;
}

const ResourceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: resource, isLoading } = useQuery({
    queryKey: ['resource', id],
    queryFn: async () => {
      // Use a type assertion to handle the custom table
      const { data, error } = await supabase
        .from('resources' as any)
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data as unknown as Resource;
    }
  });

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
            <h1 className="text-xl font-bold">
              {isLoading ? <Skeleton className="h-6 w-32" /> : resource?.name}
            </h1>
            <p className="text-xs text-muted-foreground">
              {isLoading ? <Skeleton className="h-4 w-48 mt-1" /> : resource?.category}
            </p>
          </div>
        </div>
      </div>
      
      <div className="page-container">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : (
          <div className="space-y-4">
            {resource?.image_url && (
              <div className="aspect-video w-full rounded-md overflow-hidden">
                <img 
                  src={resource.image_url} 
                  alt={resource?.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Description</h2>
              <p className="text-muted-foreground">{resource?.description || "No description available"}</p>
            </div>
            
            {resource?.location && (
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Location</h2>
                <p className="text-muted-foreground">{resource?.location}</p>
              </div>
            )}
            
            {resource?.contact_info && (
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Contact</h2>
                <p className="text-muted-foreground">{resource?.contact_info}</p>
                
                {resource?.website && (
                  <a 
                    href={resource.website}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="text-primary hover:underline inline-block mt-2"
                  >
                    Visit Website
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceDetail;
