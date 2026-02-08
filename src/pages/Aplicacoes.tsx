import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { mockApplications, vaccines, ageGroups, doseTypes, mockLots } from '@/data/mockData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
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
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Syringe, User, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function Aplicacoes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState('');
  const [selectedLot, setSelectedLot] = useState('');
  const [selectedDose, setSelectedDose] = useState('');
  const [selectedAge, setSelectedAge] = useState('');

  const filteredApplications = mockApplications.filter((app) =>
    app.vaccineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.lotNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableLots = mockLots.filter(
    (lot) =>
      lot.vaccineId === selectedVaccine &&
      lot.status !== 'expired' &&
      lot.quantityCurrent > 0
  );

  const handleSubmit = () => {
    if (!selectedVaccine || !selectedLot || !selectedDose || !selectedAge) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    toast.success('Aplicação registrada com sucesso!');
    setIsDialogOpen(false);
    setSelectedVaccine('');
    setSelectedLot('');
    setSelectedDose('');
    setSelectedAge('');
  };

  const doseLabels: Record<string, string> = {
    D1: '1ª Dose',
    D2: '2ª Dose',
    D3: '3ª Dose',
    DU: 'Dose Única',
    REF: 'Reforço',
    REF1: '1º Reforço',
    REF2: '2º Reforço',
  };

  return (
    <MainLayout title="Aplicações" subtitle="Registro de doses aplicadas">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar aplicações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Registrar Aplicação
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Syringe className="h-5 w-5 text-primary" />
                  Registrar Aplicação
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados da vacinação. Apenas lotes válidos e com estoque serão exibidos.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="vaccine">Vacina *</Label>
                  <Select value={selectedVaccine} onValueChange={(value) => {
                    setSelectedVaccine(value);
                    setSelectedLot('');
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a vacina" />
                    </SelectTrigger>
                    <SelectContent>
                      {vaccines.map((vaccine) => (
                        <SelectItem key={vaccine.id} value={vaccine.id}>
                          {vaccine.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="lot">Lote *</Label>
                  <Select
                    value={selectedLot}
                    onValueChange={setSelectedLot}
                    disabled={!selectedVaccine}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        selectedVaccine
                          ? availableLots.length > 0
                            ? "Selecione o lote"
                            : "Nenhum lote disponível"
                          : "Selecione uma vacina primeiro"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {availableLots.map((lot) => (
                        <SelectItem key={lot.id} value={lot.lotNumber}>
                          <div className="flex items-center gap-2">
                            <span>{lot.lotNumber}</span>
                            <span className="text-xs text-muted-foreground">
                              (Val: {format(lot.expiryDate, 'dd/MM/yy')} | Est: {lot.quantityCurrent})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedVaccine && availableLots.length === 0 && (
                    <p className="text-sm text-destructive">
                      Não há lotes válidos disponíveis para esta vacina.
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="dose">Tipo de Dose *</Label>
                    <Select value={selectedDose} onValueChange={setSelectedDose}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {doseTypes.map((dose) => (
                          <SelectItem key={dose.value} value={dose.value}>
                            {dose.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="age">Faixa Etária *</Label>
                    <Select value={selectedAge} onValueChange={setSelectedAge}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {ageGroups.map((age) => (
                          <SelectItem key={age} value={age}>
                            {age}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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

        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="stat-card border border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Syringe className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockApplications.filter(
                    (a) => format(a.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                  ).length}
                </p>
                <p className="text-sm text-muted-foreground">Aplicações Hoje</p>
              </div>
            </div>
          </div>
          <div className="stat-card border border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockApplications.length}
                </p>
                <p className="text-sm text-muted-foreground">Total do Mês</p>
              </div>
            </div>
          </div>
          <div className="stat-card border border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <User className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">3</p>
                <p className="text-sm text-muted-foreground">Profissionais Ativos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Vacina</TableHead>
                <TableHead>Lote</TableHead>
                <TableHead>Dose</TableHead>
                <TableHead>Faixa Etária</TableHead>
                <TableHead>Aplicador</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>
                    {format(app.date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </TableCell>
                  <TableCell className="font-medium">{app.vaccineName}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-2 py-1 text-sm">
                      {app.lotNumber}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{doseLabels[app.doseType]}</Badge>
                  </TableCell>
                  <TableCell>{app.ageGroup}</TableCell>
                  <TableCell className="text-muted-foreground">{app.appliedBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
}
