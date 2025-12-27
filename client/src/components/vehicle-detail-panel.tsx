import { 
  X, MapPin, Gauge, Navigation, Radio, Battery, Clock, 
  History, Shield, AlertTriangle, Bell, Activity, Settings, Locate
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Vehicle, Alert } from "@shared/schema";
import { Link } from "wouter";

interface VehicleDetailPanelProps {
  vehicle: Vehicle;
  alerts: Alert[];
  onClose: () => void;
  onFollowVehicle: () => void;
  isFollowing: boolean;
}

export function VehicleDetailPanel({ vehicle, alerts, onClose, onFollowVehicle, isFollowing }: VehicleDetailPanelProps) {
  const vehicleAlerts = alerts.filter(a => a.vehicleId === vehicle.id);
  const unreadAlerts = vehicleAlerts.filter(a => !a.read);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffSeconds < 60) return `${diffSeconds}s atrás`;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}min atrás`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h atrás`;
    return date.toLocaleDateString("pt-BR");
  };

  const getStatusColor = (status: Vehicle["status"]) => {
    switch (status) {
      case "moving": return "text-emerald-500";
      case "stopped": return "text-amber-500";
      case "idle": return "text-amber-500";
      case "offline": return "text-gray-400";
    }
  };

  const getStatusBg = (status: Vehicle["status"]) => {
    switch (status) {
      case "moving": return "bg-emerald-100 dark:bg-emerald-900/30";
      case "stopped": return "bg-amber-100 dark:bg-amber-900/30";
      case "idle": return "bg-amber-100 dark:bg-amber-900/30";
      case "offline": return "bg-gray-100 dark:bg-gray-800";
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

  const getIgnitionLabel = (ignition: Vehicle["ignition"]) => {
    return ignition === "on" ? "Ligada" : "Desligada";
  };

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "speed": return <Gauge className="h-4 w-4" />;
      case "geofence_entry":
      case "geofence_exit":
      case "geofence_dwell": return <Shield className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getAlertColor = (priority: Alert["priority"]) => {
    switch (priority) {
      case "critical": return "text-primary bg-primary/10";
      case "warning": return "text-amber-600 bg-amber-100 dark:bg-amber-900/30";
      default: return "text-blue-600 bg-blue-100 dark:bg-blue-900/30";
    }
  };

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="font-bold text-xl mb-1">{vehicle.name}</h2>
            <p className="text-sm text-muted-foreground">{vehicle.licensePlate}</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-muted transition-colors"
            data-testid="button-close-detail"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        
        {/* Status badge */}
        <div className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold",
          getStatusBg(vehicle.status),
          getStatusColor(vehicle.status)
        )}>
          <span className={cn(
            "w-2 h-2 rounded-full",
            vehicle.status === "moving" ? "bg-emerald-500" :
            vehicle.status === "offline" ? "bg-gray-400" : "bg-amber-500"
          )} />
          {getStatusLabel(vehicle.status)}
        </div>
      </div>

      <Tabs defaultValue="details" className="flex-1 flex flex-col">
        <TabsList className="mx-5 mt-4 p-1 bg-muted/50 rounded-full grid w-auto grid-cols-3">
          <TabsTrigger 
            value="details" 
            className="rounded-full data-[state=active]:bg-card data-[state=active]:shadow-sm"
            data-testid="tab-details"
          >
            Detalhes
          </TabsTrigger>
          <TabsTrigger 
            value="alerts" 
            className="rounded-full data-[state=active]:bg-card data-[state=active]:shadow-sm relative"
            data-testid="tab-alerts"
          >
            Alertas
            {unreadAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                {unreadAlerts.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="activity" 
            className="rounded-full data-[state=active]:bg-card data-[state=active]:shadow-sm"
            data-testid="tab-activity"
          >
            Atividade
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="flex-1 mt-0 overflow-auto">
          <div className="p-5 space-y-5">
            {/* Stats Grid - Airbnb style cards */}
            <div className="grid grid-cols-2 gap-3">
              {/* Speed */}
              <div className="p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Gauge className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Velocidade</span>
                </div>
                <div className={cn(
                  "text-2xl font-bold",
                  vehicle.currentSpeed > vehicle.speedLimit && "text-primary"
                )}>
                  {Math.round(vehicle.currentSpeed)}
                </div>
                <span className="text-sm font-normal text-muted-foreground">km/h</span>
                {vehicle.currentSpeed > vehicle.speedLimit && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-primary">
                    <AlertTriangle className="h-3 w-3" />
                    Limite: {Math.round(vehicle.speedLimit)} km/h
                  </div>
                )}
              </div>
              
              {/* Direction */}
              <div className="p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Navigation className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Direção</span>
                </div>
                <div className="text-2xl font-bold">
                  {vehicle.heading}°
                </div>
              </div>
              
              {/* GPS Accuracy */}
              <div className="p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Precisão GPS</span>
                </div>
                <div className="text-xl font-bold">
                  ±{vehicle.accuracy}m
                </div>
              </div>
              
              {/* Ignition */}
              <div className="p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Radio className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Ignição</span>
                </div>
                <div className={cn(
                  "text-xl font-bold",
                  vehicle.ignition === "on" ? "text-emerald-500" : "text-muted-foreground"
                )}>
                  {getIgnitionLabel(vehicle.ignition)}
                </div>
              </div>
              
              {/* Battery */}
              {vehicle.batteryLevel !== undefined && (
                <div className="p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Battery className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">Bateria</span>
                  </div>
                  <div className="text-xl font-bold">
                    {vehicle.batteryLevel}%
                  </div>
                </div>
              )}
            </div>

            {/* Last Update */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Última atualização: {formatTime(vehicle.lastUpdate)}
            </div>

            {/* Actions - Airbnb style buttons */}
            <div className="space-y-3 pt-3">
              <button
                onClick={onFollowVehicle}
                className={cn(
                  "w-full py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200",
                  isFollowing 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "bg-foreground text-background hover:scale-[1.02] active:scale-[0.98]"
                )}
                data-testid="button-follow-vehicle"
              >
                <Locate className="h-4 w-4" />
                {isFollowing ? "Seguindo veículo" : "Seguir veículo"}
              </button>
              
              <Link href={`/history?vehicleId=${vehicle.id}`}>
                <button 
                  className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border-2 border-border hover:border-foreground/50 transition-all duration-200"
                  data-testid="button-view-history"
                >
                  <History className="h-4 w-4" />
                  Ver histórico
                </button>
              </Link>
              
              <div className="grid grid-cols-2 gap-3">
                <Link href={`/geofences?vehicleId=${vehicle.id}`}>
                  <button 
                    className="w-full py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border-2 border-border hover:border-foreground/50 transition-all duration-200"
                    data-testid="button-create-geofence"
                  >
                    <Shield className="h-4 w-4" />
                    Geofence
                  </button>
                </Link>
                
                <button 
                  className="w-full py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border-2 border-border hover:border-foreground/50 transition-all duration-200"
                  data-testid="button-set-speed-limit"
                >
                  <Settings className="h-4 w-4" />
                  Limite
                </button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <div className="p-5 space-y-3">
              {vehicleAlerts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Bell className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-base font-medium text-foreground mb-1">Nenhum alerta</p>
                  <p className="text-sm text-muted-foreground">Este veículo está operando normalmente</p>
                </div>
              ) : (
                vehicleAlerts.map(alert => (
                  <div 
                    key={alert.id} 
                    className={cn(
                      "p-4 rounded-2xl transition-all duration-200 hover:shadow-md",
                      !alert.read ? "bg-primary/5 ring-1 ring-primary/20" : "bg-muted/30"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn("p-2 rounded-xl", getAlertColor(alert.priority))}>
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTime(alert.timestamp)}
                        </p>
                      </div>
                      {!alert.read && (
                        <div className="h-3 w-3 rounded-full bg-primary flex-shrink-0 mt-1" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="activity" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <div className="p-5 space-y-4">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Últimas atividades</p>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-border" />
                
                <div className="space-y-4">
                  {[
                    { status: "moving", text: "Iniciou movimento", time: "Há 5 minutos", color: "bg-emerald-500" },
                    { status: "stopped", text: "Parou por 12 minutos", time: "Há 17 minutos", color: "bg-amber-500" },
                    { status: "moving", text: "Entrou em área \"Depósito\"", time: "Há 30 minutos", color: "bg-emerald-500" },
                    { status: "alert", text: "Excesso de velocidade: 85 km/h", time: "Há 45 minutos", color: "bg-primary" },
                    { status: "moving", text: "Ignição ligada", time: "Há 1 hora", color: "bg-emerald-500" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4 relative">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center z-10 bg-card ring-4 ring-card",
                        item.color === "bg-primary" ? "bg-primary" : item.color
                      )}>
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm font-medium">{item.text}</p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
