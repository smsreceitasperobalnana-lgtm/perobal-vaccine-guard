import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { mockTemperatureReadings } from '@/data/mockData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Thermometer, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Temperature() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [temperature, setTemperature] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');

  const handleSubmit = () => {
    const temp = parseFloat(temperature);
    if (isNaN(temp)) {
      toast.error('Informe uma temperatura válida');
      return;
    }
    if (temp < 2 || temp > 8) {
      toast.warning('Temperatura fora da faixa ideal (+2°C a +8°C). Verifique o equipamento!');
    } else {
      toast.success('Temperatura registrada com sucesso!');
    }
    setIsDialogOpen(false);
    setTemperature('');
    setSelectedEquipment('');
  };

  const getTemperatureStatus = (temp: number) => {
    if (temp >= 2 && temp <= 8) {
      return { status: 'normal', label: 'Normal', color: 'text-success' };
    }
    if (temp > 8 && temp <= 10 || temp >= 0 && temp < 2) {
      return { status: 'warning', label: 'Atenção', color: 'text-warning' };
    }
    return { status: 'critical', label: 'Crítico', color: 'text-destructive' };
  };

  const currentTemp = mockTemperatureReadings[0]?.temperatureCelsius || 0;
  const tempStatus = getTemperatureStatus(currentTemp);

  return (
    <MainLayout
      title="Monitoramento de Temperatura"
      subtitle="Controle da cadeia de frio (+2°C a +8°C)"
    >
      <div className="space-y-6">
        {/* Current Temperature Card */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div
            className={cn(
              'stat-card col-span-1 border-2',
              tempStatus.status === 'normal' && 'border-success/30 bg-success/5',
              tempStatus.status === 'warning' && 'border-warning/30 bg-warning/5',
              tempStatus.status === 'critical' && 'border-destructive/30 bg-destructive/5'
            )}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Temperatura Atual
                </p>
                <div className="mt-2 flex items-end gap-1">
                  <span className={cn('font-display text-6xl font-bold', tempStatus.color)}>
                    {currentTemp.toFixed(1)}
                  </span>
                  <span className={cn('text-3xl font-medium', tempStatus.color)}>°C</span>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  {tempStatus.status === 'normal' ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : (
                    <AlertTriangle className={cn('h-5 w-5', tempStatus.color)} />
                  )}
                  <span className={cn('font-medium', tempStatus.color)}>
                    {tempStatus.label}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Faixa ideal: +2°C a +8°C
                </p>
              </div>
              <div
                className={cn(
                  'flex h-16 w-16 items-center justify-center rounded-2xl',
                  tempStatus.status === 'normal' && 'bg-success/20',
                  tempStatus.status === 'warning' && 'bg-warning/20',
                  tempStatus.status === 'critical' && 'bg-destructive/20'
                )}
              >
                <Thermometer className={cn('h-8 w-8', tempStatus.color)} />
              </div>
            </div>
          </div>

          <div className="stat-card border border-border lg:col-span-2">
            <div className="flex items-center justify-between pb-4">
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Registrar Nova Leitura
                </h3>
                <p className="text-sm text-muted-foreground">
                  Registre a temperatura às 8h e 14h diariamente
                </p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nova Leitura
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Thermometer className="h-5 w-5 text-primary" />
                      Registrar Temperatura
                    </DialogTitle>
                    <DialogDescription>
                      Informe a temperatura atual do equipamento de refrigeração.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="equipment">Equipamento</Label>
                      <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o equipamento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ref-01">Refrigerador Principal</SelectItem>
                          <SelectItem value="ref-02">Refrigerador Secundário</SelectItem>
                          <SelectItem value="cx-01">Caixa Térmica 01</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="temp">Temperatura (°C)</Label>
                      <Input
                        id="temp"
                        type="number"
                        step="0.1"
                        placeholder="Ex: 4.5"
                        value={temperature}
                        onChange={(e) => setTemperature(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Faixa ideal: +2°C a +8°C
                      </p>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSubmit}>Registrar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <span className="font-display font-bold text-primary">8h</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Leitura Matinal</p>
                    <p className="text-sm text-muted-foreground">
                      Realizada às 08:00 - {currentTemp.toFixed(1)}°C
                    </p>
                  </div>
                  <CheckCircle className="ml-auto h-5 w-5 text-success" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <span className="font-display font-bold text-muted-foreground">14h</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Leitura Vespertina</p>
                    <p className="text-sm text-muted-foreground">Pendente</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Historical Table */}
        <div className="table-container">
          <div className="border-b border-border px-6 py-4">
            <h3 className="font-display text-lg font-semibold text-foreground">
              Histórico de Leituras
            </h3>
            <p className="text-sm text-muted-foreground">Últimos 7 dias</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Equipamento</TableHead>
                <TableHead>Temperatura</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Responsável</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTemperatureReadings.map((reading) => {
                const status = getTemperatureStatus(reading.temperatureCelsius);
                return (
                  <TableRow
                    key={reading.id}
                    className={cn(
                      status.status === 'warning' && 'bg-warning/5',
                      status.status === 'critical' && 'bg-destructive/5'
                    )}
                  >
                    <TableCell>
                      {format(reading.date, "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell className="font-mono">{reading.time}</TableCell>
                    <TableCell>{reading.equipmentName}</TableCell>
                    <TableCell className={cn('font-bold', status.color)}>
                      {reading.temperatureCelsius.toFixed(1)}°C
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          'status-badge',
                          status.status === 'normal' && 'status-badge-success',
                          status.status === 'warning' && 'status-badge-warning',
                          status.status === 'critical' && 'status-badge-danger'
                        )}
                      >
                        {status.status === 'normal' ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <AlertTriangle className="h-3 w-3" />
                        )}
                        {status.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {reading.responsible}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
}
