import ImpactCard from './ImpactCard';
import type { Impact } from '@/api/impacts';

type ImpactListProps = {
  impacts: Impact[];
  onSave: (id: number, updates: Partial<Impact>) => void;
  onDelete: (id: number) => void;
  savingId?: number;
  deletingId?: number;
};

export default function ImpactList({
  impacts,
  onSave,
  onDelete,
  savingId,
  deletingId,
}: ImpactListProps) {
  if (impacts.length === 0) {
    return null;
  }

  return (
    <div className='space-y-6'>
      {impacts.map((impact) => (
        <ImpactCard
          key={impact.id}
          impact={impact}
          onSave={onSave}
          onDelete={onDelete}
          isSaving={savingId === impact.id}
          isDeleting={deletingId === impact.id}
        />
      ))}
    </div>
  );
}
