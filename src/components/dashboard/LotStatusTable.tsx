import { VaccineLot } from '@/types/vaccine';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { AlertTriangle, Package, Clock } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface LotStatusTableProps {
  lots: VaccineLot[];
  title?: string;
}

export function LotStatusTable({ lots, title = 'Lotes com Atenção' }: LotStatusTableProps) {
  const getExpiryBadge = (expiryDate: Date) => {
    const daysUntilExpiry = differenceInDays(expiryDate, new Date());
    
    if (daysUntilExpiry < 0) {
      return (
        <span className="status-badge status-badge-danger">
          <AlertTriangle className="h-3 w-3" />
          Vencido
        </span>
      );
    }
    if (daysUntilExpiry <= 7) {
      return (
        <span className="status-badge status-badge-danger">
          <Clock className="h-3 w-3" />
          {daysUntilExpiry} dias
        </span>
      );
    }
    if (daysUntilExpiry <= 30) {
      return (
        <span className="status-badge status-badge-warning">
          <Clock className="h-3 w-3" />
          {daysUntilExpiry} dias
        </span>
      );
    }
    return (
      <span className="status-badge status-badge-success">
        {format(expiryDate, 'dd/MM/yyyy')}
      </span>
    );
  };

  const getStockBadge = (lot: VaccineLot) => {
    const percentage = (lot.quantityCurrent / lot.quantityReceived) * 100;
    
    if (lot.status === 'critical') {
      return (
        <div className="flex items-center gap-2">
          <div className="h-2 w-20 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-destructive"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-sm font-medium text-destructive">
            {lot.quantityCurrent}
          </span>
        </div>
      );
    }
    if (lot.status === 'low') {
      return (
        <div className="flex items-center gap-2">
          <div className="h-2 w-20 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-warning"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-sm font-medium text-warning">
            {lot.quantityCurrent}
          </span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <div className="h-2 w-20 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-success"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm font-medium text-foreground">
          {lot.quantityCurrent}
        </span>
      </div>
    );
  };

  return (
    <div className="table-container">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {lots.length} lotes requerem atenção
            </p>
          </div>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vacina</TableHead>
            <TableHead>Lote</TableHead>
            <TableHead>Fabricante</TableHead>
            <TableHead>Validade</TableHead>
            <TableHead>Estoque</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lots.map((lot) => (
            <TableRow key={lot.id} className={cn(
              lot.status === 'critical' && 'bg-destructive/5',
              lot.status === 'low' && 'bg-warning/5'
            )}>
              <TableCell className="font-medium">{lot.vaccineName}</TableCell>
              <TableCell className="font-mono text-sm">{lot.lotNumber}</TableCell>
              <TableCell className="text-muted-foreground">{lot.manufacturer}</TableCell>
              <TableCell>{getExpiryBadge(lot.expiryDate)}</TableCell>
              <TableCell>{getStockBadge(lot)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
