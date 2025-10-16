import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DangerZoneMap } from "@/components/DangerZoneMap";
import { EmergencyAlertModal } from "@/components/EmergencyAlertModal";
import { Search, ExternalLink, Filter, ShieldCheck, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const totalPages = Math.ceil(filteredSchemes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSchemes = filteredSchemes.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter]);

  const categories = ['all', ...Array.from(new Set(allSchemes.map((s: any) => s.category).filter(Boolean)))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-safe/5">
    <div className="container mx-auto px-4 py-6 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center gap-3 animate-slide-up">
        <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center animate-float">
          <ShieldCheck className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-safe bg-clip-text text-transparent">Women Safety & Empowerment</h1>
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
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedSchemes.map((scheme: any, index: number) => (
              <Card key={scheme.slug || index} className="card-3d group relative overflow-hidden animate-slide-up" style={{animationDelay: `${index * 0.1}s`}} data-testid={`card-scheme-${index}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="space-y-3 relative z-10">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">{scheme.name}</CardTitle>
                  <Badge variant="outline" className="shrink-0 group-hover:scale-105 transition-transform">{scheme.category}</Badge>
                </div>
                <CardDescription className="text-sm line-clamp-2">
                  {scheme.details}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 relative z-10">
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
                  className="w-full group-hover:scale-105 transition-transform" 
                  variant="default"
                  onClick={() => window.open(scheme.applicationUrl || scheme.application || 'https://india.gov.in', '_blank')}
                  data-testid={`button-apply-${index}`}
                >
                  Apply Now
                  <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}

          {paginatedSchemes.length === 0 && (
            <Card className="p-12 col-span-full">
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold">No schemes found</p>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            </Card>
          )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredSchemes.length)} of {filteredSchemes.length} schemes
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
          </>
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
    </div>
  );
}
