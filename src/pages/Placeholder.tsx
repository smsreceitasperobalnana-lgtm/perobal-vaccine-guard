import { MainLayout } from '@/components/layout/MainLayout';
import { Construction } from 'lucide-react';

interface PlaceholderProps {
  title: string;
  subtitle?: string;
}

export default function Placeholder({ title, subtitle = 'Em desenvolvimento' }: PlaceholderProps) {
  return (
    <MainLayout title={title} subtitle={subtitle}>
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
          <Construction className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="mt-6 font-display text-2xl font-bold text-foreground">
          Funcionalidade em Desenvolvimento
        </h2>
        <p className="mt-2 max-w-md text-muted-foreground">
          Esta seção está sendo implementada e estará disponível em breve.
        </p>
      </div>
    </MainLayout>
  );
}
