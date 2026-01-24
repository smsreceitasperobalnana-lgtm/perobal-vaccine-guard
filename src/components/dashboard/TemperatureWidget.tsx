import { Thermometer } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TemperatureWidgetProps {
  temperature: number;
  status: 'normal' | 'warning' | 'critical';
  lastUpdate: string;
}

export function TemperatureWidget({ temperature, status, lastUpdate }: TemperatureWidgetProps) {
  const statusConfig = {
    normal: {
      label: 'Normal',
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/30',
      range: '+2°C a +8°C',
    },
    warning: {
      label: 'Atenção',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/30',
      range: 'Fora da faixa ideal',
    },
    critical: {
      label: 'Crítico',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      borderColor: 'border-destructive/30',
      range: 'Ação imediata necessária',
    },
  };

  const config = statusConfig[status];

  return (
    <div className={cn('stat-card border', config.borderColor, config.bgColor)}>
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Temperatura da Câmara Fria
            </p>
            <p className="text-xs text-muted-foreground">Última leitura: {lastUpdate}</p>
          </div>
          
          <div className="flex items-end gap-1">
            <span className={cn('font-display text-5xl font-bold', config.color)}>
              {temperature.toFixed(1)}
            </span>
            <span className={cn('text-2xl font-medium', config.color)}>°C</span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={cn(
                'status-badge',
                status === 'normal' && 'status-badge-success',
                status === 'warning' && 'status-badge-warning',
                status === 'critical' && 'status-badge-danger'
              )}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={cn(
                    'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
                    status === 'normal' && 'bg-success',
                    status === 'warning' && 'bg-warning',
                    status === 'critical' && 'bg-destructive'
                  )}
                />
                <span
                  className={cn(
                    'relative inline-flex h-2 w-2 rounded-full',
                    status === 'normal' && 'bg-success',
                    status === 'warning' && 'bg-warning',
                    status === 'critical' && 'bg-destructive'
                  )}
                />
              </span>
              {config.label}
            </span>
            <span className="text-xs text-muted-foreground">{config.range}</span>
          </div>
        </div>

        <div
          className={cn(
            'flex h-14 w-14 items-center justify-center rounded-2xl',
            config.bgColor
          )}
        >
          <Thermometer className={cn('h-7 w-7', config.color)} />
        </div>
      </div>
    </div>
  );
}
