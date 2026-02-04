import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { mockLots, lossReasons } from '@/data/mockData';
import { VaccineLoss } from '@/types/vaccine';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Trash2,
  Thermometer,
  Calendar,
  Package,
} from 'lucide-react';

// Mock data para perdas registradas
const mockLosses: VaccineLoss[] = [
  {
    id: '1',
    date: new Date(),
    vaccineId: 'rotavirus',
    vaccineName: 'Rotavírus Humano',
    lotNumber: 'ROTA456',
    quantity: 3,
    reason: 'expired',
    notes: 'Lote venceu antes do uso completo',
    registeredBy: 'Maria Silva',
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000 * 2),
    vaccineId: 'pentavalente',
    vaccineName: 'Pentavalente (DTP/Hib/HB)',
    lotNumber: 'PENTA789',
    quantity: 2,
    reason: 'broken',
    notes: 'Frasco quebrado durante manuseio',
    registeredBy: 'João Santos',
  },
  {
    id: '3',
    date: new Date(Date.now() - 86400000 * 5),
    vaccineId: 'hepatite-b',
    vaccineName: 'Hepatite B',
    lotNumber: '1234HB56',
    quantity: 5,
    reason: 'temperature',
    notes: 'Falha no refrigerador durante a noite, temperatura atingiu 12°C',
    registeredBy: 'Ana Costa',
  },
];

// Schema de validação
const lossFormSchema = z.object({
  vaccineId: z.string().min(1, 'Selecione uma vacina'),
  lotNumber: z.string().min(1, 'Selecione um lote'),
  quantity: z.coerce.number().min(1, 'Quantidade deve ser pelo menos 1'),
  reason: z.enum(['expired', 'broken', 'temperature', 'contaminated', 'other'], {
    required_error: 'Selecione o motivo da perda',
  }),
  notes: z.string().optional(),
  registeredBy: z.string().min(1, 'Informe o responsável'),
});

type LossFormValues = z.infer<typeof lossFormSchema>;

