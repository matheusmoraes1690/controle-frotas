import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Plus, Trash2, Edit2, Car, Search, Filter,
  Gauge, MapPin, Battery, Clock, AlertTriangle, Power
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Vehicle } from "@shared/schema";

type VehicleFormData = {
  name: string;
  licensePlate: string;
  model: string;
  status: "moving" | "stopped" | "idle" | "offline";
  ignition: "on" | "off";
  currentSpeed: number;
  speedLimit: number;
  heading: number;
  latitude: number;
  longitude: number;
  accuracy: number;
  lastUpdate: string;
  batteryLevel?: number;
};

const defaultFormData: VehicleFormData = {
  name: "",
  licensePlate: "",
  model: "",
  status: "offline",
  ignition: "off",
  currentSpeed: 0,
  speedLimit: 80,
  heading: 0,
  latitude: -23.5505,
  longitude: -46.6333,
  accuracy: 5,
  lastUpdate: new Date().toISOString(),
  batteryLevel: 100,
};

const statusLabels: Record<string, string> = {
  moving: "Em movimento",
  stopped: "Parado",
  idle: "Ocioso",
  offline: "Offline",
};

const statusColors: Record<string, string> = {
  moving: "bg-emerald-500",
  stopped: "bg-amber-500",
  idle: "bg-blue-500",
  offline: "bg-gray-400",
};

