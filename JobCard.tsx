import { MapPin, Building2, DollarSign, Calendar, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Job } from '@/hooks/useJobs';
import { SkillAnalysis, getMatchScoreColor } from '@/lib/skillAnalysis';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface JobCardProps {
  job: Job;
  analysis: SkillAnalysis;
  onApply: (jobId: string) => void;
  hasApplied: boolean;
}

export function JobCard({ job, analysis, onApply, hasApplied }: JobCardProps) {
  const scoreColor = getMatchScoreColor(analysis.matchScore);

  return (
    <Card className="group transition-all duration-200 hover:shadow-card-hover animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              {job.company}
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn(
              'shrink-0 font-semibold',
              scoreColor === 'high' && 'border-match-high bg-match-high/10 text-match-high',
              scoreColor === 'medium' && 'border-match-medium bg-match-medium/10 text-match-medium',
              scoreColor === 'low' && 'border-match-low bg-match-low/10 text-match-low'
            )}
          >
            {analysis.matchScore}% Match
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          {job.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {job.location}
            </div>
          )}
          {job.salary_range && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              {job.salary_range}
            </div>
          )}
          {job.posted_at && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDistanceToNow(new Date(job.posted_at), { addSuffix: true })}
            </div>
          )}
        </div>

        {job.source && (
          <Badge variant="secondary" className="text-xs">
            {job.source}
          </Badge>
        )}

        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {analysis.matchedSkills.map((skill) => (
              <Badge key={skill} variant="outline" className="border-match-high/50 bg-match-high/5 text-match-high">
                {skill}
              </Badge>
            ))}
            {analysis.missingSkills.map((skill) => (
              <Badge key={skill} variant="outline" className="border-match-low/50 bg-match-low/5 text-match-low">
                {skill}
              </Badge>
            ))}
          </div>

          {analysis.missingSkills.length > 0 && (
            <p className="text-xs text-match-low">
              Missing: {analysis.missingSkills.join(', ')}
            </p>
          )}
        </div>

        {job.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {job.description}
          </p>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            className="flex-1"
            onClick={() => onApply(job.id)}
            disabled={hasApplied}
          >
            {hasApplied ? 'Applied' : 'Apply Now'}
          </Button>
          <Button variant="outline" size="icon">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
