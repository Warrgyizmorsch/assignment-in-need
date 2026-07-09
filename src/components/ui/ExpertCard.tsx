/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Star, ShieldCheck, Award, Briefcase, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardBody, CardFooter } from "./Card";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { Heading } from "./Heading";

export interface ExpertCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  role: string;
  rating?: number;
  ordersCount: number | string;
  avatar: string;
  experience?: string;
  qualifications?: string;
  expertise?: string[];
  variant?: "default" | "directory" | "subject";
  onHire?: () => void;
}

export const ExpertCard: React.FC<ExpertCardProps> = ({
  className,
  name,
  role,
  rating = 4.9,
  ordersCount,
  avatar,
  experience,
  qualifications,
  expertise,
  variant = "default",
  onHire,
  ...props
}) => {
  const isSubjectVariant = variant === "subject";
  const isDirectoryVariant = variant === "directory";

  if (isSubjectVariant) {
    // Subject expert layout matching screenshots (square photo, text elements, primary hire button)
    return (
      <Card hoverEffect={true} className={cn("p-4 gap-3 bg-white border border-primary-100/50 flex flex-col justify-between text-left", className)} {...props}>
        <CardHeader className="p-0 flex flex-col gap-3">
          {/* Square Photo with subtle rounded borders */}
          <div className="relative aspect-square w-full rounded-xl bg-primary-50 overflow-hidden border border-primary-100/30">
            {avatar.length <= 3 ? (
              <div className="w-full h-full flex items-center justify-center font-heading font-extrabold text-2xl text-primary-700 uppercase bg-primary-50">
                {avatar}
              </div>
            ) : (
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
            )}
            <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] font-bold text-success border border-success/15 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-success" />
              Verified
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Heading level={3} className="text-base md:text-lg leading-tight">
              {name}
            </Heading>
            <span className="text-xs font-bold text-accent-600">
              {role}
            </span>
          </div>
        </CardHeader>

        <CardBody className="p-0 flex flex-col gap-2 border-t border-dashed border-primary-50 pt-3">
          {experience && (
            <div className="flex items-center gap-2 text-xs text-text-body font-medium">
              <Briefcase className="w-3.5 h-3.5 text-primary-500 shrink-0" />
              <span>{experience} Experience</span>
            </div>
          )}
          {qualifications && (
            <div className="flex items-center gap-2 text-xs text-text-body font-medium">
              <GraduationCap className="w-3.5 h-3.5 text-primary-500 shrink-0" />
              <span>{qualifications}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <div className="flex items-center gap-0.5 text-warning">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold text-text-heading ml-0.5">{rating.toFixed(1)}</span>
            </div>
            <span>•</span>
            <span className="font-semibold text-text-heading">{ordersCount} Orders</span>
          </div>
        </CardBody>

        <CardFooter className="p-0 w-full mt-2">
          <Button variant="blueOpen" size="sm" fullWidth={true} onClick={onHire}>
            Hire Expert
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (isDirectoryVariant) {
    // Directory listing layout matching screenshots (circular photo, expertise tags, qualifications, info tags, outline button)
    return (
      <Card hoverEffect={true} className={cn("p-5 gap-4 bg-white border border-primary-100/50 flex flex-col justify-between text-left", className)} {...props}>
        <CardHeader className="p-0 flex items-start gap-4">
          <div className="relative w-16 h-16 rounded-full bg-primary-50 border-2 border-primary-100 flex items-center justify-center shrink-0 overflow-hidden">
            {avatar.length <= 3 ? (
              <span className="font-heading font-extrabold text-base text-primary-700 uppercase">{avatar}</span>
            ) : (
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
            )}
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5 shadow-sm border border-primary-100">
              <ShieldCheck className="w-3.5 h-3.5 text-success fill-success/10" />
            </div>
          </div>

          <div className="flex flex-col gap-1 min-w-0">
            <Heading level={3} className="text-base md:text-lg leading-tight truncate">{name}</Heading>
            <Badge variant="soft-purple" className="text-[10px] py-0.5 px-2 w-fit">{role}</Badge>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="flex items-center gap-0.5 text-warning shrink-0">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="font-bold text-text-heading text-xs ml-0.5">{rating.toFixed(1)}</span>
              </div>
              <span className="text-[10px] text-text-muted font-bold">•</span>
              <span className="text-xs text-text-muted shrink-0">{ordersCount} Orders completed</span>
            </div>
          </div>
        </CardHeader>

        <CardBody className="p-0 flex flex-col gap-3 border-t border-dashed border-primary-50 pt-4">
          {expertise && expertise.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-text-muted font-extrabold uppercase tracking-wider">Expertise</span>
              <p className="text-xs text-text-body leading-relaxed line-clamp-2">
                {expertise.join(", ")}
              </p>
            </div>
          )}
          {qualifications && (
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-text-muted font-extrabold uppercase tracking-wider">Qualifications</span>
              <p className="text-xs text-text-heading font-bold flex items-center gap-1.5">
                <Award className="w-4 h-4 text-primary-500 shrink-0" />
                <span>{qualifications}</span>
              </p>
            </div>
          )}
        </CardBody>

        <CardFooter className="p-0 w-full mt-2">
          <Button variant="orangeOpen" size="sm" fullWidth={true} onClick={onHire}>
            Hire Now
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Fallback / default layout
  return (
    <Card hoverEffect={true} className={cn("text-center items-center p-5 gap-3 bg-white", className)} {...props}>
      <CardHeader className="items-center flex flex-col gap-2">
        <div className="relative w-20 h-20 rounded-full bg-primary-50 border-2 border-primary-100/50 flex items-center justify-center overflow-hidden shrink-0">
          {avatar.length <= 3 ? (
            <span className="font-heading font-extrabold text-xl text-primary-700 uppercase">{avatar}</span>
          ) : (
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          )}
          <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5 shadow-sm border border-primary-100">
            <ShieldCheck className="w-4 h-4 text-success fill-success/10" />
          </div>
        </div>

        <div className="flex flex-col items-center mt-2 gap-1">
          <Heading level={3} className="text-lg leading-tight">{name}</Heading>
          <Badge variant="soft-purple" className="text-[10px] py-0.5 px-2">{role}</Badge>
        </div>
      </CardHeader>
      
      <CardBody className="flex flex-col items-center justify-center gap-1 py-1">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-warning text-warning" />
          <span className="font-heading font-bold text-sm text-text-heading">{rating.toFixed(1)}</span>
          <span className="text-xs text-text-muted">(Star Rating)</span>
        </div>
        <span className="text-sm font-semibold text-text-body">
          {ordersCount} Orders Completed
        </span>
      </CardBody>
      
      <CardFooter className="w-full mt-1">
        <Button variant="orangeOpen" size="sm" fullWidth={true} onClick={onHire}>
          Hire This Expert
        </Button>
      </CardFooter>
    </Card>
  );
};
ExpertCard.displayName = "ExpertCard";
