import { VaccineApplication } from '@/types/vaccine';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Syringe, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RecentApplicationsProps {
  applications: VaccineApplication[];
}

export function RecentApplications({ applications }: RecentApplicationsProps) {
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
    <div className="stat-card border border-border">
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <Syringe className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">
              Aplicações Recentes
            </h3>
            <p className="text-sm text-muted-foreground">Últimas 5 aplicações</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {applications.slice(0, 5).map((app, index) => (
          <div
            key={app.id}
            className="flex items-center gap-4 rounded-lg border border-border bg-muted/30 p-3 transition-colors hover:bg-muted/50"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <span className="font-display text-sm font-bold text-primary">
                {app.vaccineName.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{app.vaccineName}</span>
                <Badge variant="outline" className="text-xs">
                  {doseLabels[app.doseType]}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="font-mono">{app.lotNumber}</span>
                <span>•</span>
                <span>{app.ageGroup}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <User className="h-3 w-3" />
                <span>{app.appliedBy}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {format(app.date, "dd/MM 'às' HH:mm", { locale: ptBR })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
