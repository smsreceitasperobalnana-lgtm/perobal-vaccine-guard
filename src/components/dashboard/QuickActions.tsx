import { Link } from 'react-router-dom';
import { Syringe, Package, Thermometer, AlertTriangle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function QuickActions() {
  const actions = [
    {
      label: 'Registrar Aplicação',
      icon: Syringe,
      href: '/applications',
      variant: 'default' as const,
    },
    {
      label: 'Registrar Temperatura',
      icon: Thermometer,
      href: '/temperature',
      variant: 'outline' as const,
    },
    {
      label: 'Entrada de Lote',
      icon: Package,
      href: '/lots',
      variant: 'outline' as const,
    },
    {
      label: 'Registrar Perda',
      icon: AlertTriangle,
      href: '/losses',
      variant: 'outline' as const,
    },
  ];

  return (
    <div className="stat-card border border-border">
      <div className="pb-4">
        <h3 className="font-display text-lg font-semibold text-foreground">
          Ações Rápidas
        </h3>
        <p className="text-sm text-muted-foreground">Acesso rápido às principais funções</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link key={action.label} to={action.href}>
            <Button
              variant={action.variant}
              className="h-auto w-full flex-col gap-2 py-4"
            >
              <action.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
