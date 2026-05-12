import { CheckCircle2, BookOpen, Target, ArrowRight, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Course } from '@/hooks/useCourses';

interface RoadmapTimelineProps {
  currentSkills: string[];
  missingSkills: string[];
  courses: Course[];
  targetJob?: string;
}

export function RoadmapTimeline({
  currentSkills,
  missingSkills,
  courses,
  targetJob,
}: RoadmapTimelineProps) {
  // Group courses by skill
  const coursesBySkill = courses.reduce((acc, course) => {
    if (!acc[course.skill_tag]) {
      acc[course.skill_tag] = [];
    }
    acc[course.skill_tag].push(course);
    return acc;
  }, {} as Record<string, Course[]>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row items-stretch gap-4">
        {/* Step 1: Current State */}
        <Card className="flex-1 border-match-high/50 bg-match-high/5 animate-fade-in">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-match-high text-white">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <CardTitle className="text-base">Current Skills</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {currentSkills.length > 0 ? (
                currentSkills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="bg-match-high/20">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No skills added yet. Update your profile to get started.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Arrow */}
        <div className="hidden lg:flex items-center">
          <ArrowRight className="h-8 w-8 text-muted-foreground" />
        </div>

        {/* Step 2: Bridge the Gap */}
        <Card className="flex-1 border-match-medium/50 bg-match-medium/5 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-match-medium text-white">
                <BookOpen className="h-5 w-5" />
              </div>
              <CardTitle className="text-base">Bridge The Gap</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {missingSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {missingSkills.map((skill) => (
                  <Badge key={skill} variant="outline" className="border-match-low text-match-low">
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Apply to jobs to see skill gaps.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Arrow */}
        <div className="hidden lg:flex items-center">
          <ArrowRight className="h-8 w-8 text-muted-foreground" />
        </div>

        {/* Step 3: Target Job */}
        <Card className="flex-1 border-primary/50 bg-primary/5 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                <Target className="h-5 w-5" />
              </div>
              <CardTitle className="text-base">Target Role</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {targetJob ? (
              <p className="font-medium">{targetJob}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Set your target role in your profile.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recommended Courses */}
      {missingSkills.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recommended Courses</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {missingSkills.map((skill) => {
              const skillCourses = coursesBySkill[skill] || [];
              if (skillCourses.length === 0) return null;

              return skillCourses.map((course) => (
                <Card key={course.id} className="animate-fade-in">
                  <CardHeader className="pb-2">
                    <Badge variant="outline" className="w-fit">{course.skill_tag}</Badge>
                    <CardTitle className="text-base">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Provider: {course.provider || 'Unknown'}
                    </p>
                    {course.url && (
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <a href={course.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Start Learning
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ));
            })}
          </div>
        </div>
      )}
    </div>
  );
}
