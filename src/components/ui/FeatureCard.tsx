import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group relative rounded-2xl border-2 border-dark-600 bg-dark-700 p-8 transition-all hover:border-accent-500/30 hover:shadow-xl">
      <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent-500/10 text-accent-400 shadow-lg transition-transform group-hover:scale-110">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-dark-50">{title}</h3>
      <p className="mt-3 text-base leading-relaxed text-dark-200">{description}</p>
    </div>
  );
}