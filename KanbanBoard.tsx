import { Application, ApplicationStatus, useUpdateApplicationStatus } from '@/hooks/useApplications';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KanbanBoardProps {
  applications: Application[];
}

const columns: { status: ApplicationStatus; title: string; color: string }[] = [
  { status: 'Applied', title: 'Applied', color: 'bg-blue-500' },
  { status: 'Interviewing', title: 'Interview', color: 'bg-yellow-500' },
  { status: 'Offer', title: 'Offer', color: 'bg-green-500' },
];

export function KanbanBoard({ applications }: KanbanBoardProps) {
  const updateStatus = useUpdateApplicationStatus();

  const handleDragStart = (e: React.DragEvent, applicationId: string) => {
    e.dataTransfer.setData('applicationId', applicationId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: ApplicationStatus) => {
    e.preventDefault();
    const applicationId = e.dataTransfer.getData('applicationId');
    updateStatus.mutate({ id: applicationId, status });
  };

  const getApplicationsByStatus = (status: ApplicationStatus) =>
    applications.filter((app) => app.status === status);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((column) => (
        <div
          key={column.status}
          className="space-y-4"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.status)}
        >
          <div className="flex items-center gap-2">
            <div className={cn('h-3 w-3 rounded-full', column.color)} />
            <h3 className="font-semibold">{column.title}</h3>
            <Badge variant="secondary" className="ml-auto">
              {getApplicationsByStatus(column.status).length}
            </Badge>
          </div>

          <div className="space-y-3 min-h-[200px] rounded-lg border border-dashed border-muted-foreground/25 p-3">
            {getApplicationsByStatus(column.status).map((application) => (
              <Card
                key={application.id}
                className="cursor-grab active:cursor-grabbing transition-all hover:shadow-md animate-fade-in"
                draggable
                onDragStart={(e) => handleDragStart(e, application.id)}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm font-medium">
                      {application.job?.title || 'Unknown Job'}
                    </CardTitle>
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {application.job?.company || 'Unknown Company'}
                    </div>
                    {application.job?.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {application.job.location}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {getApplicationsByStatus(column.status).length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">
                No applications yet
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