export default function Losses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [reasonFilter, setReasonFilter] = useState<string>('all');
  const [losses, setLosses] = useState<VaccineLoss[]>(mockLosses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedVaccineId, setSelectedVaccineId] = useState<string>('');
  const { toast } = useToast();

  const form = useForm<LossFormValues>({
    resolver: zodResolver(lossFormSchema),
    defaultValues: {
      vaccineId: '',
      lotNumber: '',
      quantity: 1,
      reason: undefined,
      notes: '',
      registeredBy: '',
    },
  });

  // Filtra lotes disponíveis (não vencidos e com estoque)
  const getAvailableLots = (vaccineId: string) => {
    return mockLots.filter(
      (lot) =>
        lot.vaccineId === vaccineId &&
        lot.quantityCurrent > 0
    );
  };

  const selectedLots = selectedVaccineId ? getAvailableLots(selectedVaccineId) : [];
  const selectedLot = mockLots.find((l) => l.lotNumber === form.watch('lotNumber'));

  // Filtra perdas para exibição
  const filteredLosses = losses.filter((loss) => {
    const matchesSearch =
      loss.vaccineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loss.lotNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesReason = reasonFilter === 'all' || loss.reason === reasonFilter;
    return matchesSearch && matchesReason;
  });

  // Handler de submit
  const onSubmit = (data: LossFormValues) => {
    const lot = mockLots.find((l) => l.lotNumber === data.lotNumber);
    
    if (!lot) {
      toast({
        title: 'Erro',
        description: 'Lote não encontrado.',
        variant: 'destructive',
      });
      return;
    }

    // Validação de estoque
    if (data.quantity > lot.quantityCurrent) {
      toast({
        title: 'Estoque insuficiente',
        description: `O lote ${lot.lotNumber} possui apenas ${lot.quantityCurrent} doses disponíveis.`,
        variant: 'destructive',
      });
      return;
    }

    const newLoss: VaccineLoss = {
      id: Date.now().toString(),
      date: new Date(),
      vaccineId: data.vaccineId,
      vaccineName: lot.vaccineName,
      lotNumber: data.lotNumber,
      quantity: data.quantity,
      reason: data.reason,
      notes: data.notes,
      registeredBy: data.registeredBy,
    };

    setLosses([newLoss, ...losses]);
    
    toast({
      title: 'Perda registrada',
      description: `${data.quantity} dose(s) de ${lot.vaccineName} registrada(s) como perda.`,
    });

    form.reset();
    setSelectedVaccineId('');
    setIsDialogOpen(false);
  };

  // Ícone do motivo
  const getReasonIcon = (reason: VaccineLoss['reason']) => {
    switch (reason) {
      case 'expired':
        return <Calendar className="h-4 w-4" />;
      case 'broken':
        return <Package className="h-4 w-4" />;
      case 'temperature':
        return <Thermometer className="h-4 w-4" />;
      case 'contaminated':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Trash2 className="h-4 w-4" />;
    }
  };

  const getReasonLabel = (reason: VaccineLoss['reason']) => {
    const found = lossReasons.find((r) => r.value === reason);
    return found?.label || 'Outro';
  };

  const getReasonBadgeClass = (reason: VaccineLoss['reason']) => {
    switch (reason) {
      case 'expired':
        return 'bg-warning/10 text-warning border-warning/30';
      case 'temperature':
        return 'bg-info/10 text-info border-info/30';
      case 'broken':
      case 'contaminated':
        return 'bg-destructive/10 text-destructive border-destructive/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  // Estatísticas
  const totalLosses = losses.reduce((sum, l) => sum + l.quantity, 0);
  const lossesToday = losses
    .filter((l) => format(l.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'))
    .reduce((sum, l) => sum + l.quantity, 0);
  const temperatureLosses = losses
    .filter((l) => l.reason === 'temperature')
    .reduce((sum, l) => sum + l.quantity, 0);
  const expiredLosses = losses
    .filter((l) => l.reason === 'expired')
    .reduce((sum, l) => sum + l.quantity, 0);

  // Vacinas únicas dos lotes disponíveis
  const uniqueVaccines = Array.from(
    new Map(mockLots.map((lot) => [lot.vaccineId, { id: lot.vaccineId, name: lot.vaccineName }])).values()
  );

  return (
    <MainLayout title="Registro de Perdas" subtitle="Controle de doses descartadas por vencimento, quebra ou falha de temperatura">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar vacina ou lote..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={reasonFilter} onValueChange={setReasonFilter}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Motivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os motivos</SelectItem>
                {lossReasons.map((reason) => (
                  <SelectItem key={reason.value} value={reason.value}>
                    {reason.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Registrar Perda
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Registrar Perda de Imunobiológico</DialogTitle>
                <DialogDescription>
                  Registre doses descartadas informando o motivo da perda. O estoque será atualizado automaticamente.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="vaccineId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vacina *</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedVaccineId(value);
                            form.setValue('lotNumber', '');
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a vacina" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {uniqueVaccines.map((vaccine) => (
                              <SelectItem key={vaccine.id} value={vaccine.id}>
                                {vaccine.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lotNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lote *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!selectedVaccineId}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={selectedVaccineId ? "Selecione o lote" : "Selecione uma vacina primeiro"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {selectedLots.map((lot) => (
                              <SelectItem key={lot.id} value={lot.lotNumber}>
                                {lot.lotNumber} - Estoque: {lot.quantityCurrent} | Val: {format(lot.expiryDate, 'dd/MM/yy')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {selectedLot && (
                          <p className="text-xs text-muted-foreground">
                            Estoque disponível: {selectedLot.quantityCurrent} doses
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade de Doses *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={selectedLot?.quantityCurrent || 999}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Motivo da Perda *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o motivo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {lossReasons.map((reason) => (
                              <SelectItem key={reason.value} value={reason.value}>
                                {reason.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva detalhes sobre a perda (opcional)"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="registeredBy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Responsável pelo Registro *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do profissional" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter className="pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        form.reset();
                        setSelectedVaccineId('');
                        setIsDialogOpen(false);
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" variant="destructive" className="gap-2">
                      <Trash2 className="h-4 w-4" />
                      Registrar Perda
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="stat-card border border-destructive/30 bg-destructive/5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/20">
                <Trash2 className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">{totalLosses}</p>
                <p className="text-sm text-muted-foreground">Total de Perdas</p>
              </div>
            </div>
          </div>
          <div className="stat-card border border-warning/30 bg-warning/5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/20">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">{lossesToday}</p>
                <p className="text-sm text-muted-foreground">Perdas Hoje</p>
              </div>
            </div>
          </div>
          <div className="stat-card border border-info/30 bg-info/5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/20">
                <Thermometer className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold text-info">{temperatureLosses}</p>
                <p className="text-sm text-muted-foreground">Por Temperatura</p>
              </div>
            </div>
          </div>
          <div className="stat-card border border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{expiredLosses}</p>
                <p className="text-sm text-muted-foreground">Por Vencimento</p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Vacina</TableHead>
                <TableHead>Lote</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Observações</TableHead>
                <TableHead>Responsável</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLosses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    Nenhuma perda registrada.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLosses.map((loss) => (
                  <TableRow key={loss.id}>
                    <TableCell>
                      {format(loss.date, "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell className="font-medium">{loss.vaccineName}</TableCell>
                    <TableCell>
                      <code className="rounded bg-muted px-2 py-1 text-sm">
                        {loss.lotNumber}
                      </code>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-destructive">
                        -{loss.quantity}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
                          getReasonBadgeClass(loss.reason)
                        )}
                      >
                        {getReasonIcon(loss.reason)}
                        {getReasonLabel(loss.reason)}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">
                      {loss.notes || '-'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{loss.registeredBy}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
}
