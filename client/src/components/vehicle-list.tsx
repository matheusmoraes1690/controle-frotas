import { useState } from "react";
import { Search, Truck, Gauge, AlertTriangle, Signal, SignalZero, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Vehicle } from "@shared/schema";

type FilterType = "all" | "moving" | "stopped" | "alerts" | "offline";

interface VehicleListProps {
  vehicles: Vehicle[];
  selectedVehicleId?: string;
  onSelectVehicle: (vehicle: Vehicle) => void;
  isLoading?: boolean;
}

export function VehicleList({ vehicles, selectedVehicleId, onSelectVehicle, isLoading }: VehicleListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: "all", label: "Todos", count: vehicles.length },
    { key: "moving", label: "Em Movimento", count: vehicles.filter(v => v.status === "moving").length },
    { key: "stopped", label: "Parados", count: vehicles.filter(v => v.status === "stopped" || v.status === "idle").length },
    { key: "alerts", label: "Alertas", count: vehicles.filter(v => v.currentSpeed > v.speedLimit).length },
    { key: "offline", label: "Offline", count: vehicles.filter(v => v.status === "offline").length },
  ];

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    switch (activeFilter) {
      case "moving":
        return vehicle.status === "moving";
      case "stopped":
        return vehicle.status === "stopped" || vehicle.status === "idle";
      case "alerts":
        return vehicle.currentSpeed > vehicle.speedLimit;
      case "offline":
        return vehicle.status === "offline";
      default:
        return true;
    }
  });

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffSeconds < 60) return `${diffSeconds}s`;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}min`;
    return `${Math.floor(diffSeconds / 3600)}h`;
  };

  const getStatusColor = (status: Vehicle["status"]) => {
    switch (status) {
      case "moving": return "bg-emerald-500";
      case "stopped": return "bg-amber-500";
      case "idle": return "bg-amber-500";
      case "offline": return "bg-gray-400";
    }
  };

  const getStatusLabel = (status: Vehicle["status"]) => {
    switch (status) {
      case "moving": return "Em Movimento";
      case "stopped": return "Parado";
      case "idle": return "Ocioso";
      case "offline": return "Offline";
    }
  };

  const getStatusBadgeStyle = (status: Vehicle["status"]) => {
    switch (status) {
      case "moving": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "stopped": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "idle": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "offline": return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-card">
        <div className="p-5 space-y-5">
          <div className="h-12 bg-muted animate-pulse rounded-xl" />
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-10 w-24 bg-muted animate-pulse rounded-full flex-shrink-0" />
            ))}
          </div>
        </div>
        <div className="flex-1 p-5 space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Search */}
      <div className="p-5 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar veículo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 rounded-xl border-2 border-transparent bg-muted/50 focus:border-primary focus:bg-card transition-all text-base"
            data-testid="input-search-vehicle"
          />
        </div>
        
        {/* Filter Pills - Airbnb style */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
          {filters.map(filter => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={cn(
                "flex-shrink-0 px-4 py-2.5 text-sm font-semibold rounded-full border-2 transition-all duration-200 whitespace-nowrap",
                activeFilter === filter.key
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent text-foreground border-border hover:border-foreground/50"
              )}
              data-testid={`filter-${filter.key}`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      {/* Vehicle List */}
      <ScrollArea className="flex-1">
        <div className="px-5 pb-5 space-y-3">
          {filteredVehicles.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-base font-medium text-foreground mb-1">Nenhum veículo encontrado</p>
              <p className="text-sm text-muted-foreground">Tente ajustar os filtros</p>
            </div>
          ) : (
            filteredVehicles.map(vehicle => (
              <button
                key={vehicle.id}
                onClick={() => onSelectVehicle(vehicle)}
                className={cn(
                  "w-full p-4 rounded-2xl text-left transition-all duration-200 group",
                  selectedVehicleId === vehicle.id
                    ? "bg-primary/10 ring-2 ring-primary"
                    : "bg-muted/30 hover:bg-muted/50 hover:shadow-md"
                )}
                data-testid={`vehicle-item-${vehicle.id}`}
              >
                <div className="flex items-center gap-4">
                  {/* Status indicator */}
                  <div className="relative flex-shrink-0">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center",
                      vehicle.status === "moving" ? "bg-emerald-100 dark:bg-emerald-900/30" :
                      vehicle.status === "offline" ? "bg-gray-100 dark:bg-gray-800" :
                      "bg-amber-100 dark:bg-amber-900/30"
                    )}>
                      <Truck className={cn(
                        "h-6 w-6",
                        vehicle.status === "moving" ? "text-emerald-600 dark:text-emerald-400" :
                        vehicle.status === "offline" ? "text-gray-500 dark:text-gray-400" :
                        "text-amber-600 dark:text-amber-400"
                      )} />
                    </div>
                    <div className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-card",
                      getStatusColor(vehicle.status)
                    )} />
                  </div>
                  
                  {/* Vehicle info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-base truncate">{vehicle.name}</span>
                      {vehicle.currentSpeed > vehicle.speedLimit && (
                        <AlertTriangle className="h-4 w-4 text-primary flex-shrink-0" />
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">{vehicle.licensePlate}</p>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Gauge className="h-4 w-4 text-muted-foreground" />
                        <span className={cn(
                          "text-sm font-semibold",
                          vehicle.currentSpeed > vehicle.speedLimit ? "text-primary" : "text-foreground"
                        )}>
                          {Math.round(vehicle.currentSpeed)} km/h
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        {vehicle.status === "offline" ? (
                          <SignalZero className="h-4 w-4" />
                        ) : (
                          <Signal className="h-4 w-4" />
                        )}
                        <span className="text-sm">{formatTime(vehicle.lastUpdate)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status badge and arrow */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={cn(
                      "px-3 py-1.5 text-xs font-semibold rounded-full",
                      getStatusBadgeStyle(vehicle.status)
                    )}>
                      {getStatusLabel(vehicle.status)}
                    </span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
