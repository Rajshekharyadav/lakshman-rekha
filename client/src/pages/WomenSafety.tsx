import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DangerZoneMap } from "@/components/DangerZoneMap";
import { EmergencyAlertModal } from "@/components/EmergencyAlertModal";
import { Search, ExternalLink, Filter, ShieldCheck, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function WomenSafety() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);

  // Fetch schemes from API
  const { data: allSchemes = [], isLoading } = useQuery({
    queryKey: ['/api/schemes'],
  });

  const filteredSchemes = allSchemes.filter((scheme: any) => {
    const matchesSearch = searchQuery === '' || 
      scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || scheme.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(allSchemes.map((s: any) => s.category).filter(Boolean)))];

  return (
    <div className="container mx-auto px-4 py-6 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Women Safety & Empowerment</h1>
          <p className="text-muted-foreground mt-1">Government schemes and danger zone alerts</p>
        </div>
      </div>

      {/* Test Emergency Alert */}
      <Card className="border-warning/50 bg-warning/5">
        <CardContent className="pt-6">
          <Button 
            onClick={() => setShowEmergencyAlert(true)}
            variant="outline"
            className="border-warning text-warning hover:bg-warning/10"
            data-testid="button-test-emergency"
          >
            Test Emergency Alert System
          </Button>
        </CardContent>
      </Card>

      {/* Government Schemes Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <h2 className="text-2xl font-semibold">Government Schemes</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search schemes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-schemes"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-40" data-testid="select-category-filter">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading schemes...</span>
          </div>
        )}

        {/* Schemes Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSchemes.map((scheme: any, index: number) => (
              <Card key={scheme.slug || index} className="hover-elevate transition-all" data-testid={`card-scheme-${index}`}>
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg leading-tight">{scheme.name}</CardTitle>
                  <Badge variant="outline" className="shrink-0">{scheme.category}</Badge>
                </div>
                <CardDescription className="text-sm line-clamp-2">
                  {scheme.details}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="font-semibold text-foreground">Benefits:</p>
                    <p className="text-muted-foreground">{scheme.benefits}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Eligibility:</p>
                    <p className="text-muted-foreground">{scheme.eligibility}</p>
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  variant="default"
                  onClick={() => window.open(scheme.applicationUrl || scheme.application || 'https://india.gov.in', '_blank')}
                  data-testid={`button-apply-${index}`}
                >
                  Apply Now
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}

          {filteredSchemes.length === 0 && (
            <Card className="p-12 col-span-full">
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold">No schemes found</p>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            </Card>
          )}
          </div>
        )}
      </div>

      {/* Danger Zone Map */}
      <DangerZoneMap />

      {/* Emergency Alert Modal */}
      <EmergencyAlertModal 
        open={showEmergencyAlert}
        onClose={() => setShowEmergencyAlert(false)}
        location={{ lat: 28.7041, lng: 77.1025 }}
      />
    </div>
  );
}