export default function VehiclesPage() {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deleteConfirmVehicle, setDeleteConfirmVehicle] = useState<Vehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const [formData, setFormData] = useState<VehicleFormData>(defaultFormData);

  const { data: vehicles = [], isLoading } = useQuery<Vehicle[]>({
    queryKey: ["/api/vehicles"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: VehicleFormData) => {
      return apiRequest("POST", "/api/vehicles", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
      toast({ title: "Veículo criado", description: "O veículo foi cadastrado com sucesso." });
      setIsCreateOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Erro", description: "Não foi possível criar o veículo.", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<VehicleFormData> }) => {
      return apiRequest("PATCH", `/api/vehicles/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
      toast({ title: "Veículo atualizado", description: "O veículo foi atualizado com sucesso." });
      setEditingVehicle(null);
      resetForm();
    },
    onError: () => {
      toast({ title: "Erro", description: "Não foi possível atualizar o veículo.", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/vehicles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
      toast({ title: "Veículo excluído", description: "O veículo foi excluído com sucesso." });
      setDeleteConfirmVehicle(null);
    },
    onError: () => {
      toast({ title: "Erro", description: "Não foi possível excluir o veículo.", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData(defaultFormData);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast({ title: "Erro", description: "Digite um nome para o veículo.", variant: "destructive" });
      return;
    }
    if (!formData.licensePlate.trim()) {
      toast({ title: "Erro", description: "Digite a placa do veículo.", variant: "destructive" });
      return;
    }
    createMutation.mutate(formData);
  };

  const handleUpdate = () => {
    if (!editingVehicle) return;
    if (!formData.name.trim()) {
      toast({ title: "Erro", description: "Digite um nome para o veículo.", variant: "destructive" });
      return;
    }
    if (!formData.licensePlate.trim()) {
      toast({ title: "Erro", description: "Digite a placa do veículo.", variant: "destructive" });
      return;
    }
    updateMutation.mutate({ id: editingVehicle.id, data: formData });
  };

  const openEditDialog = (vehicle: Vehicle) => {
    setFormData({
      name: vehicle.name,
      licensePlate: vehicle.licensePlate,
      model: vehicle.model || "",
      status: vehicle.status,
      ignition: vehicle.ignition,
      currentSpeed: vehicle.currentSpeed,
      speedLimit: vehicle.speedLimit,
      heading: vehicle.heading,
      latitude: vehicle.latitude,
      longitude: vehicle.longitude,
      accuracy: vehicle.accuracy,
      lastUpdate: vehicle.lastUpdate,
      batteryLevel: vehicle.batteryLevel,
    });
    setEditingVehicle(vehicle);
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const vehicleStats = {
    total: vehicles.length,
    moving: vehicles.filter(v => v.status === "moving").length,
    stopped: vehicles.filter(v => v.status === "stopped").length,
    idle: vehicles.filter(v => v.status === "idle").length,
    offline: vehicles.filter(v => v.status === "offline").length,
  };

  return (
    <div className="flex flex-col h-full bg-muted/30" data-testid="vehicles-page">
      {/* Header */}
      <div className="p-6 border-b border-border bg-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Cadastro de Veículos</h1>
            <p className="text-muted-foreground">Gerencie a frota de veículos do sistema</p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)} className="gap-2" data-testid="button-create-vehicle">
            <Plus className="h-4 w-4" />
            Novo Veículo
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-500/10">
                  <Car className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{vehicleStats.total}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{vehicleStats.moving}</p>
                  <p className="text-xs text-emerald-600/70 dark:text-emerald-500/70">Em movimento</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{vehicleStats.stopped}</p>
                  <p className="text-xs text-amber-600/70 dark:text-amber-500/70">Parados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{vehicleStats.idle}</p>
                  <p className="text-xs text-blue-600/70 dark:text-blue-500/70">Ociosos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-500/10">
                  <div className="h-3 w-3 rounded-full bg-gray-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{vehicleStats.offline}</p>
                  <p className="text-xs text-gray-500/70">Offline</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-border bg-card/50">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, placa ou modelo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="search-vehicles"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="moving">Em movimento</SelectItem>
              <SelectItem value="stopped">Parado</SelectItem>
              <SelectItem value="idle">Ocioso</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Vehicle List */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Car className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-1">
                {searchTerm || statusFilter !== "all" ? "Nenhum veículo encontrado" : "Nenhum veículo cadastrado"}
              </h3>
              <p className="text-sm text-muted-foreground/70 mb-4">
                {searchTerm || statusFilter !== "all" 
                  ? "Tente ajustar os filtros de busca" 
                  : "Clique no botão acima para adicionar seu primeiro veículo"}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Button onClick={() => setIsCreateOpen(true)} variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Adicionar Veículo
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredVehicles.map((vehicle) => (
                <Card 
                  key={vehicle.id} 
                  className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                  data-testid={`vehicle-card-${vehicle.id}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2.5 rounded-xl",
                          vehicle.status === "moving" && "bg-emerald-100 dark:bg-emerald-900/30",
                          vehicle.status === "stopped" && "bg-amber-100 dark:bg-amber-900/30",
                          vehicle.status === "idle" && "bg-blue-100 dark:bg-blue-900/30",
                          vehicle.status === "offline" && "bg-gray-100 dark:bg-gray-800/50",
                        )}>
                          <Car className={cn(
                            "h-5 w-5",
                            vehicle.status === "moving" && "text-emerald-600 dark:text-emerald-400",
                            vehicle.status === "stopped" && "text-amber-600 dark:text-amber-400",
                            vehicle.status === "idle" && "text-blue-600 dark:text-blue-400",
                            vehicle.status === "offline" && "text-gray-500",
                          )} />
                        </div>
                        <div>
                          <CardTitle className="text-base">{vehicle.name}</CardTitle>
                          <CardDescription className="font-mono text-xs">
                            {vehicle.licensePlate}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "text-[10px] font-medium border-0",
                          vehicle.status === "moving" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400",
                          vehicle.status === "stopped" && "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400",
                          vehicle.status === "idle" && "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400",
                          vehicle.status === "offline" && "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
                        )}
                      >
                        <span className={cn("h-1.5 w-1.5 rounded-full mr-1.5", statusColors[vehicle.status])} />
                        {statusLabels[vehicle.status]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {vehicle.model && (
                      <p className="text-sm text-muted-foreground mb-3">{vehicle.model}</p>
                    )}
                    
                    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Gauge className="h-3.5 w-3.5" />
                        <span>{Math.round(vehicle.currentSpeed)} km/h</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span>Limite: {Math.round(vehicle.speedLimit)} km/h</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Power className={cn("h-3.5 w-3.5", vehicle.ignition === "on" ? "text-emerald-500" : "text-gray-400")} />
                        <span>Ignição {vehicle.ignition === "on" ? "ligada" : "desligada"}</span>
                      </div>
                      {vehicle.batteryLevel !== undefined && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Battery className={cn(
                            "h-3.5 w-3.5",
                            vehicle.batteryLevel > 50 ? "text-emerald-500" : 
                            vehicle.batteryLevel > 20 ? "text-amber-500" : "text-red-500"
                          )} />
                          <span>{vehicle.batteryLevel}%</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                      <Clock className="h-3 w-3" />
                      <span>Atualizado: {formatDate(vehicle.lastUpdate)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-3 border-t border-border">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 h-8"
                        onClick={() => openEditDialog(vehicle)}
                        data-testid={`edit-vehicle-${vehicle.id}`}
                      >
                        <Edit2 className="h-3.5 w-3.5 mr-1.5" />
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteConfirmVehicle(vehicle)}
                        data-testid={`delete-vehicle-${vehicle.id}`}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                        Excluir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Create Vehicle Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Novo Veículo</DialogTitle>
            <DialogDescription>
              Preencha as informações para cadastrar um novo veículo na frota.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Veículo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Caminhão 01"
                  data-testid="input-vehicle-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licensePlate">Placa *</Label>
                <Input
                  id="licensePlate"
                  value={formData.licensePlate}
                  onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })}
                  placeholder="Ex: ABC-1234"
                  data-testid="input-license-plate"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model">Modelo</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="Ex: Volvo FH 460"
                data-testid="input-vehicle-model"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="speedLimit">Limite de Velocidade (km/h)</Label>
                <Input
                  id="speedLimit"
                  type="number"
                  value={formData.speedLimit}
                  onChange={(e) => setFormData({ ...formData, speedLimit: parseInt(e.target.value) || 80 })}
                  min={0}
                  max={200}
                  data-testid="input-speed-limit"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="batteryLevel">Nível da Bateria (%)</Label>
                <Input
                  id="batteryLevel"
                  type="number"
                  value={formData.batteryLevel || 100}
                  onChange={(e) => setFormData({ ...formData, batteryLevel: parseInt(e.target.value) || 100 })}
                  min={0}
                  max={100}
                  data-testid="input-battery"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude Inicial</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.0001"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                  data-testid="input-latitude"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude Inicial</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.0001"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                  data-testid="input-longitude"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreateOpen(false); resetForm(); }}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending} data-testid="button-save-vehicle">
              {createMutation.isPending ? "Salvando..." : "Cadastrar Veículo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Vehicle Dialog */}
      <Dialog open={editingVehicle !== null} onOpenChange={(open) => { if (!open) { setEditingVehicle(null); resetForm(); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Veículo</DialogTitle>
            <DialogDescription>
              Atualize as informações do veículo.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome do Veículo *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Caminhão 01"
                  data-testid="input-edit-vehicle-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-licensePlate">Placa *</Label>
                <Input
                  id="edit-licensePlate"
                  value={formData.licensePlate}
                  onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })}
                  placeholder="Ex: ABC-1234"
                  data-testid="input-edit-license-plate"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-model">Modelo</Label>
              <Input
                id="edit-model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="Ex: Volvo FH 460"
                data-testid="input-edit-vehicle-model"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: "moving" | "stopped" | "idle" | "offline") => 
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger data-testid="select-edit-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="moving">Em movimento</SelectItem>
                    <SelectItem value="stopped">Parado</SelectItem>
                    <SelectItem value="idle">Ocioso</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-ignition">Ignição</Label>
                <Select 
                  value={formData.ignition} 
                  onValueChange={(value: "on" | "off") => 
                    setFormData({ ...formData, ignition: value })
                  }
                >
                  <SelectTrigger data-testid="select-edit-ignition">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on">Ligada</SelectItem>
                    <SelectItem value="off">Desligada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-speedLimit">Limite de Velocidade (km/h)</Label>
                <Input
                  id="edit-speedLimit"
                  type="number"
                  value={formData.speedLimit}
                  onChange={(e) => setFormData({ ...formData, speedLimit: parseInt(e.target.value) || 80 })}
                  min={0}
                  max={200}
                  data-testid="input-edit-speed-limit"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-batteryLevel">Nível da Bateria (%)</Label>
                <Input
                  id="edit-batteryLevel"
                  type="number"
                  value={formData.batteryLevel || 100}
                  onChange={(e) => setFormData({ ...formData, batteryLevel: parseInt(e.target.value) || 100 })}
                  min={0}
                  max={100}
                  data-testid="input-edit-battery"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-latitude">Latitude</Label>
                <Input
                  id="edit-latitude"
                  type="number"
                  step="0.0001"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                  data-testid="input-edit-latitude"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-longitude">Longitude</Label>
                <Input
                  id="edit-longitude"
                  type="number"
                  step="0.0001"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                  data-testid="input-edit-longitude"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditingVehicle(null); resetForm(); }}>
              Cancelar
            </Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending} data-testid="button-update-vehicle">
              {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmVehicle !== null} onOpenChange={(open) => { if (!open) setDeleteConfirmVehicle(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o veículo <strong>{deleteConfirmVehicle?.name}</strong> ({deleteConfirmVehicle?.licensePlate})?
              <br /><br />
              Esta ação não pode ser desfeita. Todos os dados relacionados a este veículo serão perdidos.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmVehicle(null)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteConfirmVehicle && deleteMutation.mutate(deleteConfirmVehicle.id)}
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? "Excluindo..." : "Excluir Veículo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

