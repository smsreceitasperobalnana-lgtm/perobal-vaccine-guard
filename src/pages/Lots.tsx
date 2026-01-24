import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { mockLots } from '@/data/mockData';
import { VaccineLot } from '@/types/vaccine';
import { format, differenceInDays } from 'date-fns';
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
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, Package, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

export default function Lots() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredLots = mockLots.filter((lot) => {
    const matchesSearch =
      lot.vaccineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lot.lotNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lot.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: VaccineLot['status']) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'low':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'expired':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusBadge = (status: VaccineLot['status']) => {
    const configs = {
      available: { label: 'Disponível', className: 'status-badge-success' },
      low: { label: 'Baixo', className: 'status-badge-warning' },
      critical: { label: 'Crítico', className: 'status-badge-danger' },
      expired: { label: 'Vencido', className: 'status-badge-danger' },
    };
    const config = configs[status];
    return (
      <span className={cn('status-badge', config.className)}>
        {getStatusIcon(status)}
        {config.label}
      </span>
    );
  };

  const getExpiryInfo = (expiryDate: Date) => {
    const daysUntil = differenceInDays(expiryDate, new Date());
    if (daysUntil < 0) return { text: 'Vencido', className: 'text-destructive' };
    if (daysUntil <= 7) return { text: `${daysUntil} dias`, className: 'text-destructive' };
    if (daysUntil <= 30) return { text: `${daysUntil} dias`, className: 'text-warning' };
    return { text: format(expiryDate, 'dd/MM/yyyy'), className: 'text-foreground' };
  };

  return (
    <MainLayout title="Estoque de Lotes" subtitle="Controle de lotes e validade dos imunobiológicos">
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="available">Disponível</SelectItem>
                <SelectItem value="low">Baixo</SelectItem>
                <SelectItem value="critical">Crítico</SelectItem>
                <SelectItem value="expired">Vencido</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Entrada de Lote
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="stat-card border border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{mockLots.length}</p>
                <p className="text-sm text-muted-foreground">Total de Lotes</p>
              </div>
            </div>
          </div>
          <div className="stat-card border border-success/30 bg-success/5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/20">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-success">
                  {mockLots.filter((l) => l.status === 'available').length}
                </p>
                <p className="text-sm text-muted-foreground">Disponíveis</p>
              </div>
            </div>
          </div>
          <div className="stat-card border border-warning/30 bg-warning/5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/20">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">
                  {mockLots.filter((l) => l.status === 'low').length}
                </p>
                <p className="text-sm text-muted-foreground">Estoque Baixo</p>
              </div>
            </div>
          </div>
          <div className="stat-card border border-destructive/30 bg-destructive/5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/20">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">
                  {mockLots.filter((l) => l.status === 'critical').length}
                </p>
                <p className="text-sm text-muted-foreground">Críticos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vacina</TableHead>
                <TableHead>Lote</TableHead>
                <TableHead>Fabricante</TableHead>
                <TableHead>Recebido em</TableHead>
                <TableHead>Validade</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLots.map((lot) => {
                const expiryInfo = getExpiryInfo(lot.expiryDate);
                const stockPercentage = (lot.quantityCurrent / lot.quantityReceived) * 100;
                return (
                  <TableRow
                    key={lot.id}
                    className={cn(
                      lot.status === 'critical' && 'bg-destructive/5',
                      lot.status === 'low' && 'bg-warning/5'
                    )}
                  >
                    <TableCell className="font-medium">{lot.vaccineName}</TableCell>
                    <TableCell>
                      <code className="rounded bg-muted px-2 py-1 text-sm">
                        {lot.lotNumber}
                      </code>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{lot.manufacturer}</TableCell>
                    <TableCell>{format(lot.receivedDate, 'dd/MM/yyyy')}</TableCell>
                    <TableCell className={expiryInfo.className}>{expiryInfo.text}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
                          <div
                            className={cn(
                              'h-full rounded-full',
                              stockPercentage > 50 && 'bg-success',
                              stockPercentage <= 50 && stockPercentage > 20 && 'bg-warning',
                              stockPercentage <= 20 && 'bg-destructive'
                            )}
                            style={{ width: `${stockPercentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {lot.quantityCurrent}/{lot.quantityReceived}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(lot.status)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        •••
                      </Button>
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
